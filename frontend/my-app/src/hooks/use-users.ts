"use client"

import { useState } from "react"

export function useUsers() {
  const [users, setUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Since there's no users endpoint mentioned in the requirements,
      // we'll simulate this or you can implement it based on your backend
      // For now, we'll use a mock list or extract from groups
      setUsers(["user1", "user2", "user3", "user4"]) // Mock data
    } catch (error) {
      console.error("Failed to fetch users:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  return {
    users,
    loading,
    fetchUsers,
  }
}
