from fastapi import APIRouter

router = APIRouter()

gildia = {
    "nazwa": "EXQ",
    "serwer": "Burning Legion",
    "frakcja": "Horda",
    "opis": "Casualowa gildia rajdowa"
}

@router.get("/")
async def info_gildii():
    return gildia

@router.get("/")
async def aktualizuj_gildie(nazwa: str = None, opis: str = None):
    if nazwa:
        gildia["nazwa"] = nazwa
    if opis:
        gildia["opis"] = opis
    return{"message": "Zaktualizowano", "gildia": gildia}