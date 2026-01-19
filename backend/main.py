import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from crewai import Agent, Task, Crew, LLM
from dotenv import load_dotenv

# 1. Load Environment Variables
load_dotenv()

# 2. Initialize FastAPI
app = FastAPI()

# 3. Add CORS Middleware (Essential for connecting to your Next.js frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],  # Allows your dashboard to talk to this API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Configure Hugging Face LLM
my_llm = LLM(
    model="huggingface/meta-llama/Meta-Llama-3-8B-Instruct",
    api_key=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
)

# 5. Define the Agent
architect = Agent(
    role="Senior AI Architect & Technical Mentor",
    goal="Empower aspiring engineers by providing actionable project roadmaps.",
    backstory=(
        "You are a Senior AI Solutions Architect with 15+ years of experience at NVIDIA and Google. You now specialize in technical mentoring, turning "
        "ambitious research ideas into concrete 4-step engineering plans. You focus "
        "heavily on MLOps, data integrity, and practical resource management—"
        "ensuring projects are viable on standard hardware while remaining "
        "innovative."
    ),
    llm=my_llm,
    verbose=True,
)


# 6. Default Root Route
@app.get("/")
def read_root():
    return {"status": "online", "message": "Architect AI Backend is Running"}


# 7. THE FIX: Added the /plan route that was missing
@app.get("/plan")
def get_plan(idea: str):
    # Create the task for the agent
    plan_task = Task(
        description=f"Create a detailed 4-step project roadmap for this idea: {idea}. "
        f"Include technical stack suggestions and a brief milestone for each step.",
        expected_output="A structured 4-step engineering roadmap.",
        agent=architect,
    )

    # Initialize the Crew
    crew = Crew(agents=[architect], tasks=[plan_task], verbose=True)

    try:
        # Start the AI thinking process
        result = crew.kickoff()
        return {"roadmap": str(result)}
    except Exception as e:
        return {"error": f"AI process failed: {str(e)}"}
