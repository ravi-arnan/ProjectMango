import { useState, useCallback } from 'react'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../lib/storage'
import { generateId, generateTicketCode } from '../lib/utils'
import type { Booking } from '../types/booking'

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(() =>
    getStorageItem<Booking[]>(STORAGE_KEYS.BOOKINGS, [])
  )

  const persist = useCallback((updated: Booking[]) => {
    setBookings(updated)
    setStorageItem(STORAGE_KEYS.BOOKINGS, updated)
  }, [])

  const createBooking = useCallback((data: {
    destinationId: string
    destinationName: string
    date: string
    visitors: number
    totalPrice: number
  }): Booking => {
    const booking: Booking = {
      id: generateId(),
      ...data,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ticketCode: generateTicketCode(),
    }
    persist([booking, ...bookings])
    return booking
  }, [bookings, persist])

  const cancelBooking = useCallback((id: string) => {
    persist(bookings.map((b) => b.id === id ? { ...b, status: 'cancelled' as const } : b))
  }, [bookings, persist])

  const getUpcomingBookings = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.filter((b) => b.status === 'confirmed' && b.date >= today)
  }, [bookings])

  const getPastBookings = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.filter((b) => b.date < today || b.status === 'cancelled')
  }, [bookings])

  return { bookings, createBooking, cancelBooking, getUpcomingBookings, getPastBookings }
}
