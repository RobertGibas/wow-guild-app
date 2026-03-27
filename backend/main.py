from fastapi import FastAPI
from routers import roster, gildia, rajdy, kalendarz
from database import engine, Base

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(roster.router, prefix="/roster", tags=["Roster"])
app.include_router(gildia.router, prefix="/gildia", tags=["Gildia"])
app.include_router(rajdy.router, prefix="/rajdy", tags=["Rajdy"])
app.include_router(kalendarz.router, prefix="/kalendarz", tags=["Kalendarz"])

@app.get("/")
async def root():
    return {"message": "Witaj w gildii!"}