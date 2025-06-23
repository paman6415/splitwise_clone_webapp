from pydantic import BaseModel
from typing import List
from app.schemas.user import UserResponse

class GroupCreate(BaseModel):
    name: str
    user_ids: List[int]

class GroupUserResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class GroupDetailResponse(BaseModel):
    id: int
    name: str
    users: List[GroupUserResponse]
    total_expenses: float

    class Config:
        orm_mode = True

class GroupResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
