
from fastapi import APIRouter, Request
import httpx


async def get_city_by_ip(ip: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://ip-api.com/json/{ip}?fields=city")
        if response.status_code == 200:
            data = response.json()
            return data.get("city", "Unknown")
    return "Unknown"

router = APIRouter(prefix="/stats", tags=["Statistics"])

@router.get("/my-city")
async def get_my_city(request: Request):
    client_ip = request.client.host
    # Для локального тестирования (если IP 127.0.0.1)
    if client_ip == "127.0.0.1":
        client_ip = "8.8.8.8"  # Пример публичного IP
    
    city = await get_city_by_ip(client_ip)
    return {"ip": client_ip, "city": city}