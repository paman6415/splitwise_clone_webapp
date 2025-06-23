from pydantic import BaseModel
from typing import List
from app.schemas.user import UserResponse

class UserBalance(BaseModel):
    owes_to_user_id: int
    amount: float


class GroupBalanceEntry(BaseModel):
    from_user: UserResponse
    to_user: UserResponse
    amount: float

class UserBalanceResponse(BaseModel):
    user_id: int
    balances: List[UserBalance]

class BalanceWithUsers(BaseModel):
    from_user: UserResponse
    to_user: UserResponse
    amount: float

class GroupBalanceResponse(BaseModel):
    group_id: int
    balances: List[BalanceWithUsers]
