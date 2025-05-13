from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    MODERATOR = "moderator"
    ADMIN = "admin"

class UserBase(SQLModel):
    email: str = Field(index=True, unique=True, min_length=3, max_length=50)
    username: str = Field(min_length=3, max_length=50)
    
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    password: str = Field(min_length=8, max_length=100)
    role: UserRole = Field(default=UserRole.USER)  # По умолчанию "user"
    created_at: datetime = Field(default_factory=datetime.now)
    last_login: Optional[datetime] = Field(default=None)
    
    # Relationships
    tracks: List["Track"] = Relationship(back_populates="publisher")
    
class UserCreate(UserBase):
    """"""

class UserRead(UserBase):
    role: UserRole