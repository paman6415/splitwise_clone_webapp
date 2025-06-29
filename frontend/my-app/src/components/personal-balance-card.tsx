"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, TrendingDown } from "lucide-react"
import { getUserBalances } from "@/lib/api"
import type { UserBalance } from "@/types"

export function PersonalBalanceCard() {
  const [userId, setUserId] = useState("")
  const [balances, setBalances] = useState<UserBalance[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!userId.trim()) return

    setLoading(true)
    try {
      const data = await getUserBalances(userId)
      console.log("Raw API response:", data)

      // setBalances(data)
      setBalances(Array.isArray(data.balances) ? data.balances : [])
      setSearched(true)
    } catch (error) {
      console.error("Failed to fetch user balances:", error)
      setBalances([])
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

const totalOwed = balances
  .filter(balance => balance.direction === "user_is_owed")
  .reduce((sum, balance) => sum + balance.amount, 0)

const totalOwing = balances
  .filter(balance => balance.direction === "user_owes")
  .reduce((sum, balance) => sum + balance.amount, 0)


  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Personal Balance Summary</CardTitle>
        <CardDescription>Enter your user ID to see your balance across all groups</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <Label htmlFor="userId" className="sr-only">
              User ID
            </Label>
            <Input
              id="userId"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading || !userId.trim()}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {searched && (
          <div className="space-y-4">
            {balances.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No balances found for this user.</p>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">You are owed</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">${totalOwed.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-red-800">You owe</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">${totalOwing.toFixed(2)}</span>
                  </div>
                </div>

                {/* Detailed Balances */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Detailed Balances</h4>
                  {balances.map((balance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">User {balance.other_user_name}</span>
                        <p className="text-sm text-gray-600">
                          {balance.direction === "user_is_owed"
                            ? `User ${balance.other_user_name} owes you`
                            : `You owe User ${balance.other_user_name}`}
                        </p>
                      </div>
                      <Badge
                        variant={balance.direction === "user_is_owed" ? "default" : "destructive"}
                        className={balance.direction === "user_is_owed" ? "bg-green-100 text-green-800" : ""}
                      >
                        ${balance.amount.toFixed(2)}
                      </Badge>
                    </div>
                  ))}

                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
