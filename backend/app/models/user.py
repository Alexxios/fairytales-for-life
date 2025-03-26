from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    MODERATOR = "moderator"
    ADMIN = "admin"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=100)
    role: UserRole = Field(default=UserRole.USER)  # По умолчанию "user"
    created_at: datetime = Field(default_factory=datetime.now)
    last_login: Optional[datetime] = Field(default=None)