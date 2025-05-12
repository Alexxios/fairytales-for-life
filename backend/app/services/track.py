from typing import List, Optional

from datetime import datetime
from sqlmodel import Session, select

from ..models.track import Track, TrackCreate, TrackUpdate

class TrackService:
    def __init__(self, session: Session):
        self.session = session
    
    # def create_track(self, track_data: TrackCreate) -> Track:
    #     """Создание нового трека"""
    #     track = Track.from_orm(track_data)
        
        
    #     self.session.add(track)
    #     self.session.commit()
    #     self.session.refresh(track)
    #     return track
    
    def get_track(self, track_id: int) -> Optional[Track]:
        """Получение трека по ID"""
        return self.session.get(Track, track_id)
    
    def get_tracks(self, skip: int = 0, limit: int = 100) -> List[Track]:
        """Получение списка треков"""
        statement = select(Track).offset(skip).limit(limit)
        return self.session.exec(statement).all()
    
    def get_user_tracks(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Track]:
        """Получение треков конкретного пользователя"""
        statement = select(Track).where(Track.publisher_id == user_id).offset(skip).limit(limit)
        return self.session.exec(statement).all()
    
    def update_track(self, track_id: int, track_data: TrackUpdate) -> Optional[Track]:
        """Обновление данных трека"""
        track = self.get_track(track_id)
        if not track:
            return None
        
        track_data_dict = track_data.dict(exclude_unset=True)
        for key, value in track_data_dict.items():
            setattr(track, key, value)
        
        track.updated_at = datetime.utcnow()
        self.session.add(track)
        self.session.commit()
        self.session.refresh(track)
        return track
    
    def delete_track(self, track_id: int) -> bool:
        """Удаление трека"""
        track = self.get_track(track_id)
        if not track:
            return False
        
        self.session.delete(track)
        self.session.commit()
        return True
    
    def search_tracks(self, query: str, skip: int = 0, limit: int = 100) -> List[Track]:
        """Поиск треков по названию и автору"""
        search = f"%{query}%"
        statement = select(Track).where(
            (Track.title.ilike(search)) | 
            (Track.author.ilike(search))
        ).offset(skip).limit(limit)
        return self.session.exec(statement).all()