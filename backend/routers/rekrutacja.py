from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from database import get_db
from models import Podanie
from core.security import get_current_user, get_admin_user

router = APIRouter()

class PodanieSchema(BaseModel):
    imie_postaci: str
    klasa_postaci: str
    poziom: int
    doswiadczenie: str = ""
    dlaczego_aplikuje: str = ""
    kontakt_discord: str = ""

class KomentarzSchema(BaseModel):
    komentarz: str

@router.post("/")
async def zloz_podanie(dane: PodanieSchema, db: Session = Depends(get_db)):
    nowe = Podanie(
        imie_postaci=dane.imie_postaci,
        klasa_postaci=dane.klasa_postaci,
        poziom=dane.poziom,
        doswiadczenie=dane.doswiadczenie,
        dlaczego_aplikuje=dane.dlaczego_aplikuje,
        kontakt_discord=dane.kontakt_discord,
    )
    db.add(nowe)
    db.commit()
    db.refresh(nowe)
    return{
        "message": "podanie zlozone, odezwiemy sie na discord",
        "id": nowe.id
    }

@router.get("/")
async def lista_podan(db: Session = Depends(get_db), aktualny = Depends(get_admin_user)):
    return db.query(Podanie).all()

@router.get("/oczekujace")
async def oczekujace_podania(db: Session = Depends(get_db), aktualny = Depends(get_admin_user)):
    return db.query(Podanie).filter(
        Podanie.status == "oczekujace"
    ).all()

@router.get("/{podanie_id}")
async def szeczgoly_podania(
    podanie_id: int,
    db: Session = Depends(get_db),
    aktualny = Depends(get_admin_user)
):
    podanie = db.query(Podanie).filter(Podanie.id == podanie_id).first()
    if not podanie:
        raise HTTPException(status_code=404, detail="nie znaleziono podania")
    return podanie

@router.put("/{podanie_id}/akceptuj")
async def akceptuj_podanie(
    podanie_id: int,
    dane: KomentarzSchema,
    db: Session = Depends(get_db),
    aktualny = Depends(get_admin_user)
):
    podanie = db.query(Podanie).filter(Podanie.id == podanie_id).first()
    if not podanie:
        raise HTTPException(status_code=404, detail="nie znaleziono podania")
    if podanie.status != "oczekujace":
        raise HTTPException(status_code=400, detail="to podanie zostalo juz rozpatrzone")
    
    podanie.status = "zakceptowane"
    podanie.komentarz_oficera=dane.komentarz
    db.commit()
    return{
        "message": f"zakceptowano podanie gracza {podanie.imie_postaci}",
        "podanie": {
            "imie": podanie.imie_postaci,
            "klasa": podanie.klasa_postaci,
            "status": podanie.status,
            "komentarz": podanie.komentarz_oficera
        }
    }

@router.put("/{podanie_id}/odrzuc")
async def odrzuc_podanie(
    podanie_id: int,
    dane: KomentarzSchema,
    db: Session = Depends(get_db),
    aktualny = Depends(get_admin_user)
):
    podanie = db.query(Podanie).filter(Podanie.id == podanie_id).first()
    if not podanie:
        raise HTTPException(status_code=404, detail="nie znaleziono podania")
    if podanie.status != "oczekujace":
        raise HTTPException(status_code=400, detail="to podanie zostalo juz rozpatrzone")
    
    podanie.status = "odrzucone"
    podanie.komentarz_oficera = dane.komentarz
    db.commit()
    return {
        "message": f"odrzucono podanie gracza {podanie.imie_postaci}",
        "podanie": {
            "imie": podanie.imie_postaci,
            "klasa": podanie.klasa_postaci,
            "status": podanie.status,
            "komentarz": podanie.komentarz_oficera
        }
    }