import pytest
import pytest_asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.repositories import (
    UserRepository,
    ThreadRepository,
    PostRepository,
    ModerationRepository
)


@pytest_asyncio.fixture
async def test_db():
    """Create a test database connection."""
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.test_neobbs
    
    yield db
    
    # Cleanup: drop test database
    await client.drop_database("test_neobbs")
    client.close()


@pytest_asyncio.fixture
async def user_repo(test_db):
    """Create UserRepository instance."""
    return UserRepository(test_db)


@pytest_asyncio.fixture
async def thread_repo(test_db):
    """Create ThreadRepository instance."""
    return ThreadRepository(test_db)


@pytest_asyncio.fixture
async def post_repo(test_db):
    """Create PostRepository instance."""
    return PostRepository(test_db)


@pytest_asyncio.fixture
async def moderation_repo(test_db):
    """Create ModerationRepository instance."""
    return ModerationRepository(test_db)
