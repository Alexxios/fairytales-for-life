from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class ThemeBase(SQLModel):
    name: str = Field(index=True)

class Theme(ThemeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="theme.id")
    
    # Родительская тема (если есть)
    parent: Optional["Theme"] = Relationship(
        sa_relationship_kwargs={"remote_side": "Theme.id"},
        back_populates="subthemes"
    )
    
    # Подтемы (дочерние темы)
    subthemes: List["Theme"] = Relationship(back_populates="parent")
    
    # Файлы, принадлежащие этой теме
    files: List["File"] = Relationship(back_populates="theme")

class ThemeCreate(ThemeBase):
    parent_id: Optional[int] = None

class ThemeRead(ThemeBase):
    id: int
    parent_id: Optional[int]
    subthemes: List["ThemeRead"] = []  # Рекурсивная вложенность
    files: List["FileRead"] = []

class FileBase(SQLModel):
    name: str = Field(index=True)
    path: str

class File(FileBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    theme_id: int = Field(foreign_key="theme.id")
    
    # Связь с темой
    theme: Theme = Relationship(back_populates="files")

class FileCreate(FileBase):
    theme_id: int

class FileRead(FileBase):
    id: int
    theme_id: int