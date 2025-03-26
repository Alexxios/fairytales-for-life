import os
from datetime import datetime, timedelta
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from sqlmodel import Session, select

from ..models.user import UserRole, User
from ..database.database import get_session

# Настройки JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- Вспомогательные функции ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Создаёт JWT-токен с помощью PyJWT."""
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Роуты ---

@router.post("/register", response_model=User)
def register_user(
    username: str,
    password: str,
    db: Annotated[Session, Depends(get_session)]
):
    existing_user = db.exec(select(User).where(User.username == username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Имя пользователя занято")

    hashed_password = get_password_hash(password)
    user = User(username=username, password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login")
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[Session, Depends(get_session)]
):
    user = db.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверные учётные данные",
        )

    user.last_login = datetime.now()
    db.commit()

    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}
