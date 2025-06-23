from sqlalchemy import Column, Integer, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.db.base import Base

class ExpenseSplit(Base):
    __tablename__ = "expense_splits"

    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer, ForeignKey("expenses.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Numeric(10, 2), nullable=True)  # Always stored
    percentage = Column(Numeric(5, 2), nullable=True)  # Only used for percentage splits

    expense = relationship("Expense", back_populates="splits")
    user = relationship("User", back_populates="splits")
