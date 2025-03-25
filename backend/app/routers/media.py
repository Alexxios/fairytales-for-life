import os
from typing import Annotated
from datetime import datetime

from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse, FileResponse

from sqlmodel import Session

from ..database.database import get_session
from ..models.media import Media

# Папка для сохранения медиафайлов
MEDIA_DIRECTORY = os.getenv('MEDIA_DIRECTORY')

# Разрешенные типы файлов
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "mp4", "mp3"}

def allowed_file(filename: str) -> bool:
    """Проверяет, что файл имеет разрешенное расширение."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


router = APIRouter(prefix="/media")

@router.put("/upload")
async def upload_media(
    db: Annotated[Session, Depends(get_session)], 
    file: UploadFile = File(...),
    description: str = None
):
    # Проверяем допустимость типа файла
    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="File type not allowed")

    # Используем оригинальное имя файла
    file_path = os.path.join(MEDIA_DIRECTORY, file.filename)

    # Проверяем существование файла
    if os.path.exists(file_path):
        raise HTTPException(
            status_code=409,
            detail="File with this name already exists"
        )

    try:
        # Начинаем транзакцию
        db.begin()

        # Сохраняем файл на диск
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Создаем запись в базе данных
        media_entry = Media(
            description=description,
            filepath=file_path,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        db.add(media_entry)
        db.commit()
        db.refresh(media_entry)

    except Exception as e:
        # Откатываем транзакцию при ошибке
        db.rollback()
        
        # Удаляем файл, если он был записан
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError as file_error:
                print(f"Failed to delete file: {file_error}")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file: {str(e)}"
        )

    return JSONResponse(
        status_code=201,
        content={
            "message": "File uploaded successfully",
            "media": {
                "id": media_entry.id,
                "description": media_entry.description,
                "filename": file.filename,
                "filepath": media_entry.filepath,
                "created_at": media_entry.created_at.isoformat(),
                "updated_at": media_entry.updated_at.isoformat()
            }
        },
    )

@router.get("/{filename}")
async def get_file(filename: str):
    """Возвращает файл из папки media."""
    file_path = os.path.join(MEDIA_DIRECTORY, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)
