from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.group import GroupCreate, GroupDetailResponse
from app.crud import group as group_crud
from typing import List

router = APIRouter()

@router.post("/", response_model=GroupDetailResponse)
def create_group(group: GroupCreate, db: Session = Depends(get_db)):
    db_group = group_crud.create_group(db, group)
    users = group_crud.get_group_users(db, db_group.id)
    total = group_crud.get_total_expenses_in_group(db, db_group.id)

    return {
        "id": db_group.id,
        "name": db_group.name,
        "users": users,
        "total_expenses": total
    }

@router.get("/", response_model=List[GroupDetailResponse])
def get_all_groups(db: Session = Depends(get_db)):
    groups = group_crud.get_all_groups(db)

    result = []
    for group in groups:
        users = group_crud.get_group_users(db, group.id)
        total = group_crud.get_total_expenses_in_group(db, group.id)
        result.append({
            "id": group.id,
            "name": group.name,
            "users": users,
            "total_expenses": total
        })

    return result

@router.get("/{group_id}", response_model=GroupDetailResponse)
def get_group_details(group_id: int, db: Session = Depends(get_db)):
    group = group_crud.get_group(db, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    users = group_crud.get_group_users(db, group_id)
    total = group_crud.get_total_expenses_in_group(db, group_id)

    return {
        "id": group.id,
        "name": group.name,
        "users": users,
        "total_expenses": total
    }
