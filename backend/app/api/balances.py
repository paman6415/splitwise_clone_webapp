from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.balance import GroupBalanceResponse, UserBalanceResponse
from app.crud import balance as balance_crud

router = APIRouter()

@router.get("/groups/{group_id}/balances", response_model=GroupBalanceResponse)
def get_group_balances_route(group_id: int, db: Session = Depends(get_db)):
    return balance_crud.get_group_balances(db, group_id)



@router.get("/users/{user_id}/balances", response_model=UserBalanceResponse)
def get_user_balances(user_id: int, db: Session = Depends(get_db)):
    balances = balance_crud.get_user_balances(db, user_id)
    return {
        "user_id": user_id,
        "balances": balances
    }
