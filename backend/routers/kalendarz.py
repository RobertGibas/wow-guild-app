from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from database import get_db
from models import Wydarzenie

router = APIRouter()

class WydarzenieSchema(BaseModel):
    tytul: str
    data: datetime
    opis: str = "brak opisu"
    obowiazkowe: bool = False

class WydarzenieResponse(BaseModel):
    id: int
    tytul: str
    data: Optional[datetime] = None
    opis: str
    obowiazkowe: bool

    class Config:
        from_attributes = True

@router.get("/", response_model=list[WydarzenieResponse])
async def lista_wydarzen(db: Session = Depends(get_db)):
    return db.query(Wydarzenie).all()

@router.get("/{wydarzenie_id}", response_model=WydarzenieResponse)
async def szczegoly_wydarzenia(wydarzenie_id: int, db: Session = Depends(get_db)):
    wydarzenie = db.query(Wydarzenie).filter(Wydarzenie.id == wydarzenie_id).first()
    if not wydarzenie:
        raise HTTPException(status_code=404, detail="nie znaleziono wydarzenia")
    return wydarzenie

@router.post("/")
async def dodaj_wydarzenie(dane: WydarzenieSchema, db: Session = Depends(get_db)):
    nowe = Wydarzenie(
        tytul=dane.tytul,
        data=dane.data,
        opis=dane.opis,
        obowiazkowe=dane.obowiazkowe
    )
    db.add(nowe)
    db.commit()
    db.refresh(nowe)
    return nowe

@router.delete("/{wydarzenie_id}")
async def usun_wydarzenie(wydarzenie_id: int, db: Session = Depends(get_db)):
    wydarzenie = db.query(Wydarzenie).filter(Wydarzenie.id == wydarzenie_id).first()
    if not wydarzenie:
        raise HTTPException(status_code=404, detail="nie znaleziono wydarzenia")
    db.delete(wydarzenie)
    db.commit()
    return {"message": f"Usunieto {wydarzenie.tytul}"}