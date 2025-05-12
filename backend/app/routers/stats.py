from typing import Optional
from fastapi import APIRouter, Depends, Request
from sqlmodel import Session

import httpx

from ..services.stats import StatisticsService
from ..database.database import get_session

async def get_city_by_ip(ip: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://ip-api.com/json/{ip}?fields=city")
        if response.status_code == 200:
            data = response.json()
            return data.get("city", "Unknown")
    return "Unknown"

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/my-city")
async def get_my_city(request: Request):
    client_ip = request.client.host
    # Для локального тестирования (если IP 127.0.0.1)
    if client_ip == "127.0.0.1":
        client_ip = "8.8.8.8"  # Пример публичного IP
    
    city = await get_city_by_ip(client_ip)
    return {"ip": client_ip, "city": city}




router = APIRouter(prefix="/statistics", tags=["statistics"])

@router.post("/track/{track_id}/play")
async def record_play(
    track_id: int,
    request: Request,
    db: Session = Depends(get_session),
    user_id: Optional[int] = None  # В реальном приложении получаем из аутентификации
):
    """Запись события прослушивания трека"""
    service = StatisticsService(db)
    await service.record_play_event(track_id, user_id, request)
    return {"status": "ok"}

@router.post("/track/{track_id}/download")
async def record_download(
    track_id: int,
    request: Request,
    db: Session = Depends(get_session),
    user_id: Optional[int] = None
):
    """Запись события скачивания трека"""
    service = StatisticsService(db)
    await service.record_download_event(track_id, user_id, request)
    return {"status": "ok"}

@router.get("/track/{track_id}/plays")
async def get_play_count(
    track_id: int,
    db: Session = Depends(get_session)
):
    """Получение количества прослушиваний трека"""
    service = StatisticsService(db)
    return {"count": service.get_track_play_count(track_id)}

@router.get("/track/{track_id}/downloads")
async def get_download_count(
    track_id: int,
    db: Session = Depends(get_session)
):
    """Получение количества скачиваний трека"""
    service = StatisticsService(db)
    return {"count": service.get_track_download_count(track_id)}

@router.get("/user/{user_id}/history")
async def get_user_history(
    user_id: int,
    limit: int = 100,
    db: Session = Depends(get_session)
):
    """Получение истории прослушиваний пользователя"""
    service = StatisticsService(db)
    return service.get_user_play_history(user_id, limit)
