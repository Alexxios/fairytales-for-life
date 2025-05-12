from typing import Optional
from sqlmodel import Session
from ..models.stats import PlayEvent, DownloadEvent
from fastapi import Request
from datetime import datetime

class StatisticsService:
    def __init__(self, session: Session):
        self.session = session
    
    async def record_play_event(
        self,
        track_id: int,
        user_id: Optional[int] = None,
        request: Optional[Request] = None
    ) -> PlayEvent:
        """Запись события прослушивания трека"""
        play_event = PlayEvent(
            track_id=track_id,
            user_id=user_id,
            played_at=datetime.utcnow(),
            client_ip=request.client.host if request else None,
            user_agent=request.headers.get("user-agent") if request else None
        )
        
        self.session.add(play_event)
        self.session.commit()
        self.session.refresh(play_event)
        
        return play_event
    
    async def record_download_event(
        self,
        track_id: int,
        user_id: Optional[int] = None,
        request: Optional[Request] = None
    ) -> DownloadEvent:
        """Запись события скачивания трека"""
        download_event = DownloadEvent(
            track_id=track_id,
            user_id=user_id,
            downloaded_at=datetime.utcnow(),
            client_ip=request.client.host if request else None,
            user_agent=request.headers.get("user-agent") if request else None
        )
        
        self.session.add(download_event)
        self.session.commit()
        self.session.refresh(download_event)
        
        return download_event
    
    def get_track_play_count(self, track_id: int) -> int:
        """Получение количества прослушиваний трека"""
        from sqlmodel import select, func
        statement = select(func.count()).where(PlayEvent.track_id == track_id)
        return self.session.exec(statement).one()
    
    def get_track_download_count(self, track_id: int) -> int:
        """Получение количества скачиваний трека"""
        from sqlmodel import select, func
        statement = select(func.count()).where(DownloadEvent.track_id == track_id)
        return self.session.exec(statement).one()
    
    def get_user_play_history(self, user_id: int, limit: int = 100) -> list[PlayEvent]:
        """Получение истории прослушиваний пользователя"""
        from sqlmodel import select
        statement = select(PlayEvent).where(PlayEvent.user_id == user_id).limit(limit)
        return self.session.exec(statement).all()