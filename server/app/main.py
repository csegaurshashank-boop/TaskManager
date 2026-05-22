# app/main.py
# FastAPI application entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import tasks
from app.routes import auth, projects
from app.database import client

# Create FastAPI app
app = FastAPI(title="Team Task Manager API", version="1.0.0")

# Allow requests from any frontend origin (Vercel generates new URLs per deploy)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route groups
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)


@app.on_event("startup")
async def check_mongo_connection():
    """Check MongoDB connection when the server starts."""
    try:
        await client.admin.command("ping")
        print("\n✅ MongoDB connected successfully!\n")
    except Exception as e:
        print(f"\n❌ MongoDB connection FAILED: {e}\n")


@app.get("/")
async def root():
    return {"message": "Task Manager API is running"}