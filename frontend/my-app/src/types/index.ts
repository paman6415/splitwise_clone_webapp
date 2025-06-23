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
  group_name: string
  other_user: string
  amount: number
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
