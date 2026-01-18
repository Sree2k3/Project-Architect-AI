import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from crewai import Agent, Task, Crew, LLM
from dotenv import load_dotenv

load_dotenv()

# This prevents the library from looking for Vertex AI credentials
api_key = os.getenv("GEMINI_API_KEY")
os.environ["GOOGLE_API_KEY"] = api_key

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This code tells the system: "Don't look for Google Cloud SDK.
# Note: We don't need to pass the key here because we set it in os.environ above
my_llm = LLM(model="gemini/gemini-1.5-flash", api_key=api_key)

architect = Agent(
    role="Senior AI Architect & Technical Mentor",
    goal="Empower aspiring engineers by providing high-precision, actionable project roadmaps.",
    backstory=(
        "You are a Senior AI Solutions Architect with 15+ years of experience at NVIDIA and Google. You now specialize in technical mentoring, turning "
        "ambitious research ideas into concrete 4-step engineering plans. You focus "
        "heavily on MLOps, data integrity, and practical resource management—"
        "ensuring projects are viable on standard hardware while remaining "
        "innovative."
    ),
    llm=my_llm,
    allow_delegation=False,
)


@app.get("/plan")
def get_plan(idea: str):
    plan_task = Task(
        description=f"Create a project roadmap for: {idea}.",
        expected_output="A structured 4-step roadmap with technical stack recommendations.",
        agent=architect,
    )
    crew = Crew(agents=[architect], tasks=[plan_task], verbose=True)
    result = crew.kickoff()
    return {"roadmap": str(result)}
