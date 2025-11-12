from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from datetime import datetime
from app.models.user import User, UserRole
from app.services.auth_service import auth_service
from app.services.authorization_service import authz_service
from app.repositories.user_repository import UserRepository
from app.core.database import get_db


security = HTTPBearer()


async def get_user_repository() -> UserRepository:
    """Dependency to get user repository."""
    db = await get_db()
    return UserRepository(db)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    user_repo: UserRepository = Depends(get_user_repository)
) -> User:
    """Dependency to get the current authenticated user."""
    token = credentials.credentials
    user_id = auth_service.get_user_id_from_token(token)
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = await user_repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
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
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Dependency to ensure user is not locked."""
    if current_user.is_locked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is locked"
        )
    return current_user


async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Dependency to ensure the current user is an admin."""
    if not authz_service.is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    user_repo: UserRepository = Depends(get_user_repository)
) -> Optional[User]:
    """Dependency to get the current user if authenticated, None otherwise."""
    if not credentials:
        return None
    
    token = credentials.credentials
    user_id = auth_service.get_user_id_from_token(token)
    
    if not user_id:
        return None
    
    user = await user_repo.get_user_by_id(user_id)
    return user


def require_permission(permission_check):
    """
    Decorator factory for permission checks.
    
    Usage:
        @require_permission(lambda user: authz_service.can_create_thread(user))
        async def create_thread(...):
            ...
    """
    async def permission_dependency(current_user: User = Depends(get_current_user)):
        if not permission_check(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return permission_dependency
