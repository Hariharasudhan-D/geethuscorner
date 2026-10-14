FROM python:3.12-slim

# Hugging Face runs the app as user 1000
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH
WORKDIR $HOME/app

# 1. Install the libraries (cached, so later builds are faster)
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy app.py and the knowledge files
COPY --chown=user . .

# 3. Start FastAPI on port 7860 (Hugging Face's default port)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
