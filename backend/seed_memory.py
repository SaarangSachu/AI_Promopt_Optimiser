import firebase_admin
from firebase_admin import credentials, firestore

# 1. Connect to Firebase
cred = credentials.Certificate("serviceAccountKey.json")
# Check if app is already initialized to prevent errors if run multiple times
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

print("🔥 Connected to Firebase! Preparing to teach the AI...")

# 2. THE TRAINING DATA
training_data = [
    # --- CODING ---
    {"text": "write a python script to automate emails", "category_id": "coding"},
    {"text": "fix this javascript async bug", "category_id": "coding"},
    {"text": "convert this code to java", "category_id": "coding"},
    {"text": "create a login page using html css", "category_id": "coding"},
    {"text": "how to use useEffect in react", "category_id": "coding"},
    {"text": "optimize this sql query", "category_id": "coding"},
    {"text": "build a todo app using react", "category_id": "coding"},
    {"text": "debug segmentation fault in c", "category_id": "coding"},
    {"text": "how do i deploy a django app", "category_id": "coding"},
    {"text": "create a chatbot using python", "category_id": "coding"},
    {"text": "what is mvc architecture", "category_id": "coding"},
    {"text": "explain object oriented programming", "category_id": "coding"},
    {"text": "how to connect mongodb with nodejs", "category_id": "coding"},
    {"text": "fix css not loading issue", "category_id": "coding"},
    {"text": "write unit tests in pytest", "category_id": "coding"},
    {"text": "how to use git rebase", "category_id": "coding"},
    {"text": "difference between list and tuple", "category_id": "coding"},
    {"text": "build a weather app", "category_id": "coding"},
    {"text": "handle null pointer exception", "category_id": "coding"},
    {"text": "create crud api using spring boot", "category_id": "coding"},
    {"text": "explain recursion with example", "category_id": "coding"},
    {"text": "how to optimize react performance", "category_id": "coding"},
    {"text": "what is docker used for", "category_id": "coding"},
    {"text": "write regex for email validation", "category_id": "coding"},
    {"text": "how to fix memory leak", "category_id": "coding"},
    {"text": "implement binary search", "category_id": "coding"},
    {"text": "create responsive navbar", "category_id": "coding"},
    {"text": "how to use pandas dataframe", "category_id": "coding"},
    {"text": "setup firebase authentication", "category_id": "coding"},
    {"text": "what is rest api", "category_id": "coding"},
    {"text": "build chat app using websocket", "category_id": "coding"},
    {"text": "error while compiling c++ code", "category_id": "coding"},
    {"text": "write recursive function", "category_id": "coding"},
    {"text": "optimize python code", "category_id": "coding"},
    {"text": "how does garbage collection work", "category_id": "coding"},
    {"text": "fix index out of range error", "category_id": "coding"},
    {"text": "how to create virtual environment", "category_id": "coding"},
    {"text": "write html form validation", "category_id": "coding"},
    {"text": "difference between http and https", "category_id": "coding"},
    {"text": "implement jwt authentication", "category_id": "coding"},
    {"text": "how to build chrome extension", "category_id": "coding"},
    {"text": "create api documentation", "category_id": "coding"},
    {"text": "what is big o notation", "category_id": "coding"},
    {"text": "optimize database indexing", "category_id": "coding"},
    {"text": "build ecommerce backend", "category_id": "coding"},
    {"text": "how to parse json", "category_id": "coding"},
    {"text": "write bash script", "category_id": "coding"},
    {"text": "how to deploy on aws", "category_id": "coding"},
    {"text": "implement linked list", "category_id": "coding"},
    {"text": "debug api timeout issue", "category_id": "coding"},
    {"text": "how to use redis cache", "category_id": "coding"},
    {"text": "explain multithreading", "category_id": "coding"},
    {"text": "build authentication system", "category_id": "coding"},
    {"text": "handle cors error", "category_id": "coding"},
    {"text": "how to optimize sql joins", "category_id": "coding"},
    {"text": "convert figma to code", "category_id": "coding"},
    {"text": "build mobile app backend", "category_id": "coding"},
    {"text": "explain closures in javascript", "category_id": "coding"},
    {"text": "write algorithm for sorting", "category_id": "coding"},
    {"text": "how to scale web application", "category_id": "coding"},
    {"text": "debug infinite loop", "category_id": "coding"},
    {"text": "how to read csv in python", "category_id": "coding"},
    {"text": "create api rate limiting", "category_id": "coding"},
    {"text": "build file upload feature", "category_id": "coding"},
    {"text": "explain inheritance", "category_id": "coding"},
    {"text": "optimize frontend load time", "category_id": "coding"},
    {"text": "how to handle exceptions", "category_id": "coding"},
    {"text": "create socket server", "category_id": "coding"},
    {"text": "difference between sql and nosql", "category_id": "coding"},
    {"text": "implement authentication middleware", "category_id": "coding"},
    {"text": "how to debug production issue", "category_id": "coding"},
    {"text": "write unit tests for api", "category_id": "coding"},
    {"text": "explain microservices", "category_id": "coding"},
    {"text": "build admin dashboard", "category_id": "coding"},
    {"text": "how to use graphql", "category_id": "coding"},
    {"text": "fix npm dependency conflict", "category_id": "coding"},
    {"text": "implement pagination", "category_id": "coding"},
    {"text": "optimize api response time", "category_id": "coding"},
    {"text": "how to handle file streams", "category_id": "coding"},
    {"text": "write clean code principles", "category_id": "coding"},
    # <--- COMMA ADDED HERE
    {"text": "implement oauth login", "category_id": "coding"},

    # --- DATA ANALYSIS ---
    {"text": "analyze sales data", "category_id": "data_analysis"},
    {"text": "plot revenue trends", "category_id": "data_analysis"},
    {"text": "perform exploratory data analysis", "category_id": "data_analysis"},
    {"text": "detect outliers in dataset", "category_id": "data_analysis"},
    {"text": "clean missing values", "category_id": "data_analysis"},
    {"text": "visualize time series data", "category_id": "data_analysis"},
    {"text": "generate correlation matrix", "category_id": "data_analysis"},
    {"text": "predict next month sales", "category_id": "data_analysis"},
    {"text": "analyze customer churn", "category_id": "data_analysis"},
    {"text": "cluster customers", "category_id": "data_analysis"},
    {"text": "build sales dashboard", "category_id": "data_analysis"},
    {"text": "analyze marketing campaign", "category_id": "data_analysis"},
    {"text": "create pivot table", "category_id": "data_analysis"},
    {"text": "analyze stock prices", "category_id": "data_analysis"},
    {"text": "perform regression analysis", "category_id": "data_analysis"},
    {"text": "visualize histogram", "category_id": "data_analysis"},
    {"text": "find seasonal trends", "category_id": "data_analysis"},
    {"text": "analyze website traffic", "category_id": "data_analysis"},
    {"text": "detect anomalies", "category_id": "data_analysis"},
    {"text": "summarize dataset", "category_id": "data_analysis"},
    {"text": "forecast demand", "category_id": "data_analysis"},
    {"text": "perform hypothesis testing", "category_id": "data_analysis"},
    {"text": "analyze survey results", "category_id": "data_analysis"},
    {"text": "build kpi metrics", "category_id": "data_analysis"},
    {"text": "analyze financial data", "category_id": "data_analysis"},
    {"text": "perform cohort analysis", "category_id": "data_analysis"},
    {"text": "visualize scatter plot", "category_id": "data_analysis"},
    {"text": "analyze social media data", "category_id": "data_analysis"},
    {"text": "detect fraud patterns", "category_id": "data_analysis"},
    {"text": "normalize dataset", "category_id": "data_analysis"},
    {"text": "analyze retention rate", "category_id": "data_analysis"},
    {"text": "create box plot", "category_id": "data_analysis"},
    {"text": "perform time series forecasting", "category_id": "data_analysis"},
    {"text": "analyze ecommerce data", "category_id": "data_analysis"},
    {"text": "calculate growth rate", "category_id": "data_analysis"},
    {"text": "segment users", "category_id": "data_analysis"},
    {"text": "analyze churn drivers", "category_id": "data_analysis"},
    {"text": "clean messy csv", "category_id": "data_analysis"},
    {"text": "analyze profit margins", "category_id": "data_analysis"},
    {"text": "generate summary statistics",
        "category_id": "data_analysis"},  # <--- COMMA ADDED HERE

    # --- FITNESS ---
    {"text": "build muscle fast", "category_id": "fitness"},
    {"text": "home workout plan", "category_id": "fitness"},
    {"text": "lose weight naturally", "category_id": "fitness"},
    {"text": "beginner gym routine", "category_id": "fitness"},
    {"text": "full body workout", "category_id": "fitness"},
    {"text": "how to get six pack", "category_id": "fitness"},
    {"text": "fat loss diet", "category_id": "fitness"},
    {"text": "cardio vs strength training", "category_id": "fitness"},
    {"text": "best workout for chest", "category_id": "fitness"},
    {"text": "leg day routine", "category_id": "fitness"},
    {"text": "increase stamina", "category_id": "fitness"},
    {"text": "workout without equipment", "category_id": "fitness"},
    {"text": "how to gain weight", "category_id": "fitness"},
    {"text": "calisthenics routine", "category_id": "fitness"},
    {"text": "best exercises for back", "category_id": "fitness"},
    {"text": "daily stretching routine", "category_id": "fitness"},
    {"text": "how often should i workout", "category_id": "fitness"},
    {"text": "gym diet plan", "category_id": "fitness"},
    {"text": "build strength", "category_id": "fitness"},
    {"text": "yoga for beginners", "category_id": "fitness"},  # <--- COMMA ADDED HERE

    # --- EMOTIONAL ---
    {"text": "i feel depressed", "category_id": "emotional"},
    {"text": "i feel anxious", "category_id": "emotional"},
    {"text": "i am feeling lost", "category_id": "emotional"},
    {"text": "i am overthinking", "category_id": "emotional"},
    {"text": "i feel lonely", "category_id": "emotional"},
    {"text": "i am stressed", "category_id": "emotional"},
    {"text": "i feel overwhelmed", "category_id": "emotional"},
    {"text": "i am scared about future", "category_id": "emotional"},
    {"text": "i feel unmotivated", "category_id": "emotional"},
    {"text": "i am feeling sad", "category_id": "emotional"},
    {"text": "i feel burnt out", "category_id": "emotional"},
    {"text": "i feel worthless", "category_id": "emotional"},
    {"text": "i am mentally exhausted", "category_id": "emotional"},
    {"text": "i feel hopeless", "category_id": "emotional"},
    {"text": "i am afraid of failing", "category_id": "emotional"},
    {"text": "i feel ignored", "category_id": "emotional"},
    {"text": "i feel insecure", "category_id": "emotional"},
    {"text": "i am emotionally tired", "category_id": "emotional"},
    {"text": "i need emotional support", "category_id": "emotional"},
    {"text": "i feel broken", "category_id": "emotional"},  # <--- COMMA ADDED HERE

    # --- COOKING ---
    {"text": "easy dinner recipes", "category_id": "cooking"},
    {"text": "quick breakfast ideas", "category_id": "cooking"},
    {"text": "vegetarian meal ideas", "category_id": "cooking"},
    {"text": "how to cook pasta", "category_id": "cooking"},
    {"text": "healthy lunch recipes", "category_id": "cooking"},
    {"text": "one pot meals", "category_id": "cooking"},
    {"text": "chicken curry recipe", "category_id": "cooking"},
    {"text": "how to bake bread", "category_id": "cooking"},
    {"text": "low calorie meals", "category_id": "cooking"},
    {"text": "indian veg recipes", "category_id": "cooking"},
    {"text": "snacks for evening", "category_id": "cooking"},
    {"text": "how to cook rice", "category_id": "cooking"},
    {"text": "simple dessert recipes", "category_id": "cooking"},
    {"text": "meal prep ideas", "category_id": "cooking"},
    {"text": "how to make soup", "category_id": "cooking"},
    {"text": "healthy smoothie recipes", "category_id": "cooking"},
    {"text": "quick dinner ideas", "category_id": "cooking"},
    {"text": "homemade pizza recipe", "category_id": "cooking"},
    {"text": "how to fry eggs", "category_id": "cooking"},
    # <--- COMMA ADDED HERE
    {"text": "budget friendly meals", "category_id": "cooking"},

    # --- MORE LITERATURE (Expanded) ---
    {"text": "write a haiku about nature", "category_id": "literature"},
    {"text": "character backstory ideas", "category_id": "literature"},
    {"text": "describe a cyberpunk city", "category_id": "literature"},
    {"text": "plot twist suggestions", "category_id": "literature"},
    {"text": "write a letter from a soldier", "category_id": "literature"},
    {"text": "surrealist poetry", "category_id": "literature"},
    {"text": "satirical essay topic", "category_id": "literature"},
    {"text": "stream of consciousness writing", "category_id": "literature"},
    {"text": "gothic horror atmosphere", "category_id": "literature"},
    {"text": "first person narrative help", "category_id": "literature"},
    {"text": "write a sonnet", "category_id": "literature"},
    {"text": "comic book script format", "category_id": "literature"},
    {"text": "hero's journey outline", "category_id": "literature"},
    {"text": "enemies to lovers trope", "category_id": "literature"},
    {"text": "flash fiction prompt", "category_id": "literature"},
    {"text": "metaphors for sadness", "category_id": "literature"},
    {"text": "dialogue between two strangers", "category_id": "literature"},
    {"text": "steampunk world building", "category_id": "literature"},
    {"text": "write a prologue", "category_id": "literature"},
    {"text": "symbolism in story", "category_id": "literature"},

    # --- ACADEMIC (New Section) ---
    {"text": "write an abstract for research paper", "category_id": "academic"},
    {"text": "summarize this article", "category_id": "academic"},
    {"text": "essay on climate change", "category_id": "academic"},
    {"text": "thesis statement generator", "category_id": "academic"},
    {"text": "apa citation format", "category_id": "academic"},
    {"text": "literature review outline", "category_id": "academic"},
    {"text": "conclusion for history essay", "category_id": "academic"},
    {"text": "methodology section help", "category_id": "academic"},
    {"text": "argue against this theory", "category_id": "academic"},
    {"text": "sociology paper topics", "category_id": "academic"},
    {"text": "explain quantum physics simply", "category_id": "academic"},
    {"text": "write a formal report", "category_id": "academic"},
    {"text": "annotated bibliography example", "category_id": "academic"},
    {"text": "edit my grammar", "category_id": "academic"},
    {"text": "paraphrase this paragraph", "category_id": "academic"},
    {"text": "difference between qualitative and quantitative",
        "category_id": "academic"},
    {"text": "write a case study", "category_id": "academic"},
    {"text": "mla format guide", "category_id": "academic"},
    {"text": "research proposal structure", "category_id": "academic"},
    {"text": "psychology term paper", "category_id": "academic"},

    # --- MARKETING (New Section) ---
    {"text": "write an email newsletter", "category_id": "marketing"},
    {"text": "instagram caption for product", "category_id": "marketing"},
    {"text": "landing page copy", "category_id": "marketing"},
    {"text": "seo blog post title", "category_id": "marketing"},
    {"text": "facebook ad headline", "category_id": "marketing"},
    {"text": "brand slogan ideas", "category_id": "marketing"},
    {"text": "product description for shoes", "category_id": "marketing"},
    {"text": "call to action examples", "category_id": "marketing"},
    {"text": "press release format", "category_id": "marketing"},
    {"text": "youtube video description", "category_id": "marketing"},
    {"text": "cold email template", "category_id": "marketing"},
    {"text": "social media content calendar", "category_id": "marketing"},
    {"text": "write a sales pitch", "category_id": "marketing"},
    {"text": "google ads copy", "category_id": "marketing"},
    {"text": "value proposition statement", "category_id": "marketing"},
    {"text": "linkedin post for business", "category_id": "marketing"},
    {"text": "customer testimonial request", "category_id": "marketing"},
    {"text": "launch strategy for startup", "category_id": "marketing"},
    {"text": "rewrite for better conversion", "category_id": "marketing"},
    {"text": "tagline for tech company", "category_id": "marketing"}
]

# 3. Upload Loop


def upload_data():
    collection_ref = db.collection('ai_memory')
    count = 0

    for item in training_data:
        # Check if it already exists to avoid duplicates
        existing = collection_ref.where("text", "==", item["text"]).stream()

        if not any(existing):
            collection_ref.add({
                "text": item["text"],
                "category_id": item["category_id"],
                "timestamp": firestore.SERVER_TIMESTAMP
            })
            print(f"✅ Learned: '{item['text']}' -> {item['category_id']}")
            count += 1
        else:
            print(f"⚠️ Skipped (Already known): '{item['text']}'")

    print(f"\n🎉 Success! Uploaded {count} new patterns to the Brain.")


if __name__ == "__main__":
    upload_data()
