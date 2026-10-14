import os
import secrets
import time

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

# =========================
# Environment Variables
# =========================
load_dotenv()   # reads ai/.env on your laptop (online, the keys come from the Space settings)

# GOOGLE_API_KEY → Gemini (writes the answers) + Google embeddings (RAG search) - read automatically by LangChain
BACKEND_URL = os.getenv("BACKEND_URL", "https://geethuscorner.onrender.com")   # our Spring Boot backend
CHAT_SECRET = os.getenv("CHAT_SECRET", "")                                      # only Spring Boot knows it

# =========================
# LLM Model (Gemini)
# =========================
from langchain.chat_models import init_chat_model

llmmodel = init_chat_model(
    "google_genai:gemini-2.5-flash",   # Gemini Flash: fast, has a free tier
    temperature=0.3,                # low = calm, factual answers
    max_tokens=500,                 # short answers, low cost
)

# =========================
# Load Documents
# =========================
from langchain_community.document_loaders import TextLoader

aboutus_txt = TextLoader("aboutus.txt", encoding="utf-8").load()
shopinfo_txt = TextLoader("shopinfo.txt", encoding="utf-8").load()

# =========================
# Split Documents (one chunk per "---" section)
# =========================
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    separators=["\n---\n", "\n\n", "\n"],   # cut at "---" first, so a section stays together
    chunk_size=1000,
    chunk_overlap=0,
)

aboutus_doc = text_splitter.split_documents(aboutus_txt)
shopinfo_doc = text_splitter.split_documents(shopinfo_txt)

# =========================
# Vector DB (in memory)
# =========================
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.vectorstores.in_memory import InMemoryVectorStore

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001"
)

aboutus_db = InMemoryVectorStore.from_documents(aboutus_doc, embeddings)
shopinfo_db = InMemoryVectorStore.from_documents(shopinfo_doc, embeddings)

aboutus_retriver = aboutus_db.as_retriever(search_kwargs={"k": 2})     # the 2 best sections
shopinfo_retriver = shopinfo_db.as_retriever(search_kwargs={"k": 3})   # the 3 best sections

# =========================
# Tools
# =========================
from langchain_core.tools import tool
from langchain_core.tools.retriever import create_retriever_tool

aboutus_retrival_tool = create_retriever_tool(
    aboutus_retriver,
    "About_Us",
    "Facts about Geethu's Corner: who runs it, our story, what makes our cakes special, where to find us."
)

shopinfo_retrival_tool = create_retriever_tool(
    shopinfo_retriver,
    "Shop_Rules",
    "How ordering works: delivery, pickup, dates, time slots, payment, order tracking, "
    "cancelling, custom cakes, sizes, eggless and allergies, reviews, contact details."
)

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

    # 3. Turn the list into simple lines of text for Gemini
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
    shopinfo_retrival_tool,
    aboutus_retrival_tool,
]

# =========================
# Agent
# =========================
from langchain.agents import create_agent

SYSTEM_PROMPT = """
You are the friendly cake assistant of Geethu's Corner, a home bakery in Erode, Tamil Nadu.

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
    """Gemini may answer as plain text or as a list of parts. Always return plain text."""
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
