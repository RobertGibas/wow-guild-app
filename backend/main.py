from fastapi import FastAPI
from routers import roster, gildia, rajdy, kalendarz, blizzard, uczestnicy, auth, rekrutacja
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Autoryzacja"])
app.include_router(roster.router, prefix="/roster", tags=["Roster"])
app.include_router(gildia.router, prefix="/gildia", tags=["Gildia"])
app.include_router(rajdy.router, prefix="/rajdy", tags=["Rajdy"])
app.include_router(kalendarz.router, prefix="/kalendarz", tags=["Kalendarz"])
app.include_router(blizzard.router, prefix="/blizzard", tags=["Blizzard API"])
app.include_router(uczestnicy.router, prefix="/uczestnicy", tags=["Uczestnicy Rajdów"])
app.include_router(rekrutacja.router, prefix="/rekrutacja", tags=["Rekrutacja"])

@app.get("/")
async def root():
    return {"message": "Witaj w gildii!"}