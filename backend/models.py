from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Czlonek(Base):
    __tablename__ = "czlonkowie"

    id = Column(Integer, primary_key=True, index=True)
    imie = Column(String, nullable=False)
    klasa = Column(String, nullable=False)
    poziom = Column(Integer, default=90)
    ranga = Column(String, default="Member")

    uczestnictwa = relationship("UczestnikRajdu", back_populates="czlonek")

class Rajd(Base):
    __tablename__ = "rajdy"

    id = Column(Integer, primary_key=True, index=True)
    nazwa = Column(String, nullable=False)
    data = Column(DateTime, default=datetime.utcnow)
    udany = Column(Boolean, default=False)
    notatki = Column(String, default="Nie ma zadnych notatek")
    obowiazkowe = Column(String, default=False)

    uczestnicy = relationship("UczestnikRajdu", back_populates="rajd")

class Wydarzenie(Base):
    __tablename__ = "wydarzenia"

    id = Column(Integer, primary_key=True, index=True)
    tytul = Column(String, nullable=False)
    data = Column(DateTime, default=datetime.utcnow)
    opis = Column(String, default="brak opisu")
    obowiazkowe = Column(Boolean, default=False)

class UczestnikRajdu(Base):
    __tablename__ = "uczestnicy_rajdow"

    id = Column(Integer, primary_key=True, index=True)
    czlonek_id = Column(Integer, ForeignKey("czlonkowie.id"), nullable=False)
    rajd_id = Column(Integer, ForeignKey("rajdy.id"), nullable=False)
    rola = Column(String, default="DPS")
    obecny = Column(Boolean, default=True)

    czlonek = relationship("Czlonek", back_populates="uczestnictwa")
    rajd = relationship("Rajd", back_populates="uczestnicy")

class Uzytkownik(Base):
    __tablename__ = "uzytkownicy"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    nazwa = Column(String, nullable=False)
    haslo_hash = Column(String, nullable=False)
    jest_adminem = Column(Boolean, default=False)
    aktywny = Column(Boolean, default=True)

class Podanie(Base):
    __tablename__ = "podania"

    id = Column(Integer, primary_key=True, index=True)
    imie_postaci = Column(String, nullable=False)
    klasa_postaci = Column(String, nullable=False)
    poziom = Column(Integer, nullable=False)
    doswiadczenie = Column(String, default="")
    dlaczego_aplikuje = Column(String, default="")
    kontakt_discord = Column(String, default="")
    status = Column(String, default="oczekujace")
    data_zlozenia = Column(DateTime, default=datetime.utcnow)
    komentarz_oficera = Column(String, default="") 