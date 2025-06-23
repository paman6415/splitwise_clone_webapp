import os
import sys
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User

# Ensure app package is accessible when running directly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

FAKE_USERS = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve"
]

def create_fake_users():
    db: Session = SessionLocal()
    try:
        for name in FAKE_USERS:
            existing = db.query(User).filter(User.name == name).first()
            if not existing:
                user = User(name=name)
                db.add(user)
        db.commit()
        print(f"✅ Created {len(FAKE_USERS)} fake users.")
    finally:
        db.close()

if __name__ == "__main__":
    create_fake_users()
