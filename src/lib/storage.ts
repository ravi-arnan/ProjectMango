export const STORAGE_KEYS = {
  WATCHLIST: 'mango_watchlist',
  BOOKINGS: 'mango_bookings',
  NOTIFICATIONS: 'mango_notifications',
  NOTIFICATION_PREFS: 'mango_notification_prefs',
  FIRED_REMINDERS: 'mango_fired_reminders',
  LAST_MOOD: 'mango_last_mood',
  REVIEWS: 'mango_reviews',
  SETTINGS: 'mango_settings',
  AVATAR: 'mango_avatar',
} as const

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage full or unavailable
  }
}
