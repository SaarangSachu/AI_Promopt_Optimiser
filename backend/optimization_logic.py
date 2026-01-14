import google.generativeai as genai
import os


def optimize_with_gemini(draft_prompt, api_key):
    """
    Sends the draft prompt to Google Gemini for polishing using the Standard SDK.
    """
    # Check if key is missing or is the placeholder text
    if not api_key or "YOUR_" in api_key:
        print("⚠️ No valid API Key provided. Returning draft.")
        return draft_prompt

    try:
        # --- STANDARD SDK SETUP ---
        # Configure the global library with your API key
        genai.configure(api_key=api_key)

        instruction = (
            "You are an expert Prompt Engineer. Your goal is to rewrite the following draft prompt "
            "to be clearer, more structured, and highly effective for an LLM. "
            "Do not answer the prompt. Only improve the prompt text itself. "
            "Maintain the original intent and persona."
            "\n\nDraft Prompt:\n" + draft_prompt
        )

        # --- GENERATE CONTENT ---
        # Initialize the model (using the stable 1.5-flash model)
        model = genai.GenerativeModel('gemini-1.5-flash')

        response = model.generate_content(instruction)

        # Accessing text in the Standard SDK
        if response.text:
            return response.text
        else:
            return draft_prompt

    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        # Fallback to draft so app doesn't crash
        return draft_prompt
