from collections import defaultdict
from sqlalchemy.orm import Session
from app.models.expense import Expense
from app.models.split import ExpenseSplit
from app.models.user import User
from app.schemas.user import UserResponse

def get_group_balances(db: Session, group_id: int):
    expenses = db.query(Expense).filter(Expense.group_id == group_id).all()
    balances = defaultdict(lambda: defaultdict(float))  # balances[from][to] = amount

    for expense in expenses:
        splits = db.query(ExpenseSplit).filter(ExpenseSplit.expense_id == expense.id).all()
        for split in splits:
            if split.user_id != expense.paid_by:
                balances[split.user_id][expense.paid_by] += float(split.amount)

    # Netting out mutual debts
    net_balances = []
    processed_pairs = set()

    for from_user in list(balances):
        for to_user in list(balances[from_user]):
            if (to_user, from_user) in processed_pairs:
                continue
            amt1 = balances[from_user][to_user]
            amt2 = balances[to_user][from_user] if to_user in balances and from_user in balances[to_user] else 0.0
            net_amount = round(amt1 - amt2, 2)

            if net_amount > 0:
                from_user_obj = db.query(User).filter(User.id == from_user).first()
                to_user_obj = db.query(User).filter(User.id == to_user).first()
                net_balances.append({
                    "from_user": {"id": from_user_obj.id, "name": from_user_obj.name},
                    "to_user": {"id": to_user_obj.id, "name": to_user_obj.name},
                    "amount": net_amount
                })
            elif net_amount < 0:
                from_user_obj = db.query(User).filter(User.id == to_user).first()
                to_user_obj = db.query(User).filter(User.id == from_user).first()
                net_balances.append({
                    "from_user": {"id": from_user_obj.id, "name": from_user_obj.name},
                    "to_user": {"id": to_user_obj.id, "name": to_user_obj.name},
                    "amount": abs(net_amount)
                })

            processed_pairs.add((from_user, to_user))

    return {
        "group_id": group_id,
        "balances": net_balances
    }


def get_user_balances(db: Session, user_id: int):
    balances = defaultdict(float)  # balances[other_user_id] = net amount

    expenses = db.query(Expense).all()

    for expense in expenses:
        splits = db.query(ExpenseSplit).filter(ExpenseSplit.expense_id == expense.id).all()
        payer_id = expense.paid_by

        for split in splits:
            if split.user_id == payer_id:
                continue

            if user_id == payer_id and split.user_id != user_id:
                balances[split.user_id] += float(split.amount)

            elif split.user_id == user_id and payer_id != user_id:
                balances[payer_id] -= float(split.amount)

    result = []
    for other_user_id, amount in balances.items():
        other_user = db.query(User).filter(User.id == other_user_id).first()
        other_user_name = other_user.name if other_user else "Unknown"

        if amount > 0:
            result.append({
                "owes_to_user_id": other_user_id,
                "other_user_name": other_user_name,
                "amount": round(amount, 2),
                "direction": "user_is_owed"
            })
        elif amount < 0:
            result.append({
                "owes_to_user_id": other_user_id,
                "other_user_name": other_user_name,
                "amount": round(-amount, 2),
                "direction": "user_owes"
            })

    return result
