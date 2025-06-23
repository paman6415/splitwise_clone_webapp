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
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createGroup } from "@/lib/api"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGroupCreated: () => void
}

export function CreateGroupDialog({ open, onOpenChange, onGroupCreated }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("")
  const [userInput, setUserInput] = useState("")
  const [users, setUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addUser = () => {
    if (userInput.trim() && !users.includes(userInput.trim())) {
      setUsers([...users, userInput.trim()])
      setUserInput("")
    }
  }

  const removeUser = (userToRemove: string) => {
    setUsers(users.filter((user) => user !== userToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim() || users.length === 0) {
      toast({
        title: "Error",
        description: "Please provide a group name and at least one user.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await createGroup({
        name: groupName,
        user_ids: users,
      })

      toast({
        title: "Success",
        description: "Group created successfully!",
      })

      // Reset form
      setGroupName("")
      setUsers([])
      setUserInput("")
      onGroupCreated()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addUser()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>Create a group to start tracking shared expenses with your friends.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              placeholder="e.g., Weekend Trip, Roommates, etc."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userInput">Add Users</Label>
            <div className="flex gap-2">
              <Input
                id="userInput"
                placeholder="Enter user ID or name"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" onClick={addUser} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {users.length > 0 && (
            <div className="space-y-2">
              <Label>Group Members ({users.length})</Label>
              <div className="flex flex-wrap gap-2">
                {users.map((user) => (
                  <Badge key={user} variant="secondary" className="flex items-center gap-1">
                    {user}
                    <button
                      type="button"
                      onClick={() => removeUser(user)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
