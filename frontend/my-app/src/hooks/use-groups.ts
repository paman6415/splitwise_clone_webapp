"use client"

import { useState } from "react"
import { getGroups } from "@/lib/api"
import type { Group } from "@/types"

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGroups = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getGroups()
      setGroups(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch groups")
      setGroups([])
    } finally {
      setLoading(false)
    }
  }

  return {
    groups,
    loading,
    error,
    fetchGroups,
  }
}
