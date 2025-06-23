from pydantic import BaseModel
from typing import  Dict, Optional

class ExpenseSplitInput(BaseModel):
    user_id: int
    percentage: Optional[float] = None  # only for percentage split

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    paid_by: int
    split_type: str  # "equal" or "percentage"
    splits: Dict[int, float]

class ExpenseResponse(BaseModel):
    id: int
    description: str
    amount: float
    paid_by: int
    split_type: str

    class Config:
        orm_mode = True
