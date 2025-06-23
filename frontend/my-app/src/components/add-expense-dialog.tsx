"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { addExpense } from "@/lib/api"
import type { User } from "@/types"


interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string
  groupUsers: User[]
  onExpenseAdded: () => void
}

export function AddExpenseDialog({ open, onOpenChange, groupId, groupUsers, onExpenseAdded }: AddExpenseDialogProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [splitType, setSplitType] = useState<"equal" | "percentage">("equal")
  const [percentageSplits, setPercentageSplits] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handlePercentageChange = (user: string, percentage: string) => {
    setPercentageSplits((prev) => ({
      ...prev,
      [user]: percentage,
    }))
  }

  const getTotalPercentage = () => {
    return Object.values(percentageSplits).reduce((sum, val) => sum + (Number.parseFloat(val) || 0), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim() || !amount || !paidBy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (splitType === "percentage") {
      const totalPercentage = getTotalPercentage()
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast({
          title: "Error",
          description: "Percentages must add up to 100%.",
          variant: "destructive",
        })
        return
      }
    }

    setLoading(true)
    try {
      const expenseData = {
        description: description.trim(),
        amount: Number.parseFloat(amount),
        paid_by: paidBy,
        split_type: splitType,
        splits:
          splitType === "equal"
            ? groupUsers.reduce((acc, user) => ({ ...acc, [user.id]: 100 / groupUsers.length }), {})
            : Object.fromEntries(
                Object.entries(percentageSplits).map(([user, percentage]) => [
                  user,
                  Number.parseFloat(percentage) || 0,
                ]),
              ),
      }

      await addExpense(groupId, expenseData)

      toast({
        title: "Success",
        description: "Expense added successfully!",
      })

      // Reset form
      setDescription("")
      setAmount("")
      setPaidBy("")
      setSplitType("equal")
      setPercentageSplits({})
      onExpenseAdded()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>Add a new expense to split among group members.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Dinner at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy} required>
              <SelectTrigger>
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {groupUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Split Type</Label>
            <RadioGroup value={splitType} onValueChange={(value: "equal" | "percentage") => setSplitType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal">Split Equally</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Split by Percentage</Label>
              </div>
            </RadioGroup>
          </div>

          {splitType === "equal" && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                The expense will be split equally among all {groupUsers.length} members (
                {(100 / groupUsers.length).toFixed(1)}% each).
              </p>
            </div>
          )}

          {splitType === "percentage" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Percentage Split</Label>
                <Badge variant={getTotalPercentage() === 100 ? "default" : "destructive"}>
                  Total: {getTotalPercentage().toFixed(1)}%
                </Badge>
              </div>
              <div className="space-y-2">
                {groupUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <Label className="w-20 text-sm">{user.id}</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={percentageSplits[user.id] || ""}
                      onChange={(e) => handlePercentageChange(user.id, e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-4">%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? "Adding..." : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
