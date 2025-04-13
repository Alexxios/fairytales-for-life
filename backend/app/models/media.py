from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Media(SQLModel, table=True):
    """
    Модель для хранения информации о медиа-файлах.
    
    Attributes:
        id: Уникальный идентификатор файла (первичный ключ)
        description: Описание файла (может быть пустым)
        filepath: Путь к файлу в файловой системе или URL
        created_at: Дата и время создания записи
        updated_at: Дата и время последнего обновления записи
    """
    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        description="Уникальный идентификатор медиа-файла",
        index=True
    )
    
    description: Optional[str] = Field(
        default=None,
        max_length=500,
        nullable=True,
        description="Описание содержимого файла",
        index=True
    )
    
    filepath: str = Field(
        ...,
        max_length=255,
        nullable=False,
        description="Абсолютный путь к файлу или URL",
        index=True
    )
    
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Дата и время создания записи"
    )
    
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Дата и время последнего обновления записи"
    )
