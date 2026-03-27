from sqlalchemy import Column, Integer, String
from database import Base

class Czlonek(Base):
    __tablename__ = "czlonkowie"

    id = Column(Integer, primary_key=True, index=True)
    imie = Column(String, unique=True, index=True)
    klasa = Column(String, nullable=False)
    poziom = Column(Integer, nullable=False)
    ranga = Column(String, default="Member")
    