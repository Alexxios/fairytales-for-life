import os
from typing import Annotated, List
from datetime import datetime

from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse

from sqlmodel import Session, select

from ..database.database import get_session
from ..models.media import Media

# Папка для сохранения медиафайлов
MEDIA_DIRECTORY = os.getenv('MEDIA_DIRECTORY')

# Разрешенные типы файлов
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "mp4", "mp3"}

def allowed_file(filename: str) -> bool:
    """Проверяет, что файл имеет разрешенное расширение."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


router = APIRouter(prefix="/media", tags=["Media"])
# router.mount(MEDIA_DIRECTORY, StaticFiles(directory=MEDIA_DIRECTORY))

from fastapi import Query
from typing import List
from sqlmodel import select

@router.get("/", response_model=List[Media])
async def get_media_files(
    db: Annotated[Session, Depends(get_session)],
    limit: int = Query(default=10, gt=0, le=100, description="Maximum number of items to return"),
    offset: int = Query(default=0, ge=0, description="Number of items to skip")
):
    """
    Получить список медиафайлов с пагинацией
    
    Параметры:
    - limit: максимальное количество возвращаемых записей (по умолчанию 10, максимум 100)
    - offset: количество записей для пропуска (для пагинации)
    """
    try:
        # Создаем запрос с лимитом и оффсетом
        statement = select(Media).offset(offset).limit(limit)
        results = db.exec(statement).all()
        
        if not results:
            raise HTTPException(
                status_code=404,
                detail="No media files found"
            )
            
        return results
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch media files: {str(e)}"
        )
    

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


@router.delete("/{filename}")
async def delete_file(filename: str):
    file_path = os.path.join(MEDIA_DIRECTORY, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except OSError as file_error:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete file: {file_error}"
            )
    return True