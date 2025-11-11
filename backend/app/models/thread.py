from pydantic import BaseModel, Field
from datetime import datetime


class Thread(BaseModel):
    id: str = Field(default_factory=lambda: str(datetime.now().timestamp()))
    board_id: str
    author_id: str
    title: str = Field(..., min_length=3, max_length=100)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    is_locked: bool = False
    is_pinned: bool = False
    is_resurrected: bool = False
    post_count: int = 0

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1234567890",
                "board_id": "crypt",
                "author_id": "user123",
                "title": "Welcome to the afterlife",
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00",
                "is_locked": False,
                "is_pinned": False,
                "is_resurrected": False,
                "post_count": 5
            }
        }


class ThreadCreate(BaseModel):
    board_id: str
    title: str = Field(..., min_length=3, max_length=100)
    content: str = Field(..., min_length=1, max_length=5000)


class ThreadUpdate(BaseModel):
    title: str = Field(None, min_length=3, max_length=100)
    is_locked: bool = None
    is_pinned: bool = None


class ThreadResponse(BaseModel):
    id: str
    board_id: str
    author_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    is_locked: bool
    is_pinned: bool
    is_resurrected: bool
    post_count: int

    class Config:
        from_attributes = True
