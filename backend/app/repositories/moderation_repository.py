from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from .base import BaseRepository
from ..models.moderation import ModerationLog


class ModerationRepository(BaseRepository):
    """Repository for ModerationLog operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "moderation_logs")
    
    async def create_log(self, log: ModerationLog) -> ModerationLog:
        """Create a new moderation log entry."""
        log_dict = log.model_dump()
        await self.create(log_dict)
        return log
    
    async def find_by_user(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 50
    ) -> List[dict]:
        """Find moderation logs for a specific user."""
        return await self.find_many(
            query={"user_id": user_id},
            skip=skip,
            limit=limit,
            sort=[("timestamp", -1)]
        )
    
    async def find_recent(
        self,
        skip: int = 0,
        limit: int = 100
    ) -> List[dict]:
        """Find recent moderation logs."""
        return await self.find_many(
            query={},
            skip=skip,
            limit=limit,
            sort=[("timestamp", -1)]
        )
    
    async def count_user_violations(self, user_id: str, action: str) -> int:
        """Count specific violations for a user."""
        return await self.count({"user_id": user_id, "action": action})
