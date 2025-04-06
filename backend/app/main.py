import os
from typing import Annotated, List

import uvicorn

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

from sqlmodel import Session

from .database.database import create_db_and_tables, get_session
from .routers import auth, media, users
        

app = FastAPI()
app.include_router(auth.router)
app.include_router(media.router)
app.include_router(users.router)
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

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/test_connection")
def test_connection(db: Annotated[Session, Depends(get_session)]):
    return db != None

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)