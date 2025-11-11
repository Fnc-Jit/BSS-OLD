from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime, timedelta
from .base import BaseRepository
from ..models.thread import Thread


class ThreadRepository(BaseRepository):
    """Repository for Thread operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "threads")
    
    async def create_thread(self, thread: Thread) -> Thread:
        """Create a new thread."""
        thread_dict = thread.model_dump()
        await self.create(thread_dict)
        return thread
    
    async def find_by_board(
        self,
        board_id: str,
        skip: int = 0,
        limit: int = 50
    ) -> List[dict]:
        """Find threads by board ID with pagination."""
        return await self.find_many(
            query={"board_id": board_id},
            skip=skip,
            limit=limit,
            sort=[("is_pinned", -1), ("updated_at", -1)]
        )
    
    async def find_inactive_threads(self, hours: int = 72) -> List[dict]:
        """Find threads that haven't been updated in specified hours."""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        return await self.find_many(
            query={
                "updated_at": {"$lt": cutoff_time},
                "is_resurrected": False,
                "is_locked": False
            }
        )
    
    async def mark_resurrected(self, thread_id: str) -> bool:
        """Mark a thread as resurrected."""
        return await self.update(thread_id, {"is_resurrected": True})
    
    async def increment_post_count(self, thread_id: str) -> bool:
        """Increment the post count for a thread."""
        result = await self.collection.update_one(
            {"id": thread_id},
            {
                "$inc": {"post_count": 1},
                "$set": {"updated_at": datetime.now()}
            }
        )
        return result.modified_count > 0
    
    async def lock_thread(self, thread_id: str) -> bool:
        """Lock a thread."""
        return await self.update(thread_id, {"is_locked": True})
    
    async def unlock_thread(self, thread_id: str) -> bool:
        """Unlock a thread."""
        return await self.update(thread_id, {"is_locked": False})
    
    async def pin_thread(self, thread_id: str) -> bool:
        """Pin a thread."""
        return await self.update(thread_id, {"is_pinned": True})
    
    async def unpin_thread(self, thread_id: str) -> bool:
        """Unpin a thread."""
        return await self.update(thread_id, {"is_pinned": False})
