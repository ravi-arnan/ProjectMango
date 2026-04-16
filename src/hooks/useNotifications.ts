import { useState, useCallback, useEffect, useRef } from 'react'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../lib/storage'
import { generateId } from '../lib/utils'
import { destinations } from '../data/destinations'
import type { AppNotification, NotificationPrefs } from '../types/notification'

const DEFAULT_PREFS: NotificationPrefs = {
  crowdAlerts: true,
  bookingReminders: true,
  recommendations: true,
}

function generateInitialNotifications(): AppNotification[] {
  const quiet = destinations.filter((d) => d.density < 0.3)
  const busy = destinations.filter((d) => d.density > 0.8)
  const now = new Date()

  const notifs: AppNotification[] = []

  if (quiet.length > 0) {
    const dest = quiet[0]
    notifs.push({
      id: generateId(),
      type: 'crowd_alert',
      title: `${dest.name} sedang sepi!`,
      message: `Hanya ${Math.round(dest.density * 100)}% kapasitas terisi. Waktu ideal untuk berkunjung.`,
      destinationId: dest.id,
      read: false,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    })
  }

  if (busy.length > 0) {
    const dest = busy[0]
    notifs.push({
      id: generateId(),
      type: 'crowd_alert',
      title: `${dest.name} sangat ramai`,
      message: `${Math.round(dest.density * 100)}% kapasitas terisi. Pertimbangkan waktu kunjungan lain.`,
      destinationId: dest.id,
      read: false,
      createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
    })
  }

  notifs.push({
    id: generateId(),
    type: 'recommendation',
    title: 'Rekomendasi hari ini',
    message: 'Pantai Pandawa dan Bedugul sedang sepi. Sempurna untuk kunjungan yang tenang!',
    read: false,
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
  })

  return notifs
}

function loadNotifications(): AppNotification[] {
  const stored = getStorageItem<AppNotification[] | null>(STORAGE_KEYS.NOTIFICATIONS, null)
  if (stored === null) {
    const initial = generateInitialNotifications()
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, initial)
    return initial
  }
  return stored
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifications)
  const [prefs, setPrefs] = useState<NotificationPrefs>(() =>
    getStorageItem<NotificationPrefs>(STORAGE_KEYS.NOTIFICATION_PREFS, DEFAULT_PREFS)
  )
  const notifsRef = useRef(notifications)
  notifsRef.current = notifications

  const persistNotifications = useCallback((updated: AppNotification[]) => {
    setNotifications(updated)
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, updated)
  }, [])

  const markAsRead = useCallback((id: string) => {
    const updated = notifsRef.current.map((n) => n.id === id ? { ...n, read: true } : n)
    persistNotifications(updated)
  }, [persistNotifications])

  const markAllAsRead = useCallback(() => {
    const updated = notifsRef.current.map((n) => ({ ...n, read: true }))
    persistNotifications(updated)
  }, [persistNotifications])

  const clearAll = useCallback(() => {
    persistNotifications([])
  }, [persistNotifications])

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
    }
    const updated = [newNotif, ...notifsRef.current]
    persistNotifications(updated)
  }, [persistNotifications])

  const updatePrefs = useCallback((update: Partial<NotificationPrefs>) => {
    setPrefs((prev) => {
      const updated = { ...prev, ...update }
      setStorageItem(STORAGE_KEYS.NOTIFICATION_PREFS, updated)
      return updated
    })
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const interval = setInterval(() => {
      if (!prefs.crowdAlerts) return
      const dest = destinations[Math.floor(Math.random() * destinations.length)]
      if (dest.density < 0.3 && Math.random() > 0.7) {
        addNotification({
          type: 'crowd_alert',
          title: `${dest.name} mulai sepi`,
          message: `Kepadatan turun ke ${Math.round(dest.density * 100)}%. Waktu yang baik untuk berkunjung!`,
          destinationId: dest.id,
        })
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [prefs.crowdAlerts, addNotification])

  return {
    notifications,
    prefs,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    addNotification,
    updatePrefs,
  }
}
