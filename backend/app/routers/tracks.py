import os
from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile, Form
from sqlmodel import Session
from typing import List, Optional, Annotated

import mutagen

from ..services.track import TrackService
from ..models.track import Track, TrackCreate, TrackRead, TrackUpdate
from ..models.user import User

from ..database.database import get_session

from .users import get_current_user, get_current_admin


# Папка для сохранения медиафайлов
MEDIA_DIR = os.getenv('MEDIA_DIRECTORY')

# Разрешенные типы файлов
ALLOWED_EXTENSIONS = {"mp3", '.wav', '.ogg', '.flac'}

def allowed_file(filename: str) -> bool:
    """Проверяет, что файл имеет разрешенное расширение."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


router = APIRouter(prefix="/tracks", tags=["Tracks"])

@router.post("/upload", response_model=TrackRead)
async def create_track(
    db: Annotated[Session, Depends(get_session)], 
    current_admin: Annotated[User, Depends(get_current_admin)],
    audio_file: UploadFile = File(...),
    track_data: str = Form(...),
):
    """Создание нового трека"""
    track_create = TrackCreate.parse_raw(track_data)
    
    # Проверяем допустимость типа файла
    if not allowed_file(audio_file.filename):
        raise HTTPException(status_code=400, detail="File type not allowed")

    # Используем оригинальное имя файла
    audio_path = os.path.join(MEDIA_DIR, audio_file.filename)

    # Проверяем существование файла
    if os.path.exists(audio_path):
        raise HTTPException(
            status_code=409,
            detail="File with this name already exists"
        )
    
    
    try:
        # Сохраняем файл на диск
        with open(audio_path, "wb") as buffer:
            buffer.write(await audio_file.read())
            
        # Извлекаем метаданные (длительность)
        audio_metadata = mutagen.File(audio_path, easy=True)
        duration = int(audio_metadata.info.length) if audio_metadata else 0   
        
        track = Track(title=track_create.title,
                      author=track_create.author,
                      theme=track_create.theme,
                      subtheme=track_create.subtheme,
                      description=track_create.description,
                      publisher_id = current_admin.id, 
                      audio_url = audio_path, 
                      duration = duration)

        
        db.add(track)
        db.commit()
        db.refresh(track)
        return enrich_track_response(track)
    except Exception as e:
        # Удаляем файл, если он был записан
        if os.path.exists(audio_path):
            try:
                os.remove(audio_path)
            except OSError as file_error:
                print(f"Failed to delete file: {file_error}")

        raise HTTPException(
            status_code=500,
            detail=f"{str(e)}"
        ) 

@router.get("/{track_id}", response_model=TrackRead)
async def get_track(
    db: Annotated[Session, Depends(get_session)], 
    current_admin: Annotated[User, Depends(get_current_admin)],
    track_id: int,
):
    """Получение информации о треке"""
    service = TrackService(db)
    track = service.get_track(track_id)
    if not track:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Track not found"
        )
    
    return enrich_track_response(track)

@router.get("/", response_model=List[TrackRead])
async def get_tracks(
    db: Annotated[Session, Depends(get_session)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
):
    """Получение списка треков"""
    service = TrackService(db)
    tracks = service.get_tracks(skip, limit)
    
    return [enrich_track_response(track) for track in tracks]

@router.put("/{track_id}", response_model=TrackRead)
async def update_track(
    db: Annotated[Session, Depends(get_session)], 
    current_admin: Annotated[User, Depends(get_current_admin)],
    track_id: int,
    track_data: TrackUpdate
):
    """Обновление информации о треке"""
    service = TrackService(db)
    track = service.get_track(track_id)
    
    if not track:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Track not found"
        )
    

    updated_track = service.update_track(track_id, track_data)
    return enrich_track_response(updated_track)

@router.delete("/{track_id}")
async def delete_track(
    db: Annotated[Session, Depends(get_session)], 
    current_admin: Annotated[User, Depends(get_current_admin)],
    track_id: int
):
    """Удаление трека"""
    service = TrackService(db)
    track = service.get_track(track_id)
    
    if not track:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Track not found"
        )
    
    success = service.delete_track(track_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete track"
        )
    
    return {"status": "success"}

@router.get("/search/", response_model=List[TrackRead])
async def search_tracks(
    db: Annotated[Session, Depends(get_session)],
    query: str = Query(..., min_length=2),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000)
):
    """Поиск треков по названию и описанию"""
    service = TrackService(db)
    tracks = service.search_tracks(query, skip, limit)
    return [enrich_track_response(track) for track in tracks]

def enrich_track_response(track: Track) -> TrackRead:
    """Дополнение данных трека для ответа (например, имя артиста)"""
    return TrackRead(
        **track.model_dump()
    )