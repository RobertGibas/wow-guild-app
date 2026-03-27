from fastapi import FastAPI
from routers import roster, gildia
from database import engine, Base

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(roster.router, prefix="/roster", tags=["Roster"])
app.include_router(gildia.router, prefix="/gildia", tags=["Gildia"])

@app.get("/")
async def root():
    return {"message": "Witaj w gildii!"}