import os
from fastapi import FastAPI
from dotenv import load_dotenv

# 1. Load your key from the .env file
load_dotenv()

# 2. Create the App
app = FastAPI()


@app.get("/")
def home():
    return {"status": "AI Backend is Running"}
