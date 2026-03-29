from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from routers.auth import get_current_user

from database import get_db
from models import UczestnikRajdu, Czlonek, Rajd

router = APIRouter()


class UczestnikSchema(BaseModel):
    czlonek_id: int
    rajd_id: int
    rola: str = "DPS"
    obecny: bool = True


@router.post("/")
async def dodaj_uczestnika(
    dane: UczestnikSchema, 
    db: Session = Depends(get_db),
    aktualny = Depends(get_current_user)
):
    czlonek = db.query(Czlonek).filter(Czlonek.id == dane.czlonek_id).first()
    if not czlonek:
        raise HTTPException(status_code=404, detail="nie znalezniono czlonka gildii")
    
    rajd = db.query(Rajd).filter(Rajd.id == dane.rajd_id).first()
    if not rajd:
        raise HTTPException(status_code=404, detail="nie znaleziono rajdu")
    
    istnieje = db.query(UczestnikRajdu).filter(
        UczestnikRajdu.czlonek_id == dane.czlonek_id,
        UczestnikRajdu.rajd_id == dane.rajd_id
    ).first()
    if istnieje:
        raise HTTPException(status_code=400, detail="czlonek jest juz zapisany na ten rajd")
    
    nowy = UczestnikRajdu(
        czlonek_id=dane.czlonek_id,
        rajd_id=dane.rajd_id,
        rola=dane.rola,
        obecny=dane.obecny
    )
    db.add(nowy)
    db.commit()
    db.refresh(nowy)

    return {
        "message": "dodano uczestnika",
        "czlonek": czlonek.imie,
        "rajd": rajd.nazwa,
        "rola": nowy.rola
    }

@router.get("/rajd/{rajd_id}")
async def uczestnicy_rajdu(
    rajd_id: int, 
    db: Session = Depends(get_db),
    aktualny = Depends(get_current_user)
):
    rajd = db.query(Rajd).filter(Rajd.id == rajd_id).first()
    if not rajd:
        raise HTTPException(status_code=404, detail="nie znalezniono rajdu")
    
    uczestnicy = db.query(UczestnikRajdu).filter(
        UczestnikRajdu.rajd_id == rajd_id
    ).all()

    return {
        "rajd": rajd.nazwa,
        "data": str(rajd.data),
        "liczba_uczestnikow": len(uczestnicy),
        "uczestnicy": [
            {
                "imie": u.czlonek.imie,
                "klasa": u.czlonek.klasa,
                "rola": u.rola,
                "obecny": u.obecny
            }
            for u in uczestnicy
        ]
    }

@router.get("/czlonek/{czlonek_id}")
async def rajdy_czlonka(
    czlonek_id: int, 
    db: Session = Depends(get_db),
    aktualny = Depends(get_current_user)
):
    czlonek = db.query(Czlonek).filter(Czlonek.id == czlonek_id).first()
    if not czlonek:
        raise HTTPException(status_code=404, detail="nie znaleziono czlonka gildii")
    
    uczestnictwa = db.query(UczestnikRajdu).filter(
        UczestnikRajdu.czlonek_id == czlonek_id
    ).all()

    return {
        "czlonek": czlonek.imie,
        "klasa": czlonek.klasa,
        "liczba_rajdow": len(uczestnictwa),
        "rajdy": [
            {
                "nazwa": u.rajd.nazwa,
                "data": str(u.rajd.data),
                "rola": u.rola,
                "obecny": u.obecny,
                "udany": u.rajd.udany
            }
            for u in uczestnictwa
        ]
    }

@router.delete("/{uczestnik_id}")
async def usun_uczestnika(
    uczestnik_id: int, 
    db: Session = Depends(get_db),
    aktualny = Depends(get_current_user)
):
    uczestnik = db.query(UczestnikRajdu).filter(UczestnikRajdu.id == uczestnik_id).first()
    if not uczestnik:
        raise HTTPException(status_code=404, detail="nie znaleziono uczestnika")
    
    db.delete(uczestnik)
    db.commit()
    return {"message": "usunieto uczestnika z rajdu"}