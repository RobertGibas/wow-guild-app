from fastapi import FastAPI
from routers import roster

app = FastAPI()

app.include_router(roster.router, prefix="/roster", tags=["Roster"])

@app.get("/")
async def root():
    return {"message": "Witaj w gildii!"}