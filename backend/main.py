import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from crewai import Agent, Task, Crew, LLM  # Import LLM from crewai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- THE FIX STARTS HERE ---
# Use the CrewAI LLM class to explicitly set the provider to 'gemini'
# --- UPDATE THIS SECTION IN main.py ---
my_llm = LLM(
    model="gemini/gemini-1.5-flash",  # Ensure 'gemini/' prefix is here
    api_key=os.getenv("GEMINI_API_KEY"),  # Force the stable v1 URL
)
# --- THE FIX ENDS HERE ---

architect = Agent(
    role="Lead ML Architect",
    goal="Provide a step-by-step roadmap for ML projects.",
    backstory="Expert at VIT Bhopal specialized in AI/ML project planning.",
    llm=my_llm,  # Use the new LLM object here
)


@app.get("/plan")
def get_plan(idea: str):
    plan_task = Task(
        description=f"Create a project roadmap for: {idea}.",
        expected_output="A structured 4-step roadmap.",
        agent=architect,
    )
    crew = Crew(agents=[architect], tasks=[plan_task])
    result = crew.kickoff()
    return {"roadmap": str(result)}
