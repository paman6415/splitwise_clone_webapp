from sqlalchemy.orm import Session
from app.models.expense import Expense
from app.models.split import ExpenseSplit
from app.schemas.expense import ExpenseCreate

def create_expense(db: Session, group_id: int, data: ExpenseCreate) -> Expense:
    expense = Expense(
        group_id=group_id,
        description=data.description,
        amount=data.amount,
        paid_by=data.paid_by,
        split_type=data.split_type
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)

    total = data.amount
    members = data.splits  # This is a dict: {user_id: percentage_or_placeholder}

    if data.split_type == "equal":
        share = round(total / len(members), 2)
        for user_id in members:
            db.add(ExpenseSplit(
                expense_id=expense.id,
                user_id=int(user_id),
                amount=share,
                percentage=None
            ))

    elif data.split_type == "percentage":
        for user_id, percentage in members.items():
            amount = round((percentage / 100) * total, 2)
            db.add(ExpenseSplit(
                expense_id=expense.id,
                user_id=int(user_id),
                amount=amount,
                percentage=percentage
            ))

    db.commit()
    return expense
