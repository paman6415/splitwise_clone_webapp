export interface User {
  id: string
  name: string
}

export interface Group {
  id: string
  name: string
  users?: User[]
  total_expenses?: number
}

export interface GroupBalance {
  from_user: User
  to_user: User
  amount: number
}

export interface UserBalance {
  owes_to_user_id: number
  amount: number
  other_user_name: string
  direction: "user_is_owed" | "user_owes"
}

export interface Expense {
  id: string
  description: string
  amount: number
  paid_by: string
  split_type: "equal" | "percentage"
  splits: Record<string, number>
  created_at: string
}
