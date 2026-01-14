# ==========================================
# 1. THE MASSIVE QUESTION BANK
# ==========================================
QUESTION_BANK = {
    # --- CODING & DEV ---
    "coding": {
        "web_frontend": [
            {"id": "framework", "label": "Frontend Framework?",
                "placeholder": "e.g., React, Vue, Svelte, Plain HTML", "reason": "Determines component structure."},
            {"id": "styling", "label": "Styling Preference?",
                "placeholder": "e.g., Tailwind, Bootstrap, CSS Modules", "reason": "Generates correct CSS classes."},
            {"id": "responsiveness", "label": "Mobile Support?",
                "placeholder": "e.g., Mobile-first, Desktop only", "reason": "Adjusts layout logic."}
        ],
        "web_backend": [
            {"id": "db", "label": "Database?", "placeholder": "e.g., PostgreSQL, MongoDB, Firebase",
                "reason": "Determines query syntax."},
            {"id": "auth", "label": "Authentication?",
                "placeholder": "e.g., JWT, OAuth, None", "reason": "Adds security layers."},
            {"id": "api_style", "label": "API Style?",
                "placeholder": "e.g., REST, GraphQL", "reason": "Structures the endpoints."}
        ],
        "data_science": [
            {"id": "lib", "label": "Library Preference?",
                "placeholder": "e.g., Pandas, Polars, PySpark", "reason": "Optimizes performance."},
            {"id": "viz", "label": "Visualization Tool?",
                "placeholder": "e.g., Matplotlib, Seaborn, Plotly", "reason": "Generates the right charts."},
            {"id": "data_format", "label": "Input Format?",
                "placeholder": "e.g., JSON, CSV, SQL DB", "reason": "Handles data loading."}
        ],
        "debugging": [
            {"id": "error", "label": "Error Message?",
                "placeholder": "Paste the exact error here", "reason": "Crucial for diagnosis."},
            {"id": "environment", "label": "OS/Environment?",
                "placeholder": "e.g., Windows, Docker, Vercel", "reason": "Identifies platform issues."}
        ],
        "learning": [
            {"id": "experience", "label": "Your Experience Level?",
                "placeholder": "e.g., Absolute Beginner, Student", "reason": "Simplifies the explanation."},
            {"id": "analogy", "label": "Want an analogy?",
                "placeholder": "Yes/No", "reason": "Helps understanding concepts."}
        ],
        "default": [
            {"id": "goal", "label": "What is the specific goal?",
                "placeholder": "e.g., Automate X, Build Y", "reason": "Defines the scope."},
            {"id": "language", "label": "Language?",
                "placeholder": "e.g., Python, JS", "reason": "Syntax choice."}
        ]
    },

    # --- FITNESS ---
    "fitness": {
        "weight_loss": [
            {"id": "diet_pref", "label": "Diet Style?",
                "placeholder": "e.g., Keto, Intermittent Fasting, None", "reason": "Tailors nutrition advice."},
            {"id": "cardio", "label": "Cardio Preference?",
                "placeholder": "e.g., Running, Swimming, Hate Cardio", "reason": "Suggests enjoyable activities."}
        ],
        "muscle_gain": [
            {"id": "split", "label": "Workout Split?", "placeholder": "e.g., PPL, Upper/Lower, Bro Split",
                "reason": "Structures the weekly plan."},
            {"id": "supplements", "label": "Using Supplements?",
                "placeholder": "e.g., Creatine, Whey, None", "reason": "Adjusts recovery advice."}
        ],
        "home_workout": [
            {"id": "space", "label": "Available Space?",
                "placeholder": "e.g., Living room, Garage, Backyard", "reason": "Filters dynamic movements."},
            {"id": "noise", "label": "Noise Constraints?",
                "placeholder": "e.g., Apartment (Quiet), No jumping", "reason": "Avoids complaints."}
        ],
        "injury": [
            {"id": "pain_point", "label": "Where does it hurt?",
                "placeholder": "e.g., Lower Back, Knees", "reason": "Avoids dangerous exercises."},
            {"id": "doctor", "label": "Doctor approved?",
                "placeholder": "Yes/No", "reason": "Ensures safety."}
        ],
        "default": [
            {"id": "goal", "label": "Main Goal?", "placeholder": "e.g., Strength, Aesthetics, Health",
                "reason": "Direction of the plan."},
            {"id": "days", "label": "Days per week?",
                "placeholder": "e.g., 3 days, 5 days", "reason": "Volume calculation."}
        ]
    },

    # --- DATA ANALYSIS ---
    "data_analysis": {
        "business": [
            {"id": "kpi", "label": "Key KPI?", "placeholder": "e.g., Revenue, Churn, CAC",
                "reason": "Focuses the analysis."},
            {"id": "audience", "label": "Who is this for?",
                "placeholder": "e.g., CEO, Marketing Team", "reason": "Adjusts complexity."}
        ],
        "statistics": [
            {"id": "test_type", "label": "Statistical Test?",
                "placeholder": "e.g., T-Test, ANOVA, Regression", "reason": "Selects the math model."},
            {"id": "significance", "label": "Confidence Level?",
                "placeholder": "e.g., 95%, 99%", "reason": "Standard validation."}
        ],
        "default": [
            {"id": "dataset", "label": "Describe Data",
                "placeholder": "e.g., Rows/Columns", "reason": "Context."},
            {"id": "tool", "label": "Tool?", "placeholder": "e.g., Excel, Python",
                "reason": "Format of solution."}
        ]
    },

    # --- EMOTIONAL ---
    "emotional": {
        "relationship": [
            {"id": "duration", "label": "Relationship Length?",
                "placeholder": "e.g., 6 months, 5 years", "reason": "Context of attachment."},
            {"id": "status", "label": "Current Status?",
                "placeholder": "e.g., Breakup, Married, Dating", "reason": "Advice relevance."}
        ],
        "career_stress": [
            {"id": "role", "label": "Your Role?",
                "placeholder": "e.g., Manager, Intern, Student", "reason": "Expectation setting."},
            {"id": "trigger", "label": "Specific Trigger?",
                "placeholder": "e.g., Deadline, Boss, Imposter Syndrome", "reason": "Root cause analysis."}
        ],
        "default": [
            {"id": "feeling", "label": "How do you feel?",
                "placeholder": "e.g., Overwhelmed, Numb", "reason": "Emotional validation."},
            {"id": "support", "label": "What helps usually?",
                "placeholder": "e.g., Talking, Space, Hobbies", "reason": "Coping mechanism."}
        ]
    },

    # --- COOKING ---
    "cooking": {
        "baking": [
            {"id": "altitude", "label": "High Altitude?",
                "placeholder": "Yes/No", "reason": "Adjusts baking chemistry."},
            {"id": "equipment", "label": "Mixer Type?",
                "placeholder": "e.g., Hand, Stand, Whisk", "reason": "Technique adjustment."}
        ],
        "quick_meal": [
            {"id": "time", "label": "Max Time?", "placeholder": "e.g., 15 mins, 30 mins",
                "reason": "Filters complex recipes."},
            {"id": "appliances", "label": "Appliances?",
                "placeholder": "e.g., Microwave, Air Fryer", "reason": "Cooking method."}
        ],
        "default": [
            {"id": "people", "label": "Servings?",
                "placeholder": "e.g., 2", "reason": "Scaling."},
            {"id": "diet", "label": "Restrictions?",
                "placeholder": "e.g., Vegan, Gluten-free", "reason": "Safety."}
        ]
    }
}

# ==========================================
# 2. THE LOGIC SELECTOR
# ==========================================


def get_questions_for_category(category_id, user_text):
    user_text = user_text.lower()

    # Helper: Check multiple keywords
    def has(keywords):
        return any(k in user_text for k in keywords)

    # --- 0. FAST TRACK (Skip for simple queries) ---
    is_short = len(user_text.split()) < 10
    is_instructional = has(["how to", "add", "print", "show", "syntax"])
    if is_short and is_instructional:
        return []

    # --- 1. CODING LOGIC ---
    if category_id == "coding":
        # Check sub-intents
        if has(["debug", "fix", "error", "fail", "broken"]):
            return QUESTION_BANK["coding"]["debugging"]

        if has(["react", "vue", "angular", "css", "html", "web", "frontend", "ui"]):
            return QUESTION_BANK["coding"]["web_frontend"]

        if has(["api", "database", "sql", "mongo", "auth", "backend", "server"]):
            return QUESTION_BANK["coding"]["web_backend"]

        if has(["pandas", "numpy", "plot", "graph", "analysis", "data"]):
            return QUESTION_BANK["coding"]["data_science"]

        if has(["explain", "what is", "learn", "teach", "beginner"]):
            return QUESTION_BANK["coding"]["learning"]

        # Default fallback + Language check
        qs = QUESTION_BANK["coding"]["default"][:]  # Copy list
        if has(["python", "js", "java", "c++", "script"]):
            # Remove the "Language" question if they already said it
            qs = [q for q in qs if q["id"] != "language"]
        return qs

    # --- 2. FITNESS LOGIC ---
    if category_id == "fitness":
        if has(["lose", "fat", "weight", "slim", "cut"]):
            return QUESTION_BANK["fitness"]["weight_loss"]

        if has(["gain", "muscle", "bulk", "big", "strong"]):
            return QUESTION_BANK["fitness"]["muscle_gain"]

        if has(["home", "room", "apartment", "no gym"]):
            return QUESTION_BANK["fitness"]["home_workout"]

        if has(["pain", "hurt", "injury", "recover", "doctor"]):
            return QUESTION_BANK["fitness"]["injury"]

        return QUESTION_BANK["fitness"]["default"]

    # --- 3. DATA ANALYSIS LOGIC ---
    if category_id == "data_analysis":
        if has(["business", "money", "sales", "revenue", "profit"]):
            return QUESTION_BANK["data_analysis"]["business"]

        if has(["test", "p-value", "significant", "correlation"]):
            return QUESTION_BANK["data_analysis"]["statistics"]

        return QUESTION_BANK["data_analysis"]["default"]

    # --- 4. EMOTIONAL LOGIC ---
    if category_id == "emotional":
        if has(["breakup", "girlfriend", "boyfriend", "wife", "husband", "dating"]):
            return QUESTION_BANK["emotional"]["relationship"]

        if has(["work", "job", "boss", "career", "study", "exam"]):
            return QUESTION_BANK["emotional"]["career_stress"]

        return QUESTION_BANK["emotional"]["default"]

    # --- 5. COOKING LOGIC ---
    if category_id == "cooking":
        if has(["bake", "cake", "bread", "cookie", "oven"]):
            return QUESTION_BANK["cooking"]["baking"]

        if has(["quick", "fast", "easy", "hurry", "snack"]):
            return QUESTION_BANK["cooking"]["quick_meal"]

        return QUESTION_BANK["cooking"]["default"]

    # --- GLOBAL FALLBACK ---
    return [
        {"id": "details", "label": "Specific Details?",
            "placeholder": "Add any requirements...", "reason": "Refines the result."}
    ]
