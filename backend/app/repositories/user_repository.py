from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from .base import BaseRepository
from ..models.user import User


class UserRepository(BaseRepository):
    """Repository for User operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "users")
    
    async def create_user(self, user: User) -> User:
        """Create a new user."""
        user_dict = user.model_dump()
        await self.create(user_dict)
        return user
    
    async def find_by_email(self, email: str) -> Optional[dict]:
        """Find a user by email."""
        return await self.find_one({"email": email})
    
    async def find_by_username(self, username: str) -> Optional[dict]:
        """Find a user by username."""
        return await self.find_one({"username": username})
    
    async def update_spam_warnings(self, user_id: str, warnings: int) -> bool:
        """Update user's spam warning count."""
        return await self.update(user_id, {"spam_warnings": warnings})
    
    async def lock_user(self, user_id: str, lock_expires_at) -> bool:
        """Lock a user account."""
        return await self.update(user_id, {
            "is_locked": True,
            "lock_expires_at": lock_expires_at
        })
    
    async def unlock_user(self, user_id: str) -> bool:
        """Unlock a user account."""
        return await self.update(user_id, {
            "is_locked": False,
            "lock_expires_at": None
        })
