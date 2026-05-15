# backend/main.py
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from questions_logic import get_questions_for_category
from scoring_logic import calculate_category_scores
from optimization_logic import optimize_with_gemini
from gemini_questions import generate_questions_with_gemini


# --- 1. SECURITY CONFIGURATION ---
# Load environment variables from .env file
load_dotenv()

# Retrieve secrets safely
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CREDENTIALS_PATH = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS", "serviceAccountKey.json")

# Security Checks
if not GEMINI_API_KEY:
    raise ValueError("CRITICAL: GEMINI_API_KEY is missing from .env file!")

if not os.path.exists(CREDENTIALS_PATH):
    raise FileNotFoundError(
        f"CRITICAL: Service Account Key not found at: {CREDENTIALS_PATH}")

app = FastAPI()

# --- 2. INITIALIZE FIREBASE ---
cred = credentials.Certificate(CREDENTIALS_PATH)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

# --- 3. LOAD AI MODEL ---
print("Loading AI Model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("AI Model Loaded!")

# --- 4. CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    # In production, replace with specific domain e.g., ["http://localhost:5173"]
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 5. DEFINE CATEGORIES ---
CATEGORIES = {
    "coding": {"anchor": "Write computer code, debug software, build a website, python, react.", "keywords": ["code", "python", "script", "debug", "react", "css"]},
    "data_analysis": {"anchor": "Analyze data, charts, statistics, forecast trends, excel, pandas.", "keywords": ["data", "analysis", "chart", "csv", "pandas"]},
    "academic": {"anchor": "Write academic paper, research essay, thesis, citation.", "keywords": ["essay", "thesis", "research", "citation"]},
    "literature": {"anchor": "Write creative story, novel, poem, plot.", "keywords": ["story", "novel", "poem", "plot"]},
    "marketing": {"anchor": "Create marketing strategy, social media post, ad copy.", "keywords": ["marketing", "ad", "sales", "copy"]},
    "fitness": {"anchor": "Workout plan, exercise routine, diet, muscle gain, weight loss.", "keywords": ["workout", "gym", "muscle", "diet", "weight"]},
    "cooking": {"anchor": "Cooking recipe, ingredients, meal prep, cuisine.", "keywords": ["cook", "recipe", "food", "dinner"]},
    "travel": {"anchor": "Plan travel itinerary, vacation, hotels, budget.", "keywords": ["travel", "trip", "vacation", "hotel"]},
    "design": {"anchor": "Visual art, logo design, user interface, figma.", "keywords": ["design", "logo", "ui", "ux"]},
    "emotional": {"anchor": "Personal advice, relationship conflict, stress, life coaching.", "keywords": ["sad", "stress", "relationship", "lonely", "help"]},
    "general": {"anchor": "General inquiry, miscellaneous, random topic.", "keywords": ["general", "help", "misc"]}
}

# --- 6. MEMORY SYSTEM ---
learned_memory = {key: [] for key in CATEGORIES.keys()}
negative_memory = {key: [] for key in CATEGORIES.keys()}


def load_memories():
    global learned_memory, negative_memory
    print("Downloading Memories...")
    try:
        # Positive
        docs = db.collection('ai_memory').stream()
        for doc in docs:
            d = doc.to_dict()
            if d.get('category_id') in learned_memory:
                learned_memory[d.get('category_id')].append(d.get('text'))
        # Negative
        neg_docs = db.collection('ai_memory_negative').stream()
        for doc in neg_docs:
            d = doc.to_dict()
            if d.get('category_id') in negative_memory:
                negative_memory[d.get('category_id')].append(d.get('text'))
    except Exception as e:
        print(f"Memory Load Error: {e}")


load_memories()

category_ids = list(CATEGORIES.keys())
category_anchors = [data["anchor"] for data in CATEGORIES.values()]
category_embeddings = model.encode(category_anchors)

# --- REQUEST MODELS ---


class AnalysisRequest(BaseModel):
    text: str


class OptimizeRequest(BaseModel):
    draft_prompt: str


class FeedbackRequest(BaseModel):
    text: str
    category_id: str
    rating: int

class QuestionGenRequest(BaseModel):
    text: str
    category_id: str


# --- ENDPOINTS ---


@app.post("/analyze")
async def analyze_prompt(request: AnalysisRequest):
    user_text = request.text.lower()

    best_category, confidence = calculate_category_scores(
        user_text, model, CATEGORIES, category_ids, category_embeddings, learned_memory, negative_memory
    )

    prefills = {}
    if best_category == "coding":
        if "python" in user_text:
            prefills["language"] = "Python"
        elif "react" in user_text:
            prefills["language"] = "React"
    if best_category == "fitness":
        if "loss" in user_text:
            prefills["goal"] = "Weight Loss"
        elif "muscle" in user_text:
            prefills["goal"] = "Muscle Gain"

    
    # Try Dynamic Generation with Fallback
    try:
        dynamic_questions = generate_questions_with_gemini(GEMINI_API_KEY, best_category, user_text)
    except Exception as e:
        print(f"Dynamic Generation Failed, using fallback: {e}")
        dynamic_questions = get_questions_for_category(best_category, user_text)

    return {
        "category_id": best_category,
        "confidence": float(confidence),
        "questions": dynamic_questions,
        "prefilled_answers": prefills
    }


@app.post("/generate_questions")
async def generate_questions_endpoint(request: QuestionGenRequest):
    try:
        questions = generate_questions_with_gemini(GEMINI_API_KEY, request.category_id, request.text)
        return {"questions": questions}
    except Exception as e:
        print(f"Dynamic Generation Failed (Endpoint), using fallback: {e}")
        # Global fallback logic if specific category logic fails or just raw text
        questions = get_questions_for_category(request.category_id, request.text)
        return {"questions": questions}


@app.post("/optimize")
async def optimize_endpoint(request: OptimizeRequest):
    # Pass the secure key to the logic function
    final_text = optimize_with_gemini(request.draft_prompt, GEMINI_API_KEY)
    return {"optimized_prompt": final_text}


@app.post("/feedback")
async def feedback_endpoint(request: FeedbackRequest):
    try:
        # Validate Category ID to prevent crashes
        category = request.category_id
        if category not in learned_memory:
            # Fallback to general or log warning
            if "general" in learned_memory:
                category = "general"
            else:
                # Extreme fallback if even general is missing (unlikely)
                return {"status": "error", "message": "Invalid category ID"}

        if request.rating == 1:
            if request.text not in learned_memory[category]:
                learned_memory[category].append(request.text)
                db.collection('ai_memory').add(
                    {'text': request.text, 'category_id': category, 'timestamp': firestore.SERVER_TIMESTAMP})
        else:
            if request.text not in negative_memory[category]:
                negative_memory[category].append(request.text)
                db.collection('ai_memory_negative').add(
                    {'text': request.text, 'category_id': category, 'timestamp': firestore.SERVER_TIMESTAMP})
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
