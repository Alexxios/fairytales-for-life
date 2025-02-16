import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

class Fruit(BaseModel):
    name: str

class Fruits(BaseModel):
    fruits: List[Fruit]
    
class Subtheme(BaseModel):
    name: str
    
class Theme(BaseModel):
    name: str
    subthemes: List[Subtheme]

class Themes(BaseModel):
    themes: List[Theme]


class File(BaseModel):
    name: str



app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

theme1 = Theme(
    name="Тема 1",
    subthemes=[
        Subtheme(name="Подтема 1"),
        Subtheme(name="Подтема 2"),
        Subtheme(name="Подтема 3"), 
        Subtheme(name="Подтема 4")
    ])
theme2 = Theme(
    name="Тема 2",
    subthemes= [
        Subtheme(name="Подтема 1"),
        Subtheme(name="Подтема 2")
    ])

memory_db = {
    "fruits": [],
    "themes": [theme1, theme2]
}


@app.get("/fruits", response_model=Fruits)
def get_fruits():
    return Fruits(fruits=memory_db["fruits"])


@app.post("/fruits")
def add_fruit(fruit: Fruit):
    memory_db["fruits"].append(fruit)
    return fruit


@app.get("/themes", response_model=Themes)
def get_themes():
    return Themes(themes=memory_db["themes"])


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)