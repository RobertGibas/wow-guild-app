from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class Czlonek(BaseModel):
    imie: str
    klasa: str
    poziom: int
    ranga: str

czlonkowie = [
    {"imie": "Arthas",   "klasa": "Death Knight", "poziom": 80, "ranga": "Guild Master"},
    {"imie": "Jaina",    "klasa": "Mage",          "poziom": 80, "ranga": "Officer"},
    {"imie": "Thrall",   "klasa": "Shaman",        "poziom": 80, "ranga": "Member"},
    {"imie": "Sylvanas", "klasa": "Hunter",        "poziom": 80, "ranga": "Member"},
]

@router.get("/")
async def roster():
    return czlonkowie

@router.get("/{imie}")
async def czlonek_po_imieniu(imie: str):
    for czlonek in czlonkowie:
        if czlonek["imie"].lower() == imie.lower():
            return czlonek
    return {"blad": f"Nie znaleziono gracza {imie}"}

@router.post("/")
async def dodaj_czlonka(czlonek: Czlonek):
    nowy = czlonek.model_dump()
    czlonkowie.append(nowy)
    return {"message": "Dodano!", "czlonek": nowy}

@router.delete("/{imie}")
async def usun_czlonka(imie: str):
    for i, czlonek in enumerate(czlonkowie):
        if czlonek["imie"].lower() == imie.lower():
            usuniety = czlonkowie.pop(i)
            return {"message": f"Usunięto {usuniety['imie']}"}
    return {"blad": f"Nie znaleziono gracza {imie}"}