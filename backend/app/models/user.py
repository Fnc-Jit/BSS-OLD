from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class User(BaseModel):
    id: str = Field(default_factory=lambda: str(datetime.now().timestamp()))
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password_hash: str
    role: UserRole = UserRole.USER
    created_at: datetime = Field(default_factory=datetime.now)
    is_locked: bool = False
    lock_expires_at: Optional[datetime] = None
    spam_warnings: int = 0

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1234567890",
                "username": "ghost_user",
                "email": "ghost@neobbs.com",
                "password_hash": "$2b$12$...",
                "role": "user",
                "created_at": "2024-01-01T00:00:00",
                "is_locked": False,
                "lock_expires_at": None,
                "spam_warnings": 0
            }
        }


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: UserRole
    created_at: datetime
    is_locked: bool

    class Config:
        from_attributes = True
