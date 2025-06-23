from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from app.crud import expense as expense_crud
from app.api.deps import get_db

router = APIRouter()

@router.post("/groups/{group_id}", response_model=ExpenseResponse)
def create_expense(group_id: int, expense: ExpenseCreate, db: Session = Depends(get_db)):
    return expense_crud.create_expense(db, group_id, expense)
