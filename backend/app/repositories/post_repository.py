from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from .base import BaseRepository
from ..models.post import Post


class PostRepository(BaseRepository):
    """Repository for Post operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "posts")
    
    async def create_post(self, post: Post) -> Post:
        """Create a new post."""
        post_dict = post.model_dump()
        await self.create(post_dict)
        return post
    
    async def find_by_thread(
        self,
        thread_id: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[dict]:
        """Find posts by thread ID with pagination."""
        return await self.find_many(
            query={"thread_id": thread_id},
            skip=skip,
            limit=limit,
            sort=[("created_at", 1)]
        )
    
    async def find_by_author(
        self,
        author_id: str,
        skip: int = 0,
        limit: int = 50
    ) -> List[dict]:
        """Find posts by author ID."""
        return await self.find_many(
            query={"author_id": author_id},
            skip=skip,
            limit=limit,
            sort=[("created_at", -1)]
        )
    
    async def find_recent_by_author(
        self,
        author_id: str,
        limit: int = 10
    ) -> List[dict]:
        """Find recent posts by author for spam detection."""
        return await self.find_many(
            query={"author_id": author_id, "is_bot": False},
            limit=limit,
            sort=[("created_at", -1)]
        )
    
    async def count_by_thread(self, thread_id: str) -> int:
        """Count posts in a thread."""
        return await self.count({"thread_id": thread_id})
