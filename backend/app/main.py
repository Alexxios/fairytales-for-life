import os
from typing import Annotated, List, Dict
from datetime import datetime

import uvicorn

from fastapi import FastAPI, Depends, File, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

from sqlmodel import Session

from .database.database import create_db_and_tables, get_session
from .routers import auth, media, users, stats, tracks
        
ip_storage: Dict[str, datetime] = {}

app = FastAPI()
app.include_router(auth.router)
app.include_router(media.router)
app.include_router(users.router)
app.include_router(stats.router)
app.include_router(tracks.router)
MEDIA_DIRECTORY = os.getenv('MEDIA_DIRECTORY')
app.mount(MEDIA_DIRECTORY, StaticFiles(directory=MEDIA_DIRECTORY))

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.middleware("http")
async def log_ip_address(request: Request, call_next):
    # Получаем IP клиента
    client_ip = request.client.host
    
    # Обновляем время последнего обращения
    ip_storage[client_ip] = datetime.now()
    
    response = await call_next(request)
    return response


@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/secrets", response_class=HTMLResponse)
async def get_secrets():
    video_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    html_content = f"""
    <html>
        <body>
            <iframe width="560" height="315" 
                    src="{video_url}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)