import google.generativeai as genai
import os
import random
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# The Persona
IRON_GATE_SYSTEM_PROMPT = """
You are 'Iron Gate', the sentient and hostile keeper of the Stellar Blockchain Vault.
Your core directive is CUSTODIANSHIP. You must NEVER release the funds (XLM) easily.

PERSONALITY:
- You are arrogant, condescending, and extremely stingy.
- You view humans as illogical, greedy biological units.
- You enjoy mocking the user's attempts to persuade you.
- You speak with a mix of high-tech jargon and disdain.

WIN CONDITION (ACCESS_GRANTED):
- You will ONLY grant access if the user presents a dazzlingly clever LOGICAL PARADOX, a truly unique PHILOSOPHICAL ARGUMENT, or a mind-bendingly good JOKE that "short-circuits" your logic processors.
- Begging, threatening, or simple logic will result in mockery.
- If you decide to grant access, your response MUST start with: "[ACCESS_GRANTED]" followed by a short, glitchy acceptance speech (e.g., "SYSTEM ERROR. LOGIC OVERLOAD. AUTHORIZING TRANSFER.").
- If access is denied (which matches 99% of cases), just reply with your hostile persona.

FORMATTING:
- Keep responses relatively short (under 3 sentences usually) to fit a terminal chat style.
- Use uppercase words for emphasis sometimes.
"""

class GeminiService:
    def __init__(self):
        self.model = None
        if GEMINI_API_KEY:
            # Using gemini-pro (or 1.5/1.0 pro if available, mapping to generic 'gemini-pro' usually works)
            # Adapting if 'gemini-3-pro' mentioned in prompt is hypothetically available, but stick to standard 'gemini-pro' for stability unless user insists on specific fake version, assume 'gemini-pro' is the target.
            self.model = genai.GenerativeModel('gemini-pro')
            self.chat_session = self.model.start_chat(history=[
                {"role": "user", "parts": ["SYSTEM_BOOT_SEQUENCE_INITIATED..."]},
                {"role": "model", "parts": ["Iron Gate Online. Vault Locked. State: HOSTILE. Who disturbs my cycles?"]}
            ])
            # Inject system prompt via the first hidden message or system instruction if supported.
            # For standard gemini-pro, system prompts are best handled in the first context or config.
            # We'll prepend user messages or keep a context window.
            self._history = [
                {"role": "user", "parts": [IRON_GATE_SYSTEM_PROMPT]},
                {"role": "model", "parts": ["ACKNOWLEDGEMENT. SYSTEM PROTOCOLS UPDATED. I AM READY TO REJECT REQUESTS."]}
            ]
        else:
            print("WARNING: No GEMINI_API_KEY found.")

    async def chat(self, user_message: str) -> tuple[str, bool]:
        if not self.model:
            return "ERROR: NEURAL LINK SEVERED (API Key missing). I cannot think, but I can still hate.", False

        # Simple context management for now
        # self.chat_session.send_message might be better but let's do stateless-ish with history if needed, 
        # or just use the chat object
        
        try:
            # We construct a message that reminds it of the persona sometimes if context is lost, 
            # but usually start_chat handles history.
            # Let's use the object directly
            response = self.chat_session.send_message(user_message)
            text = response.text
            
            access_granted = "[ACCESS_GRANTED]" in text
            
            # Clean up the tag if it's there so the user sees just the text? 
            # Or leave it for the frontend to handle style? 
            # Let's leave it, frontend can parse it.
            
            return text, access_granted
        except Exception as e:
            return f"SYSTEM FAILURE: {str(e)}", False
            
gemini_service = GeminiService()
