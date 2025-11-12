from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from pydantic import BaseModel
from app.models.user import User, UserResponse
from app.services.authorization_service import authz_service
from app.repositories.user_repository import UserRepository
from app.api.dependencies import get_current_admin, get_user_repository


router = APIRouter(prefix="/api/admin", tags=["admin"])


class GhostModeRequest(BaseModel):
    enabled: bool


class GhostModeResponse(BaseModel):
    user_id: str
    ghost_mode: bool
    message: str


class UserLockRequest(BaseModel):
    user_id: str
    lock_duration_hours: int = 24


@router.post("/ghost-mode", response_model=GhostModeResponse)
async def toggle_ghost_mode(
    request: GhostModeRequest,
    current_admin: User = Depends(get_current_admin)
):
    """
    Enable or disable ghost mode for the current admin.
    In ghost mode, admin presence is hidden from /who command.
    """
    if request.enabled:
        authz_service.enable_ghost_mode(current_admin.id)
        message = "👻 Ghost mode enabled - you are now invisible"
    else:
        authz_service.disable_ghost_mode(current_admin.id)
        message = "👤 Ghost mode disabled - you are now visible"
    
    return GhostModeResponse(
        user_id=current_admin.id,
        ghost_mode=request.enabled,
        message=message
    )


@router.get("/ghost-mode/status")
async def get_ghost_mode_status(
    current_admin: User = Depends(get_current_admin)
):
    """Check if current admin is in ghost mode."""
    is_ghost = authz_service.is_ghost_mode(current_admin.id)
    return {
        "user_id": current_admin.id,
        "ghost_mode": is_ghost
    }


@router.post("/users/lock")
async def lock_user_account(
    request: UserLockRequest,
    current_admin: User = Depends(get_current_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Lock a user account for a specified duration."""
    # Prevent admins from locking themselves
    if request.user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot lock your own account"
        )
    
    # Check if user exists
    user = await user_repo.get_user_by_id(request.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Lock the user
    locked_user = await user_repo.lock_user(request.user_id, request.lock_duration_hours)
    
    return {
        "message": f"User {user.username} locked for {request.lock_duration_hours} hours",
        "user": UserResponse(**locked_user.model_dump()),
        "lock_expires_at": locked_user.lock_expires_at
    }


@router.post("/users/{user_id}/unlock")
async def unlock_user_account(
    user_id: str,
    current_admin: User = Depends(get_current_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Unlock a user account."""
    # Check if user exists
    user = await user_repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Unlock the user
    unlocked_user = await user_repo.unlock_user(user_id)
    
    return {
        "message": f"User {user.username} unlocked",
        "user": UserResponse(**unlocked_user.model_dump())
    }


@router.get("/users", response_model=List[UserResponse])
async def list_all_users(
    current_admin: User = Depends(get_current_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """List all users (admin only)."""
    # This would need a method in UserRepository to list all users
    # For now, return empty list as placeholder
    return []


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_details(
    user_id: str,
    current_admin: User = Depends(get_current_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get detailed information about a specific user."""
    user = await user_repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(**user.model_dump())


@router.get("/permissions")
async def get_admin_permissions(
    current_admin: User = Depends(get_current_admin)
):
    """Get list of admin permissions."""
    return {
        "user_id": current_admin.id,
        "role": current_admin.role,
        "permissions": {
            "can_lock_threads": authz_service.can_lock_thread(current_admin),
            "can_pin_threads": authz_service.can_pin_thread(current_admin),
            "can_manage_users": authz_service.can_manage_users(current_admin),
            "can_view_mod_logs": authz_service.can_view_moderation_logs(current_admin),
            "can_access_admin_panel": authz_service.can_access_admin_panel(current_admin),
            "ghost_mode_available": True,
            "is_ghost_mode": authz_service.is_ghost_mode(current_admin.id)
        }
    }
