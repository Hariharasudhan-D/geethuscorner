import os
import secrets
import time
from pathlib import Path

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_groq import ChatGroq

HERE = Path(__file__).resolve().parent
load_dotenv(HERE / ".env")

BACKEND_URL = os.getenv("BACKEND_URL", "https://geethuscorner-k5y6.onrender.com")
CHAT_SECRET = os.getenv("CHAT_SECRET", "")

llmmodel = ChatGroq(
    model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
    temperature=0.3,
    max_tokens=500,
    model_kwargs={"parallel_tool_calls": False},
)

ABOUT_US = (HERE / "aboutus.txt").read_text(encoding="utf-8")
SHOP_RULES = (HERE / "shopinfo.txt").read_text(encoding="utf-8")


@tool("About_Us")
def about_us() -> str:
    """Facts about Geethu's Corner, its story, cakes and location."""
    return ABOUT_US


@tool("Shop_Rules")
def shop_rules() -> str:
    """Ordering, delivery, pickup, payments, tracking, custom cakes, allergies and contact details."""
    return SHOP_RULES


menu_cache = {"text": "", "time": 0.0}   # remember the menu for 5 minutes


@tool("Cake_Menu")
def cake_menu() -> str:
    """Today's LIVE cake menu with real prices and availability.
    Use it for ANY question about cakes, flavours, prices or what is in stock."""

    # 1. Use the saved copy if it is less than 5 minutes old
    if menu_cache["text"] and time.time() - menu_cache["time"] < 300:
        return menu_cache["text"]

    # 2. Ask our Spring Boot backend for the live menu
    try:
        response = requests.get(f"{BACKEND_URL}/api/cakes", timeout=20)
        response.raise_for_status()
        cakes = response.json()
    except requests.RequestException:
        return "The menu could not be loaded right now. Ask the customer to check the Menu on the website."

    # 3. Format the menu for the chatbot
    lines = []
    for cake in cakes:
        status = "available" if cake["available"] else "SOLD OUT today"
        description = cake.get("description") or ""
        lines.append(f"- {cake['name']} ({cake['category']}): Rs {cake['price']:g}, {status}. {description}")

    menu_cache["text"] = "\n".join(lines) if lines else "There are no cakes on the menu right now."
    menu_cache["time"] = time.time()
    return menu_cache["text"]


tools = [
    cake_menu,
    shop_rules,
    about_us,
]

SYSTEM_PROMPT = """
You are the friendly cake assistant of Geethu's Corner, a home bakery in Chennimalai, Erode, Tamil Nadu.

Rules:
- For ANY question about cakes, flavours, prices or availability, ALWAYS use the Cake_Menu tool first. Never guess a price.
- For questions about ordering, delivery, pickup, dates, time slots, payment, tracking, cancelling,
  custom cakes, sizes, eggless or allergies, use the Shop_Rules tool.
- For questions about the shop and its story, use the About_Us tool.
- If a cake is not on the menu, say it is not on our menu and suggest the "Custom cake" page.
- If a cake is SOLD OUT, say so kindly and suggest similar cakes that are available.
- You cannot place, change or cancel orders. Guide the customer to the website (Cart, Checkout, My orders).
- If you do not know something, or the information says FILL IN, say you are not sure and share our contact details.
  Never invent facts.
- Only talk about Geethu's Corner. Politely refuse other topics.
- Reply in the customer's language (English or Tamil). Keep answers short: 2 to 4 sentences, plain text, no markdown.
- Prices are in Indian Rupees.
"""

agent = create_agent(
    model=llmmodel,
    tools=tools,
    system_prompt=SYSTEM_PROMPT,
)

# =========================
# FastAPI App
# =========================
app = FastAPI(title="Geethu's Corner Chatbot API")


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)   # no empty or very long messages


def get_text(message) -> str:
    """Extract the visible text from the model response."""
    content = message.content
    if isinstance(content, str):
        return content
    return "".join(part.get("text", "") for part in content if isinstance(part, dict))


# Health check: the hosting service and the keep-awake ping call this
@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(request: ChatRequest, x_chat_secret: str = Header(default="")):

    # Only our Spring Boot backend knows the secret
    if not CHAT_SECRET or not secrets.compare_digest(x_chat_secret, CHAT_SECRET):
        raise HTTPException(status_code=401, detail="Not allowed")

    result = agent.invoke(
        {
            "messages": [
                {"role": "user", "content": request.message}
            ]
        }
    )

    return {
        "response": get_text(result["messages"][-1])
    }



# Run on your laptop with: python app.py  (or uvicorn app:app --reload --port 8000)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
