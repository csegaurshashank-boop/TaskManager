# app/routes/auth.py
# Authentication routes: /auth/signup, /auth/login, /auth/members

from fastapi import APIRouter, HTTPException, status, Depends
from app.database import users_collection
from app.models import SignupRequest, LoginRequest, TokenResponse
from app.auth import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user, require_role
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", status_code=201)
async def signup(data: SignupRequest):
    """Register a new user with role selection."""

    # Validate role
    if data.role not in ["admin", "member"]:
        raise HTTPException(status_code=400, detail="Role must be 'admin' or 'member'")

    # Check if email already exists
    existing = await users_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user document
    user = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "role": data.role,
        "created_at": datetime.utcnow()
    }

    result = await users_collection.insert_one(user)
    return {"message": "User created successfully", "user_id": str(result.inserted_id)}


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    """Login and return JWT token with user info."""

    # Find user by email
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT with user ID as subject
    token = create_access_token({"sub": str(user["_id"])})

    return TokenResponse(
        access_token=token,
        user_id=str(user["_id"]),
        name=user["name"],
        role=user["role"],
        email=user["email"]
    )


@router.get("/members")
async def get_members(current_user: dict = Depends(require_role("admin"))):
    """Admin only: get all users with role 'member' for dropdown selection."""
    members_cursor = users_collection.find(
        {"role": "member"},
        {"_id": 1, "name": 1, "email": 1}  # only return safe fields
    )
    members = await members_cursor.to_list(200)
    return [
        {"id": str(m["_id"]), "name": m["name"], "email": m["email"]}
        for m in members
    ]