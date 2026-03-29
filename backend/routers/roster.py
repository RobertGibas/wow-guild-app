from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Czlonek
from core.security import get_current_user,get_admin_user

router = APIRouter()

class CzlonekSchema(BaseModel):
    imie: str
    klasa: str
    poziom: int
    ranga: str

@router.get("/")
async def roster(
    db: Session = Depends(get_db),
    aktualny = Depends(get_current_user)
):
    return db.query(Czlonek).all()

@router.get("/{czlonek_id}")
async def czlonek_po_id(
    czlonek_id: int, 
    db: Session = Depends(get_db),
    aktualny = Depends(get_current_user)
):
    czlonek = db.query(Czlonek).filter(Czlonek.id == czlonek_id).first()
    if not czlonek:
        raise HTTPException(status_code=404, detail="Nie znaleziono gracza")
    return czlonek

@router.post("/")
async def dodaj_czlonka(
    dane: CzlonekSchema, 
    db: Session = Depends(get_db),
    aktualny = Depends(get_admin_user)
):
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
async def usun_czlonka(
    czlonek_id: int, 
    db: Session = Depends(get_db),
    aktualny = Depends(get_admin_user)
):
    czlonek = db.query(Czlonek).filter(Czlonek.id == czlonek_id).first()
    if not czlonek:
        raise HTTPException(status_code=404, detail="Nie znaleziono gracza")
    db.delete(czlonek)
    db.commit()
    return {"message": f"Usunieto {czlonek.imie}"}