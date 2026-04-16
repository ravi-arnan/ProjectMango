import { useState, useCallback } from 'react'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../lib/storage'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(() =>
    getStorageItem<string[]>(STORAGE_KEYS.WATCHLIST, [])
  )

  const persist = useCallback((updated: string[]) => {
    setWatchlist(updated)
    setStorageItem(STORAGE_KEYS.WATCHLIST, updated)
  }, [])

  const addToWatchlist = useCallback((id: string) => {
    persist([...new Set([...watchlist, id])])
  }, [watchlist, persist])

  const removeFromWatchlist = useCallback((id: string) => {
    persist(watchlist.filter((item) => item !== id))
  }, [watchlist, persist])

  const toggleWatchlist = useCallback((id: string) => {
    if (watchlist.includes(id)) {
      removeFromWatchlist(id)
    } else {
      addToWatchlist(id)
    }
  }, [watchlist, addToWatchlist, removeFromWatchlist])

  const isWatchlisted = useCallback((id: string) => {
    return watchlist.includes(id)
  }, [watchlist])

  return { watchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist, isWatchlisted }
}
