# app/routes/projects.py
# Project management routes (admin creates, members view)

from fastapi import APIRouter, Depends, HTTPException
from app.database import projects_collection, users_collection
from app.models import ProjectCreate, AddMemberRequest
from app.dependencies import get_current_user, require_role
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/projects", tags=["Projects"])


def format_project(p: dict) -> dict:
    """Convert MongoDB doc to JSON-serializable dict."""
    return {
        "id": str(p["_id"]),
        "name": p["name"],
        "description": p.get("description", ""),
        "created_by": p["created_by"],
        "members": p.get("members", []),
        "created_at": p["created_at"].isoformat()
    }


@router.post("/", status_code=201)
async def create_project(
    data: ProjectCreate,
    current_user: dict = Depends(require_role("admin"))
):
    """Admin only: create a new project."""
    project = {
        "name": data.name,
        "description": data.description,
        "created_by": str(current_user["_id"]),
        "members": [str(current_user["_id"])],  # admin is auto-added
        "created_at": datetime.utcnow()
    }
    result = await projects_collection.insert_one(project)
    project["_id"] = result.inserted_id
    return format_project(project)


@router.get("/")
async def get_projects(current_user: dict = Depends(get_current_user)):
    """
    Admin: gets all projects.
    Member: gets only projects they're a member of.
    """
    user_id = str(current_user["_id"])

    if current_user["role"] == "admin":
        projects = await projects_collection.find().to_list(100)
    else:
        projects = await projects_collection.find(
            {"members": user_id}
        ).to_list(100)

    return [format_project(p) for p in projects]


@router.post("/{project_id}/members")
async def add_member(
    project_id: str,
    data: AddMemberRequest,
    current_user: dict = Depends(require_role("admin"))
):
    """Admin only: add a user (by email) to a project."""

    # Find the user to add
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    member_id = str(user["_id"])

    # Add to project's members list (avoid duplicates with $addToSet)
    result = await projects_collection.update_one(
        {"_id": ObjectId(project_id)},
        {"$addToSet": {"members": member_id}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"message": f"{user['name']} added to project"}


@router.get("/{project_id}/members")
async def get_project_members(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get all members of a project (for task assignment dropdown)."""
    project = await projects_collection.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    members = []
    for uid in project.get("members", []):
        user = await users_collection.find_one({"_id": ObjectId(uid)})
        if user:
            members.append({"id": str(user["_id"]), "name": user["name"], "email": user["email"]})

    return members