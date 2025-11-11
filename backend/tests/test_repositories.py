import pytest
from datetime import datetime, timedelta
from app.models import User, UserRole, Thread, Post, ModerationLog, ModerationAction


@pytest.mark.asyncio
class TestUserRepository:
    """Test UserRepository operations."""
    
    async def test_create_user(self, user_repo):
        """Test creating a user."""
        user = User(
            id="user123",
            username="ghost_user",
            email="ghost@neobbs.com",
            password_hash="hashed_password",
            role=UserRole.USER
        )
        
        created_user = await user_repo.create_user(user)
        assert created_user.username == "ghost_user"
        
        # Verify user was saved
        found_user = await user_repo.find_by_id("user123")
        assert found_user is not None
        assert found_user["email"] == "ghost@neobbs.com"
    
    async def test_find_by_email(self, user_repo):
        """Test finding user by email."""
        user = User(
            id="user456",
            username="spirit",
            email="spirit@neobbs.com",
            password_hash="hashed",
            role=UserRole.USER
        )
        await user_repo.create_user(user)
        
        found = await user_repo.find_by_email("spirit@neobbs.com")
        assert found is not None
        assert found["username"] == "spirit"
    
    async def test_find_by_username(self, user_repo):
        """Test finding user by username."""
        user = User(
            id="user789",
            username="phantom",
            email="phantom@neobbs.com",
            password_hash="hashed",
            role=UserRole.USER
        )
        await user_repo.create_user(user)
        
        found = await user_repo.find_by_username("phantom")
        assert found is not None
        assert found["email"] == "phantom@neobbs.com"
    
    async def test_lock_user(self, user_repo):
        """Test locking a user account."""
        user = User(
            id="user_lock",
            username="locked_ghost",
            email="locked@neobbs.com",
            password_hash="hashed",
            role=UserRole.USER
        )
        await user_repo.create_user(user)
        
        lock_time = datetime.now() + timedelta(hours=24)
        success = await user_repo.lock_user("user_lock", lock_time)
        assert success is True
        
        found = await user_repo.find_by_id("user_lock")
        assert found["is_locked"] is True


@pytest.mark.asyncio
class TestThreadRepository:
    """Test ThreadRepository operations."""
    
    async def test_create_thread(self, thread_repo):
        """Test creating a thread."""
        thread = Thread(
            id="thread123",
            board_id="crypt",
            author_id="user123",
            title="Welcome to the crypt"
        )
        
        created = await thread_repo.create_thread(thread)
        assert created.title == "Welcome to the crypt"
        
        found = await thread_repo.find_by_id("thread123")
        assert found is not None
        assert found["board_id"] == "crypt"
    
    async def test_find_by_board(self, thread_repo):
        """Test finding threads by board."""
        # Create multiple threads
        for i in range(3):
            thread = Thread(
                id=f"thread{i}",
                board_id="crypt",
                author_id="user123",
                title=f"Thread {i}"
            )
            await thread_repo.create_thread(thread)
        
        threads = await thread_repo.find_by_board("crypt", limit=10)
        assert len(threads) == 3
    
    async def test_increment_post_count(self, thread_repo):
        """Test incrementing post count."""
        thread = Thread(
            id="thread_count",
            board_id="crypt",
            author_id="user123",
            title="Count test",
            post_count=0
        )
        await thread_repo.create_thread(thread)
        
        success = await thread_repo.increment_post_count("thread_count")
        assert success is True
        
        found = await thread_repo.find_by_id("thread_count")
        assert found["post_count"] == 1
    
    async def test_find_inactive_threads(self, thread_repo):
        """Test finding inactive threads."""
        # Create old thread
        old_thread = Thread(
            id="old_thread",
            board_id="crypt",
            author_id="user123",
            title="Old thread",
            updated_at=datetime.now() - timedelta(hours=80)
        )
        await thread_repo.create_thread(old_thread)
        
        # Create recent thread
        new_thread = Thread(
            id="new_thread",
            board_id="crypt",
            author_id="user123",
            title="New thread"
        )
        await thread_repo.create_thread(new_thread)
        
        inactive = await thread_repo.find_inactive_threads(hours=72)
        assert len(inactive) >= 1
        assert any(t["id"] == "old_thread" for t in inactive)


@pytest.mark.asyncio
class TestPostRepository:
    """Test PostRepository operations."""
    
    async def test_create_post(self, post_repo):
        """Test creating a post."""
        post = Post(
            id="post123",
            thread_id="thread123",
            author_id="user123",
            content="This is a haunted message"
        )
        
        created = await post_repo.create_post(post)
        assert created.content == "This is a haunted message"
        
        found = await post_repo.find_by_id("post123")
        assert found is not None
    
    async def test_find_by_thread(self, post_repo):
        """Test finding posts by thread."""
        # Create multiple posts
        for i in range(3):
            post = Post(
                id=f"post{i}",
                thread_id="thread123",
                author_id="user123",
                content=f"Post {i}"
            )
            await post_repo.create_post(post)
        
        posts = await post_repo.find_by_thread("thread123")
        assert len(posts) == 3
    
    async def test_count_by_thread(self, post_repo):
        """Test counting posts in a thread."""
        for i in range(5):
            post = Post(
                id=f"count_post{i}",
                thread_id="count_thread",
                author_id="user123",
                content=f"Post {i}"
            )
            await post_repo.create_post(post)
        
        count = await post_repo.count_by_thread("count_thread")
        assert count == 5


@pytest.mark.asyncio
class TestModerationRepository:
    """Test ModerationRepository operations."""
    
    async def test_create_log(self, moderation_repo):
        """Test creating a moderation log."""
        log = ModerationLog(
            id="log123",
            user_id="user123",
            action=ModerationAction.WARNING,
            reason="Spam detected",
            performed_by="mod_bot"
        )
        
        created = await moderation_repo.create_log(log)
        assert created.reason == "Spam detected"
        
        found = await moderation_repo.find_by_id("log123")
        assert found is not None
    
    async def test_find_by_user(self, moderation_repo):
        """Test finding logs by user."""
        for i in range(3):
            log = ModerationLog(
                id=f"log{i}",
                user_id="user123",
                action=ModerationAction.WARNING,
                reason=f"Violation {i}",
                performed_by="mod_bot"
            )
            await moderation_repo.create_log(log)
        
        logs = await moderation_repo.find_by_user("user123")
        assert len(logs) == 3
    
    async def test_count_user_violations(self, moderation_repo):
        """Test counting user violations."""
        for i in range(2):
            log = ModerationLog(
                id=f"warn{i}",
                user_id="spammer",
                action=ModerationAction.WARNING,
                reason="Spam",
                performed_by="mod_bot"
            )
            await moderation_repo.create_log(log)
        
        count = await moderation_repo.count_user_violations("spammer", "warning")
        assert count == 2
