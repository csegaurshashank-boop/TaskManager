# app/database.py
# Handles MongoDB connection using Motor (async MongoDB driver)

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

# Get the MongoDB URL from environment variables
MONGODB_URL = os.getenv("MONGODB_URL")

# Create a single global client (reused across requests)
client = AsyncIOMotorClient(MONGODB_URL)

# Select the database
db = client["taskmanager"]

# Collections (like SQL tables)
users_collection = db["users"]
projects_collection = db["projects"]
tasks_collection = db["tasks"]