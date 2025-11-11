from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class ModerationAction(str, Enum):
    WARNING = "warning"
    LOCK = "lock"
    DELETE = "delete"
    UNLOCK = "unlock"


class ModerationLog(BaseModel):
    id: str = Field(default_factory=lambda: str(datetime.now().timestamp()))
    user_id: str
    action: ModerationAction
    reason: str = Field(..., max_length=500)
    performed_by: str  # "mod_bot" or admin user_id
    timestamp: datetime = Field(default_factory=datetime.now)
    post_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1234567890",
                "user_id": "user123",
                "action": "warning",
                "reason": "Spam detected: repeated content",
                "performed_by": "mod_bot",
                "timestamp": "2024-01-01T00:00:00",
                "post_id": "post456"
            }
        }


class ModerationLogCreate(BaseModel):
    user_id: str
    action: ModerationAction
    reason: str = Field(..., max_length=500)
    performed_by: str
    post_id: Optional[str] = None


class ModerationLogResponse(BaseModel):
    id: str
    user_id: str
    action: ModerationAction
    reason: str
    performed_by: str
    timestamp: datetime
    post_id: Optional[str]

    class Config:
        from_attributes = True
