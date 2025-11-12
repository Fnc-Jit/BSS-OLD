from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.user import User, UserCreate
from datetime import datetime, timedelta


class UserRepository:
    """Repository for user data operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.users
    
    async def create_user(self, user: User) -> User:
        """Create a new user in the database."""
        user_dict = user.model_dump()
        await self.collection.insert_one(user_dict)
        return user
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Retrieve a user by their ID."""
        user_doc = await self.collection.find_one({"id": user_id})
        if user_doc:
            return User(**user_doc)
        return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Retrieve a user by their email address."""
        user_doc = await self.collection.find_one({"email": email})
        if user_doc:
            return User(**user_doc)
        return None
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Retrieve a user by their username."""
        user_doc = await self.collection.find_one({"username": username})
        if user_doc:
            return User(**user_doc)
        return None
    
    async def update_user(self, user_id: str, update_data: dict) -> Optional[User]:
        """Update user data."""
        result = await self.collection.find_one_and_update(
            {"id": user_id},
            {"$set": update_data},
            return_document=True
        )
        if result:
            return User(**result)
        return None
    
    async def lock_user(self, user_id: str, lock_duration_hours: int = 24) -> Optional[User]:
        """Lock a user account for a specified duration."""
        lock_expires_at = datetime.utcnow() + timedelta(hours=lock_duration_hours)
        return await self.update_user(
            user_id,
            {
                "is_locked": True,
                "lock_expires_at": lock_expires_at
            }
        )
    
    async def unlock_user(self, user_id: str) -> Optional[User]:
        """Unlock a user account."""
        return await self.update_user(
            user_id,
            {
                "is_locked": False,
                "lock_expires_at": None
            }
        )
    
    async def increment_spam_warnings(self, user_id: str) -> Optional[User]:
        """Increment spam warning count for a user."""
        result = await self.collection.find_one_and_update(
            {"id": user_id},
            {"$inc": {"spam_warnings": 1}},
            return_document=True
        )
        if result:
            return User(**result)
        return None
    
    async def check_and_unlock_expired_locks(self):
        """Check for expired locks and unlock users automatically."""
        now = datetime.utcnow()
        await self.collection.update_many(
            {
                "is_locked": True,
                "lock_expires_at": {"$lte": now}
            },
            {
                "$set": {
                    "is_locked": False,
                    "lock_expires_at": None
                }
            }
        )
    
    async def promote_to_admin(self, user_id: str) -> Optional[User]:
        """Promote a user to admin role."""
        from app.models.user import UserRole
        return await self.update_user(user_id, {"role": UserRole.ADMIN})
