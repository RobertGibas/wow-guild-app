from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Czlonek
router = APIRouter()

class CzlonekSchema(BaseModel):
    imie: str
    klasa: str
    poziom: int
    ranga: str

@router.get("/")
async def roster(db: Session = Depends(get_db)):
    czlonkowie = db.query(Czlonek).all()
    return czlonkowie

@router.get("/{czlonek_id}")
async def czlonek_po_id(czlonek_id: int, db: Session = Depends(get_db)):
    czlonek = db.query(Czlonek).filter(Czlonek.id == czlonek_id).first()
    if not czlonek:
        raise HTTPException(status_code=404, detail="Nie znaleziono gracza")
    return czlonek

@router.post("/")
async def dodaj_czlonka(dane: CzlonekSchema, db: Session = Depends(get_db)):
    nowy = Czlonek(
        imie=dane.imie,
        klasa=dane.klasa,
        poziom=dane.poziom,
        ranga=dane.ranga
    )
    db.add(nowy)
    db.commit()
    db.refresh(nowy)
    return nowy

@router.delete("/{czlonek_id}")
async def usun_czlonka(czlonek_id: int, db: Session = Depends(get_db)):
    czlonek = db.query(Czlonek).filter(Czlonek.id == czlonek_id).first()
    if not czlonek:
        raise HTTPException(status_code=404, detail="Nie znaleziono gracza")
    db.delete(czlonek)
    db.commit()
    return {"message": f"Usunieto {czlonek.imie}"}