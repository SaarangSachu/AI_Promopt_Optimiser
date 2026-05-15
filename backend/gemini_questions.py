import google.generativeai as genai
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_questions_with_gemini(api_key, category, user_text):
    """
    Generates dynamic clarifying questions using Gemini API.
    Returns a list of dicts: [{id, label, placeholder, reason}]
    """
    try:
        genai.configure(api_key=api_key)
        # Using gemini-2.5-flash as requested
        model = genai.GenerativeModel('models/gemini-2.5-flash')

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

        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Cleanup if Gemini returns markdown code blocks
        if content.startswith("```"):
            content = content.replace("```json", "").replace("```", "").strip()
        
        questions = json.loads(content)
        
        # Basic validation
        if not isinstance(questions, list) or len(questions) == 0:
            raise ValueError("Invalid JSON format from Gemini")
            
        return questions

    except Exception as e:
        logger.error(f"Gemini Question Generation Failed: {e}")
        raise e
