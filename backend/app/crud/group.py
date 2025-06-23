from sqlalchemy.orm import Session
from app.models.group import Group
from app.models.group_member import GroupMember
from app.models.user import User
from app.models.expense import Expense
from app.schemas.group import GroupCreate

def create_group(db: Session, group: GroupCreate) -> Group:
    db_group = Group(name=group.name)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)

    for user_id in group.user_ids:
        db.add(GroupMember(group_id=db_group.id, user_id=user_id))
    db.commit()

    return db_group

def get_group(db: Session, group_id: int):
    return db.query(Group).filter(Group.id == group_id).first()

def get_group_users(db: Session, group_id: int):
    return db.query(User).join(GroupMember).filter(GroupMember.group_id == group_id).all()

def get_total_expenses_in_group(db: Session, group_id: int) -> float:
    total = db.query(Expense).filter(Expense.group_id == group_id).all()
    return sum([float(e.amount) for e in total])

def get_all_groups(db: Session):
    return db.query(Group).all()
