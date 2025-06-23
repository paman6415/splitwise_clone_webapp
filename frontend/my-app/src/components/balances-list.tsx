import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users } from "lucide-react"
import type { GroupBalance } from "@/types"
import { useEffect } from "react"

interface BalancesListProps {
  balances: GroupBalance[] | null | undefined
}

export function BalancesList({ balances }: BalancesListProps) {
  useEffect(()=>{
    console.log("test balamc",typeof balances);
  },[]);
  if (!Array.isArray(balances) || balances.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All settled up!</h3>
          <p className="text-gray-600">No outstanding balances in this group.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Balances</CardTitle>
        <CardDescription>Who owes whom in this group</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {balances.map((balance, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {balance.amount > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <p className="font-medium">
                    {balance.amount > 0
                      ? `${balance.from_user.name} owes ${balance.to_user.name}`
                      : `${balance.from_user.name} owes ${balance.to_user.name}`}
                  </p>
                  <p className="text-sm text-gray-600">{balance.amount > 0 ? "You are owed" : "You owe"}</p>
                </div>
              </div>
              <Badge
                variant={balance.amount > 0 ? "default" : "destructive"}
                className={`text-lg px-3 py-1 ${balance.amount > 0 ? "bg-green-100 text-green-800" : ""}`}
              >
                ${Math.abs(balance.amount).toFixed(2)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
