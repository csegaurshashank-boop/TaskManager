# app/routes/tasks.py
# Task management routes: create, list, update status

from fastapi import APIRouter, Depends, HTTPException
from app.database import tasks_collection, users_collection
from app.models import TaskCreate, TaskStatusUpdate
from app.dependencies import get_current_user, require_role
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/tasks", tags=["Tasks"])


async def format_task(t: dict) -> dict:
    """Convert MongoDB task doc to JSON-serializable dict."""
    # Look up the assigned user's name
    assigned_name = ""
    if t.get("assigned_to"):
        user = await users_collection.find_one({"_id": ObjectId(t["assigned_to"])})
        if user:
            assigned_name = user["name"]

    return {
        "id": str(t["_id"]),
        "title": t["title"],
        "description": t.get("description", ""),
        "project_id": t["project_id"],
        "assigned_to": t["assigned_to"],
        "assigned_to_name": assigned_name,
        "status": t["status"],
        "due_date": t.get("due_date"),
        "created_by": t["created_by"],
        "created_at": t["created_at"].isoformat()
    }


@router.post("/", status_code=201)
async def create_task(
    data: TaskCreate,
    current_user: dict = Depends(require_role("admin"))
):
    """Admin only: create and assign a task."""
    task = {
        "title": data.title,
        "description": data.description,
        "project_id": data.project_id,
        "assigned_to": data.assigned_to,
        "status": "todo",          # default status
        "due_date": data.due_date,
        "created_by": str(current_user["_id"]),
        "created_at": datetime.utcnow()
    }
    result = await tasks_collection.insert_one(task)
    task["_id"] = result.inserted_id
    return await format_task(task)


@router.get("/")
async def get_tasks(current_user: dict = Depends(get_current_user)):
    """
    Admin: gets all tasks.
    Member: gets only tasks assigned to them.
    """
    user_id = str(current_user["_id"])

    if current_user["role"] == "admin":
        task_docs = await tasks_collection.find().to_list(200)
    else:
        task_docs = await tasks_collection.find(
            {"assigned_to": user_id}
        ).to_list(200)

    # Format each task (adds assigned_to_name)
    return [await format_task(t) for t in task_docs]


@router.patch("/{task_id}/status")
async def update_task_status(
    task_id: str,
    data: TaskStatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Any user can update status of a task (members: only their own tasks)."""
    valid_statuses = ["todo", "in_progress", "completed"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")

    task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Members can only update tasks assigned to them
    user_id = str(current_user["_id"])
    if current_user["role"] == "member" and task["assigned_to"] != user_id:
        raise HTTPException(status_code=403, detail="Cannot update another member's task")

    await tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": data.status}}
    )
    return {"message": "Status updated", "status": data.status}


@router.get("/dashboard")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """Return task counts for dashboard cards."""
    user_id = str(current_user["_id"])

    # Filter by user if member
    query = {} if current_user["role"] == "admin" else {"assigned_to": user_id}

    all_tasks = await tasks_collection.find(query).to_list(1000)

    from datetime import date
    today = date.today().isoformat()

    total = len(all_tasks)
    completed = sum(1 for t in all_tasks if t["status"] == "completed")
    in_progress = sum(1 for t in all_tasks if t["status"] == "in_progress")
    todo = sum(1 for t in all_tasks if t["status"] == "todo")

    # Overdue: due_date is set, before today, and not completed
    overdue = sum(
        1 for t in all_tasks
        if t.get("due_date") and t["due_date"] < today and t["status"] != "completed"
    )

    return {
        "total": total,
        "completed": completed,
        "in_progress": in_progress,
        "todo": todo,
        "overdue": overdue
    }