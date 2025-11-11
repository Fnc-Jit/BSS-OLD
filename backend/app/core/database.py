from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Dict, Optional
from .config import settings


class DatabaseManager:
    """Manages MongoDB connections for different board clusters."""
    
    def __init__(self):
        self.clients: Dict[str, AsyncIOMotorClient] = {}
        self.databases: Dict[str, AsyncIOMotorDatabase] = {}
        
    async def connect(self):
        """Initialize connections to all MongoDB clusters."""
        # Crypt cluster
        self.clients["crypt"] = AsyncIOMotorClient(settings.MONGODB_CRYPT_URI)
        self.databases["crypt"] = self.clients["crypt"]["neobbs_crypt"]
        
        # Parlor cluster
        self.clients["parlor"] = AsyncIOMotorClient(settings.MONGODB_PARLOR_URI)
        self.databases["parlor"] = self.clients["parlor"]["neobbs_parlor"]
        
        # Comedy cluster
        self.clients["comedy-night"] = AsyncIOMotorClient(settings.MONGODB_COMEDY_URI)
        self.databases["comedy-night"] = self.clients["comedy-night"]["neobbs_comedy"]
        
        # Create indexes
        await self._create_indexes()
        
    async def _create_indexes(self):
        """Create database indexes for efficient querying."""
        for db_name, db in self.databases.items():
            # User indexes
            await db.users.create_index("email", unique=True)
            await db.users.create_index("username", unique=True)
            
            # Thread indexes
            await db.threads.create_index([("board_id", 1), ("created_at", -1)])
            await db.threads.create_index([("board_id", 1), ("is_pinned", -1)])
            await db.threads.create_index("updated_at")
            
            # Post indexes
            await db.posts.create_index([("thread_id", 1), ("created_at", 1)])
            await db.posts.create_index("author_id")
            
            # Moderation log indexes
            await db.moderation_logs.create_index([("user_id", 1), ("timestamp", -1)])
            await db.moderation_logs.create_index("timestamp")
    
    async def close(self):
        """Close all database connections."""
        for client in self.clients.values():
            client.close()
    
    def get_database(self, board_id: str) -> Optional[AsyncIOMotorDatabase]:
        """Get database for a specific board."""
        return self.databases.get(board_id)
    
    def get_default_database(self) -> AsyncIOMotorDatabase:
        """Get default database (crypt)."""
        return self.databases.get("crypt")


# Global database manager instance
db_manager = DatabaseManager()


async def get_db(board_id: str = "crypt") -> AsyncIOMotorDatabase:
    """Dependency to get database instance."""
    db = db_manager.get_database(board_id)
    if db is None:
        db = db_manager.get_default_database()
    return db
