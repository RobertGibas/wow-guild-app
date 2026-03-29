from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Uzytkownik
from core.security import zaszyfruj_haslo, sprawdz_haslo, stworz_token, sprawdz_token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


class RejestracjaSchema(BaseModel):
    email: str
    nazwa: str
    haslo: str

def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    payload = sprawdz_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="nieprawidłowy token lub wygasł",
            headers={"WWW-Authenticate": "Bearer"},
        )
    uzytkownik = db.query(Uzytkownik).filter(
        Uzytkownik.id == payload.get("id")
    ).first()
    if not uzytkownik:
        raise HTTPException(status_code=404, detail="nie znaleziono uzytkownika")
    return uzytkownik

@router.post("/rejestracja")
async def rejestracja(dane: RejestracjaSchema, db: Session = Depends(get_db)):
    if db.query(Uzytkownik).filter(Uzytkownik.email == dane.email).first():
        raise HTTPException(status_code=400, detail="email jest juz zajety")
    
    nowy = Uzytkownik(
        email=dane.email,
        nazwa=dane.nazwa,
        haslo_hash=zaszyfruj_haslo(dane.haslo)
    )
    db.add(nowy)
    db.commit()
    db.refresh(nowy)
    return {"message": "zajerestrowano", "email": nowy.email}

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    uzytkownik = db.query(Uzytkownik).filter(
        Uzytkownik.email == form_data.username
    ).first()

    if not uzytkownik or not sprawdz_haslo(form_data.password, uzytkownik.haslo_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="nieprawidlowy email lub haslo"
        )
    
    token = stworz_token({"id": uzytkownik.id, "email": uzytkownik.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/moje-konto")
async def moje_konto(aktualny: Uzytkownik = Depends(get_current_user)):
    return {
        "id": aktualny.id,
        "email": aktualny.email,
        "nazwa": aktualny.nazwa,
        "jest_adminem": aktualny.jest_adminem
    }