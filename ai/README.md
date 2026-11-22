---
title: Geethus Corner AI
emoji: 🎂
colorFrom: pink
colorTo: yellow
sdk: gradio
app_file: app.py
pinned: false
---

# Geethu's Corner cake assistant

The FastAPI chatbot uses Groq for responses and LangChain tools to read the
shop's notes and fetch the live menu from the Spring Boot API.

Set `GROQ_API_KEY` and `CHAT_SECRET` in `ai/.env` locally or in the hosting
service's secrets for a deployment. `GROQ_MODEL` defaults to
`openai/gpt-oss-20b`.
