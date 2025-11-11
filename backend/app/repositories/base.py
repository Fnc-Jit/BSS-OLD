from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection
from typing import List, Optional, Dict, Any
from datetime import datetime


class BaseRepository:
    """Base repository with common CRUD operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase, collection_name: str):
        self.db = db
        self.collection: AsyncIOMotorCollection = db[collection_name]
    
    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new document."""
        result = await self.collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        return data
    
    async def find_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Find a document by ID."""
        return await self.collection.find_one({"id": doc_id})
    
    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Find a single document matching the query."""
        return await self.collection.find_one(query)
    
    async def find_many(
        self,
        query: Dict[str, Any] = None,
        skip: int = 0,
        limit: int = 100,
        sort: List[tuple] = None
    ) -> List[Dict[str, Any]]:
        """Find multiple documents matching the query."""
        if query is None:
            query = {}
        
        cursor = self.collection.find(query)
        
        if sort:
            cursor = cursor.sort(sort)
        
        cursor = cursor.skip(skip).limit(limit)
        
        return await cursor.to_list(length=limit)
    
    async def update(self, doc_id: str, data: Dict[str, Any]) -> bool:
        """Update a document by ID."""
        data["updated_at"] = datetime.now()
        result = await self.collection.update_one(
            {"id": doc_id},
            {"$set": data}
        )
        return result.modified_count > 0
    
    async def delete(self, doc_id: str) -> bool:
        """Delete a document by ID."""
        result = await self.collection.delete_one({"id": doc_id})
        return result.deleted_count > 0
    
    async def count(self, query: Dict[str, Any] = None) -> int:
        """Count documents matching the query."""
        if query is None:
            query = {}
        return await self.collection.count_documents(query)
