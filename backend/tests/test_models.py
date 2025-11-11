import pytest
from datetime import datetime
from pydantic import ValidationError
from app.models import (
    User, UserCreate, UserRole,
    Thread, ThreadCreate,
    Post, PostCreate, BotType,
    ModerationLog, ModerationAction
)


class TestUserModel:
    """Test User model validation."""
    
    def test_user_creation_valid(self):
        """Test creating a valid user."""
        user = User(
            id="123",
            username="ghost_user",
            email="ghost@neobbs.com",
            password_hash="hashed_password",
            role=UserRole.USER
        )
        assert user.username == "ghost_user"
        assert user.email == "ghost@neobbs.com"
        assert user.role == UserRole.USER
        assert user.is_locked is False
        assert user.spam_warnings == 0
    
    def test_user_create_valid(self):
        """Test UserCreate validation."""
        user_create = UserCreate(
            username="new_ghost",
            email="new@neobbs.com",
            password="securepass123"
        )
        assert user_create.username == "new_ghost"
        assert len(user_create.password) >= 8
    
    def test_user_create_invalid_username(self):
        """Test UserCreate with invalid username."""
        with pytest.raises(ValidationError):
            UserCreate(
                username="ab",  # Too short
                email="test@neobbs.com",
                password="securepass123"
            )
    
    def test_user_create_invalid_email(self):
        """Test UserCreate with invalid email."""
        with pytest.raises(ValidationError):
            UserCreate(
                username="valid_user",
                email="invalid-email",
                password="securepass123"
            )
    
    def test_user_create_invalid_password(self):
        """Test UserCreate with short password."""
        with pytest.raises(ValidationError):
            UserCreate(
                username="valid_user",
                email="test@neobbs.com",
                password="short"  # Too short
            )


class TestThreadModel:
    """Test Thread model validation."""
    
    def test_thread_creation_valid(self):
        """Test creating a valid thread."""
        thread = Thread(
            id="thread123",
            board_id="crypt",
            author_id="user123",
            title="Welcome to the afterlife"
        )
        assert thread.title == "Welcome to the afterlife"
        assert thread.board_id == "crypt"
        assert thread.is_locked is False
        assert thread.is_pinned is False
        assert thread.is_resurrected is False
        assert thread.post_count == 0
    
    def test_thread_create_valid(self):
        """Test ThreadCreate validation."""
        thread_create = ThreadCreate(
            board_id="crypt",
            title="New haunted thread",
            content="This is the first post content"
        )
        assert thread_create.title == "New haunted thread"
        assert len(thread_create.content) > 0
    
    def test_thread_create_invalid_title(self):
        """Test ThreadCreate with invalid title."""
        with pytest.raises(ValidationError):
            ThreadCreate(
                board_id="crypt",
                title="ab",  # Too short
                content="Valid content here"
            )
    
    def test_thread_create_title_too_long(self):
        """Test ThreadCreate with title too long."""
        with pytest.raises(ValidationError):
            ThreadCreate(
                board_id="crypt",
                title="a" * 101,  # Too long
                content="Valid content"
            )


class TestPostModel:
    """Test Post model validation."""
    
    def test_post_creation_valid(self):
        """Test creating a valid post."""
        post = Post(
            id="post123",
            thread_id="thread123",
            author_id="user123",
            content="This is a haunted message"
        )
        assert post.content == "This is a haunted message"
        assert post.is_bot is False
        assert post.bot_type is None
        assert post.ascii_art is None
    
    def test_post_bot_creation(self):
        """Test creating a bot post."""
        post = Post(
            id="post456",
            thread_id="thread123",
            author_id="haunt_bot",
            content="This thread has returned from the beyond!",
            is_bot=True,
            bot_type=BotType.HAUNT
        )
        assert post.is_bot is True
        assert post.bot_type == BotType.HAUNT
    
    def test_post_create_valid(self):
        """Test PostCreate validation."""
        post_create = PostCreate(
            thread_id="thread123",
            content="Reply to the haunted thread"
        )
        assert post_create.content == "Reply to the haunted thread"
    
    def test_post_create_content_too_long(self):
        """Test PostCreate with content too long."""
        with pytest.raises(ValidationError):
            PostCreate(
                thread_id="thread123",
                content="a" * 5001  # Too long
            )
    
    def test_post_create_empty_content(self):
        """Test PostCreate with empty content."""
        with pytest.raises(ValidationError):
            PostCreate(
                thread_id="thread123",
                content=""  # Empty
            )


class TestModerationLogModel:
    """Test ModerationLog model validation."""
    
    def test_moderation_log_creation(self):
        """Test creating a moderation log."""
        log = ModerationLog(
            id="log123",
            user_id="user123",
            action=ModerationAction.WARNING,
            reason="Spam detected",
            performed_by="mod_bot"
        )
        assert log.action == ModerationAction.WARNING
        assert log.reason == "Spam detected"
        assert log.performed_by == "mod_bot"
        assert log.post_id is None
    
    def test_moderation_log_with_post(self):
        """Test moderation log with post reference."""
        log = ModerationLog(
            id="log456",
            user_id="user123",
            action=ModerationAction.DELETE,
            reason="Inappropriate content",
            performed_by="admin123",
            post_id="post789"
        )
        assert log.post_id == "post789"
        assert log.action == ModerationAction.DELETE
