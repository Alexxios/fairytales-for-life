# models/track.py
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class TrackBase(SQLModel):
    """Базовая модель трека (без отношений)"""
    title: Optional[str] = Field(default=None)
    author: Optional[str] = Field(default=None)
    
    theme: Optional[str] = Field(default=None)
    subtheme: Optional[str] = Field(default=None)
    
    description: Optional[str] = Field(default=None)


class Track(TrackBase, table=True):
    """Модель трека для базы данных"""
    id: Optional[int] = Field(default=None, primary_key=True)
    publisher_id: Optional[int] = Field(foreign_key="user.id")
    
    audio_url: str = Field(description="URL to audio file")
    duration: Optional[int] = Field(description="Duration in seconds")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    publisher: "User" = Relationship(back_populates="tracks")


class TrackCreate(TrackBase):
    """Модель для создания трека (только поля, которые передаются с клиента)"""
    pass
    
class TrackRead(TrackBase):
    """Модель для чтения данных трека"""
    audio_url: str
    duration: int

class TrackUpdate(TrackBase):
    """Модель для обновления трека"""
    pass