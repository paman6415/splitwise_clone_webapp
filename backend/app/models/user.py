from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    expenses_paid = relationship("Expense", back_populates="payer")
    splits = relationship("ExpenseSplit", back_populates="user")
    groups = relationship("GroupMember", back_populates="user")
