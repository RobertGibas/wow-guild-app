from sqlalchemy import Boolean, Column, Integer, String, DateTime
from database import Base
from datetime import datetime

class Czlonek(Base):
    __tablename__ = "czlonkowie"

    id = Column(Integer, primary_key=True, index=True)
    imie = Column(String, unique=True, index=True)
    klasa = Column(String, nullable=False)
    poziom = Column(Integer, nullable=False)
    ranga = Column(String, default="Member")

class Rajd(Base):
    __tablename__ = "rajdy"

    id = Column(Integer, primary_key=True, index=True)
    nazwa = Column(String, nullable=False)
    data = Column(DateTime, default=datetime.utcnow)
    udany = Column(Boolean, default=False)
    notatki = Column(String, default="Nie ma zadnych notatek")
    obowiazkowe = Column(String, default=False)

class Wydarzenie(Base):
    __tablename__ = "wydarzenia"

    id = Column(Integer, primary_key=True, index=True)
    tytul = Column(String, nullable=False)
    data = Column(DateTime, default=datetime.utcnow)
    opis = Column(String, default="brak opisu")
    obowiazkowe = Column(Boolean, default=False)