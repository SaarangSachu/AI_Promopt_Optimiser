
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

# Load env variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("❌ ERROR: GEMINI_API_KEY not found in .env")
    exit(1)

print(f"✅ Found API Key: {GEMINI_API_KEY[:5]}...{GEMINI_API_KEY[-4:]}")

def test_generation():
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        # Using gemini-2.5-flash as requested
        model = genai.GenerativeModel('models/gemini-2.5-flash')
        
        category = "Fitness"
        user_text = "I want to lose weight"
        
        prompt = f"""
        You are an expert {category} consultant. The user has this request: "{user_text}".
        Generate 3 to 5 short, specific clarifying questions to help you understand their goal better.
        
        STRICT RULES:
        1. Return ONLY a valid JSON array. No markdown, no code blocks, no explanation.
        2. Each item must have:
           - "id": unique string identifier (e.g., "goal_specifics")
           - "label": Short question text (max 5 words)
           - "placeholder": Example answer (max 5 words)
           - "reason": Why you are asking (max 5 words)
        
        Example JSON format:
        [
            {{"id": "diet", "label": "Dietary Restrictions?", "placeholder": "Vegan, Keto, None", "reason": "Tailor meal plan"}},
            {{"id": "time", "label": "Time per day?", "placeholder": "30 mins, 1 hour", "reason": "Schedule fit"}}
        ]
        """
        
        print("\n🚀 Sending request to Gemini (models/gemini-2.0-flash)...")
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        print("\n📄 Raw Response from Gemini:")
        print("--------------------------------------------------")
        print(content)
        print("--------------------------------------------------")
        
        # Cleanup markdown
        if content.startswith("```"):
            content = content.replace("```json", "").replace("```", "")
            
        questions = json.loads(content)
        print(f"\n✅ Successfully parsed JSON! Found {len(questions)} questions.")
        for q in questions:
            print(f" - {q.get('label')}")

    except Exception as e:
        print(f"\n❌ FAILED: {e}")

if __name__ == "__main__":
    test_generation()
