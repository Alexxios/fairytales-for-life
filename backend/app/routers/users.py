import os
from datetime import datetime, timedelta
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Body, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from sqlmodel import Session, select

from ..models.user import UserRole, User, UserRead
from ..database.database import get_session

# Настройки JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

router = APIRouter(prefix="/users", tags=["Users"])

# --- Вспомогательные функции ---

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_session)]
) -> User:
    """Получает пользователя из токена."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Неверный или просроченный токен",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:  # Ловим ошибки PyJWT
        raise credentials_exception

    user = db.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """Проверяет, что текущий пользователь — администратор."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Требуются права администратора"
        )
    return current_user

# --- Роуты ---

@router.get("/me", response_model=UserRead)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return UserRead(
        **current_user.model_dump()
    )

@router.patch("/{username}/set-role", response_model=User)
def set_user_role(
    username: str,
    db: Annotated[Session, Depends(get_session)],
    new_role: UserRole = Body(..., embed=True),  # Роль передаётся в теле запроса
    admin: Annotated[User, Depends(get_current_admin)] = None,  # Только для админов
):
    """
    Изменить роль пользователя (только для администраторов).
    Доступные роли: "user", "admin".
    """
    user = db.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="Администратор не может изменить свою роль"
        )
    
    user.role = new_role
    db.commit()
    db.refresh(user)
    return user