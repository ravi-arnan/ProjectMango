export interface Booking {
  id: string
  destinationId: string
  destinationName: string
  date: string
  visitors: number
  totalPrice: number
  status: 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  ticketCode: string
}
