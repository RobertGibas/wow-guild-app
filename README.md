# WoW Guild Manager

A full-stack web application for managing a World of Warcraft guild. Built to solve real coordination problems — member roster, raid logging, event calendar, and recruitment management.

---

## Tech Stack

**Backend**
- Python, FastAPI, SQLAlchemy, Alembic
- PostgreSQL
- JWT authentication, OAuth2, bcrypt
- Blizzard Battle.net API integration

**Frontend**
- React (Vite), JavaScript
- React Router, Axios

**Other**
- Git / GitHub (Git Flow)
- python-jose, passlib, httpx

---

## Features

- **Roster management** — add, remove, and search guild members with class and rank filtering
- **Raid logs** — track raid history with success/failure status and notes
- **Event calendar** — schedule guild events with mandatory/optional flags
- **Recruitment system** — application workflow with officer review, accept/reject and comments
- **Authentication** — JWT-based login, role-based access control (admin vs member)
- **Blizzard API** — OAuth2 integration for fetching character and guild data
- **Dashboard** — guild statistics, recent raids, upcoming events, class composition

---

## Project Structure

```
wow-guild-app/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── roster.py
│   │   ├── rajdy.py
│   │   ├── kalendarz.py
│   │   ├── rekrutacja.py
│   │   ├── uczestnicy.py
│   │   ├── gildia.py
│   │   └── blizzard.py
│   └── services/
│       └── blizzard.py
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── Roster.jsx
        │   ├── Rajdy.jsx
        └── └── Kalendarz.jsx
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux

pip install -r requirements.txt

copy .env.example .env       # Windows
cp .env.example .env         # macOS / Linux
```

Edit `.env` and fill in your values:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/wow_guild_db
SECRET_KEY=your_random_secret_key_min_32_chars
BLIZZARD_CLIENT_ID=your_client_id
BLIZZARD_CLIENT_SECRET=your_client_secret
BLIZZARD_REGION=eu
```

Start the server:

```bash
uvicorn main:app --reload
```

API available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`

### Database Setup

Create a PostgreSQL database named `wow_guild_db`. SQLAlchemy will create all tables automatically on first server start.

To set the first admin user, run this script after registering through the API:

```bash
python -c "
from database import SessionLocal
from models import Uzytkownik
db = SessionLocal()
user = db.query(Uzytkownik).first()
user.jest_adminem = True
db.commit()
print('Admin set:', user.email)
db.close()
"
```

---

## API Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/rejestracja` | Register new user | Public |
| POST | `/auth/login` | Login, returns JWT token | Public |
| GET | `/roster` | Get all guild members | Required |
| POST | `/roster` | Add guild member | Admin |
| DELETE | `/roster/{id}` | Remove guild member | Admin |
| GET | `/rajdy` | Get all raids | Required |
| POST | `/rajdy` | Add raid log | Required |
| GET | `/kalendarz` | Get all events | Required |
| POST | `/kalendarz` | Add event | Required |
| POST | `/rekrutacja` | Submit application | Public |
| GET | `/rekrutacja` | List applications | Admin |
| PUT | `/rekrutacja/{id}/akceptuj` | Accept application | Admin |
| PUT | `/rekrutacja/{id}/odrzuc` | Reject application | Admin |
| GET | `/blizzard/roster/{realm}/{guild}` | Fetch guild from Blizzard API | Required |

---

## Blizzard API

Register your application at [develop.battle.net](https://develop.battle.net/) to obtain credentials.

Set `USE_MOCK = False` in `services/blizzard.py` to switch from mock data to live Blizzard API calls.

---

## License

This project is for personal and educational use.