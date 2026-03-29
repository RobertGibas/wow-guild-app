from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os


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