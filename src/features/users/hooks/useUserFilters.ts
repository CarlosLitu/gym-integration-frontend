import { useEffect, useMemo, useState } from 'react'
import type { UserListItem } from '../types/user.types'

const PAGE_SIZE = 10

export function useUserFilters(users: UserListItem[], selectedTenantId: string | null) {
  const [search, setSearch] = useState('')
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [selectedTenantId])

  const tenantUsers = useMemo(() => {
    if (!selectedTenantId) return []
    return users.filter((user) => user.tenantId === selectedTenantId)
  }, [users, selectedTenantId])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    const matched = term
      ? tenantUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term),
        )
      : tenantUsers

    return [...matched].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    )
  }, [tenantUsers, search, sortAsc])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function toggleSort() {
    setSortAsc((current) => !current)
    setPage(1)
  }

  return {
    search,
    setSearch: handleSearch,
    sortAsc,
    toggleSort,
    page: currentPage,
    setPage,
    pageItems,
    total,
    totalPages,
    pageSize: PAGE_SIZE,
  }
}
