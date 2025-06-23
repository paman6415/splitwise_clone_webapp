from pydantic import BaseModel
from typing import Optional

class ExpenseSplitResponse(BaseModel):
    user_id: int
    amount: float
    percentage: Optional[float] = None

    class Config:
        orm_mode = True
