from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class BotType(str, Enum):
    NEWS = "news"
    HAUNT = "haunt"
    MOD = "mod"


class Post(BaseModel):
    id: str = Field(default_factory=lambda: str(datetime.now().timestamp()))
    thread_id: str
    author_id: str
    content: str = Field(..., min_length=1, max_length=5000)
    created_at: datetime = Field(default_factory=datetime.now)
    is_bot: bool = False
    bot_type: Optional[BotType] = None
    ascii_art: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1234567890",
                "thread_id": "thread123",
                "author_id": "user123",
                "content": "This is a haunted message from beyond...",
                "created_at": "2024-01-01T00:00:00",
                "is_bot": False,
                "bot_type": None,
                "ascii_art": None
            }
        }


class PostCreate(BaseModel):
    thread_id: str
    content: str = Field(..., min_length=1, max_length=5000)
    ascii_art: Optional[str] = None


class PostUpdate(BaseModel):
    content: str = Field(None, min_length=1, max_length=5000)


class PostResponse(BaseModel):
    id: str
    thread_id: str
    author_id: str
    content: str
    created_at: datetime
    is_bot: bool
    bot_type: Optional[BotType]
    ascii_art: Optional[str]

    class Config:
        from_attributes = True
