from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from .user import User  # И модель пользователя

class PlayEvent(SQLModel, table=True):
    """Модель для хранения данных о прослушиваниях треков"""
    id: Optional[int] = Field(default=None, primary_key=True)
    track_id: int = Field(foreign_key="track.id")
    user_id: Optional[int] = Field(foreign_key="user.id", default=None)
    played_at: datetime = Field(default_factory=datetime.utcnow)
    client_ip: Optional[str] = None
    user_agent: Optional[str] = None
    
    user: Optional[User] = Relationship()

class DownloadEvent(SQLModel, table=True):
    """Модель для хранения данных о скачиваниях треков"""
    id: Optional[int] = Field(default=None, primary_key=True)
    track_id: int = Field(foreign_key="track.id")
    user_id: Optional[int] = Field(foreign_key="user.id", default=None)
    downloaded_at: datetime = Field(default_factory=datetime.utcnow)
    client_ip: Optional[str] = None
    user_agent: Optional[str] = None
    
    user: Optional[User] = Relationship()