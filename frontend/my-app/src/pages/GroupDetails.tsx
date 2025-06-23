"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Users, Receipt, DollarSign } from "lucide-react"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { BalancesList } from "@/components/balances-list"
import { getGroup, getGroupBalances } from "@/lib/api"
import type { Group, GroupBalance } from "@/types"

export default function GroupDetails() {
  const params = useParams()
  const navigate = useNavigate()
  const groupId = params.id as string

  const [group, setGroup] = useState<Group | null>(null)
  const [balances, setBalances] = useState<GroupBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)

  const fetchGroupData = async () => {
  try {
    const [groupData, balancesData] = await Promise.all([
      getGroup(groupId),
      getGroupBalances(groupId)
    ])
    setGroup(groupData)
    setBalances(balancesData.balances) // ✅ Extract array from the object
  } catch (error) {
    console.error("Failed to fetch group data:", error)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchGroupData()
  }, [groupId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Group not found</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/")} variant="outline">

              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Users className="h-4 w-4 mr-1" />
                {group.users?.length || 0} members
              </p>
            </div>
          </div>
          <Button onClick={() => setAddExpenseOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(group.total_expenses || 0).toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Balances</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balances.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Group Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{group.users?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Members List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Group Members</CardTitle>
            <CardDescription>All members in this group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {group.users?.map((user) => (
                <Badge key={user.id} variant="secondary" className="px-3 py-1">
                  {user.name}
                </Badge>
              )) || <p className="text-gray-600">No members found</p>}
            </div>
          </CardContent>
        </Card>

        {/* Balances */}
        <BalancesList balances={balances} />

        <AddExpenseDialog
          open={addExpenseOpen}
          onOpenChange={setAddExpenseOpen}
          groupId={groupId}
          groupUsers={group.users || []}
          onExpenseAdded={fetchGroupData}
        />
      </div>
    </div>
  )
}
