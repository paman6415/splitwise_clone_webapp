from fastapi import FastAPI
from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models import user, group, expense, split
from app.models.user import User
from fastapi.middleware.cors import CORSMiddleware

from app.api import users, groups, expenses, balances


app = FastAPI(
    title="Splitwise Clone API",
    description="Backend assignment for Neurix Full-Stack SDE Intern. Tracks groups, expenses, and balances.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables
Base.metadata.create_all(bind=engine)

# ✅ Seed fake users on startup
@app.on_event("startup")
def seed_fake_users():
    db: Session = SessionLocal()
    fake_users = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
    for name in fake_users:
        if not db.query(User).filter(User.name == name).first():
            db.add(User(name=name))
    db.commit()
    db.close()
    print("✅ Seeded fake users.")

# Include routers
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(groups.router, prefix="/groups", tags=["Groups"])
app.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
app.include_router(balances.router, tags=["Balances"])
