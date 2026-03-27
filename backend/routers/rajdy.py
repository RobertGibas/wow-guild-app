from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from models import Rajd
from typing import Optional

router = APIRouter()

class RajdResponse(BaseModel):
    id: int
    nazwa: str
    data: Optional[datetime] = None
    udany: bool
    notatki: str

    class config:
        from_attributes = True

class RajdSchema(BaseModel):
    nazwa: str
    data: datetime
    udany: bool = False
    notatki: str = "Nie ma zadnych notatek"

@router.get("/", response_model=list[RajdResponse])
async def lista_rajdow(db: Session = Depends(get_db)):
    return db.query(Rajd).all()

@router.get("/{rajd_id}", response_model=RajdResponse)
async def szczegoly_rajdu(rajd_id: int, db: Session = Depends(get_db)):
    rajd = db.query(Rajd).filter(Rajd.id == rajd_id).first()
    if not rajd:
        raise HTTPException(status_code=404, detail="nie znaleziono rajdu")
    return rajd

@router.post("/")
async def dodaj_rajd(dane: RajdSchema, db: Session = Depends(get_db)):
    nowy = Rajd(
        nazwa=dane.nazwa,
        data=dane.data,
        udany=dane.udany,
        notatki=dane.notatki
    )
    db.add(nowy)
    db.commit()
    db.refresh(nowy)
    return nowy

@router.put("/{rajd_id}")
async def aktualizuj_rajd(rajd_id: int, dane: RajdSchema, db: Session = Depends(get_db)):
    rajd = db.query(Rajd).filter(Rajd.id == rajd.id).first()
    if not rajd:
        raise HTTPException(status_code=404, detail="nie znaleziono rajdu")
    
    rajd.nazwa = dane.nazwa
    rajd.data = dane.data
    rajd.udany = dane.udany
    rajd.notatki = dane.notatki 
    
    db.commit()
    db.refresh(rajd)
    return rajd

@router.delete("/{rajd_id}")
async def usun_rajd(rajd_id: int, db: Session = Depends(get_db)):
    rajd = db.query(Rajd).filter(Rajd.id == rajd_id).first()
    if not rajd:
        raise HTTPException(status_code=404, detail="nie znaleziono rajdu")
    db.delete(rajd)
    db.commit()
    return {"message": f"Usunieto rajd {rajd.nazwa}"}