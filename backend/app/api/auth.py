from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from datetime import datetime
from app.models.user import User, UserCreate, UserLogin, UserResponse, UserRole
from app.services.auth_service import auth_service
from app.repositories.user_repository import UserRepository
from app.api.dependencies import get_current_user, get_user_repository
from app.core.database import get_db


router = APIRouter(prefix="/api/auth", tags=["authentication"])
security = HTTPBearer()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Register a new user account."""
    # Check if email already exists
    existing_user = await user_repo.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = await user_repo.get_user_by_username(user_data.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    password_hash = auth_service.hash_password(user_data.password)
    user = User(
        id=str(int(datetime.utcnow().timestamp() * 1000000)),
        username=user_data.username,
        email=user_data.email,
        password_hash=password_hash,
        role=UserRole.USER,
        created_at=datetime.utcnow()
    )
    
    created_user = await user_repo.create_user(user)
    return UserResponse(**created_user.model_dump())


@router.post("/login")
async def login(
    credentials: UserLogin,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Login with email and password to receive JWT tokens."""
    # Find user by email
    user = await user_repo.get_user_by_email(credentials.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not auth_service.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is locked
    if user.is_locked:
        if user.lock_expires_at and user.lock_expires_at > datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account locked until {user.lock_expires_at.isoformat()}"
            )
        else:
            # Lock has expired, unlock the user
            user = await user_repo.unlock_user(user.id)
    
    # Create tokens
    access_token = auth_service.create_access_token(data={"sub": user.id})
    refresh_token = auth_service.create_refresh_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": UserResponse(**user.model_dump())
    }


@router.post("/refresh")
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Refresh access token using a refresh token."""
    token = credentials.credentials
    payload = auth_service.decode_token(token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Verify user still exists
    user = await user_repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Create new access token
    access_token = auth_service.create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current authenticated user information."""
    return UserResponse(**current_user.model_dump())


@router.post("/logout")
async def logout():
    """Logout endpoint (client should discard tokens)."""
    return {
        "message": "Successfully logged out. Please discard your tokens."
    }
