# app/models.py
# Pydantic models for request/response validation

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── Auth Models ─────────────────────────────────────────────
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str  # "admin" or "member"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    role: str
    email: str


# ─── Project Models ───────────────────────────────────────────
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""


class ProjectResponse(BaseModel):
    id: str
    name: str
    description: str
    created_by: str
    members: List[str]
    created_at: datetime


# ─── Task Models ──────────────────────────────────────────────
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    project_id: str
    assigned_to: str           # user_id of the member
    due_date: Optional[str] = None


class TaskStatusUpdate(BaseModel):
    status: str  # "todo" | "in_progress" | "completed"


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    project_id: str
    assigned_to: str
    assigned_to_name: Optional[str] = ""
    status: str
    due_date: Optional[str] = None
    created_by: str
    created_at: datetime


# ─── Member Add Model ─────────────────────────────────────────
class AddMemberRequest(BaseModel):
    email: str   # email of user to add to project