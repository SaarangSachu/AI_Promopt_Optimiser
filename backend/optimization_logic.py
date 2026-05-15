import google.generativeai as genai

def optimize_with_gemini(draft_prompt, api_key):
    """
    Sends the draft prompt to Google Gemini for polishing using the standardized SDK.
    """
    if not api_key:
        print("No valid API Key provided. Returning draft.")
        return draft_prompt

    try:
        genai.configure(api_key=api_key)
        # Using gemini-2.5-flash as requested
        model = genai.GenerativeModel('models/gemini-2.5-flash')

        instruction = (
            "You are an expert Prompt Engineer. Your goal is to rewrite the following draft prompt "
            "to be clearer, more structured, and highly effective for an LLM. "
            "Do not answer the prompt. Only improve the prompt text itself. "
            "Maintain the original intent and persona."
            "\n\nDraft Prompt:\n" + draft_prompt
        )

        response = model.generate_content(instruction)
        
        if response.text:
            return response.text
        else:
            return draft_prompt

    except ValueError as ve:
        print(f"Gemini Safety Filter triggered or Empty Response: {ve}")
        return draft_prompt
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return draft_prompt
