from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from pathlib import Path
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from fastapi.security import OAuth2PasswordBearer
from models import Uzytkownik

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
env_path = Path(__file__).parent.parent /".env"
load_dotenv(dotenv_path=env_path)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
TOKEN_WAZNY_GODZIN = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def zaszyfruj_haslo(haslo: str) -> str:
    return pwd_context.hash(haslo[:72])

def sprawdz_haslo(haslo: str, hash: str) -> bool:
    return pwd_context.verify(haslo[:72], hash)

def stworz_token(dane: dict) -> str:
    payload = dane.copy()
    wygasa = datetime.utcnow() + timedelta(hours=TOKEN_WAZNY_GODZIN)
    payload.update({"exp": wygasa})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def sprawdz_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
    
def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    payload = sprawdz_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="nieprawidlowy token lub token wygasl",
            headers={"WWW-Authenticate": "Bearer"},
        )
    uzytkownik = db.query(Uzytkownik).filter(Uzytkownik.id == payload.get("id")).first()
    if not uzytkownik:
        raise HTTPException(status_code=404,detail="nie znaleziono uzytkownika")
    return uzytkownik

def get_admin_user(aktualny = Depends(get_current_user)):
    if not aktualny.jest_adminem:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="brak uprawnien - tylko oficerowie maja dostep"
        )
    return aktualny
    
