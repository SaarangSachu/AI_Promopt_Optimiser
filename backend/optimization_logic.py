from google import genai
from google.genai import types


def optimize_with_gemini(draft_prompt, api_key):
    """
    Sends the draft prompt to Google Gemini for polishing using the new SDK.
    """
    # Check if key is missing or is the placeholder text
    if not api_key or "YOUR_" in api_key:
        print("⚠️ No valid API Key provided. Returning draft.")
        return draft_prompt

    try:
        # --- NEW SDK SETUP ---
        # Initialize the client with your API key
        client = genai.Client(api_key=api_key)

        instruction = (
            "You are an expert Prompt Engineer. Your goal is to rewrite the following draft prompt "
            "to be clearer, more structured, and highly effective for an LLM. "
            "Do not answer the prompt. Only improve the prompt text itself. "
            "Maintain the original intent and persona."
            "\n\nDraft Prompt:\n" + draft_prompt
        )

        # --- GENERATE CONTENT ---
        # Using gemini-2.5-flash as identified in your dashboard
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=instruction
        )

        # Accessing text in the new SDK
        if response.text:
            return response.text
        else:
            return draft_prompt

    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        # Fallback to draft so app doesn't crash
        return draft_prompt
