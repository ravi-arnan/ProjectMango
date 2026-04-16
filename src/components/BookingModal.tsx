import { useState } from 'react'
import Icon from './Icon'
import { useBookings } from '../hooks/useBookings'
import { parseTicketPrice, formatCurrency, formatDate } from '../lib/utils'
import type { Destination } from '../data/destinations'
import type { Booking } from '../types/booking'

interface Props {
  destination: Destination
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ destination, isOpen, onClose }: Props) {
  const [date, setDate] = useState('')
  const [visitors, setVisitors] = useState(1)
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)
  const { createBooking } = useBookings()

  if (!isOpen) return null

  const unitPrice = parseTicketPrice(destination.ticketPrice)
  const totalPrice = unitPrice * visitors
  const today = new Date().toISOString().split('T')[0]

  function handleConfirm() {
    if (!date) return
    const booking = createBooking({
      destinationId: destination.id,
      destinationName: destination.name,
      date,
      visitors,
      totalPrice,
    })
    setConfirmedBooking(booking)
  }

  function handleClose() {
    setConfirmedBooking(null)
    setDate('')
    setVisitors(1)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-[390px] lg:max-w-md bg-surface-container-lowest rounded-t-3xl lg:rounded-3xl p-6 max-h-[85vh] overflow-y-auto no-scrollbar">
        {confirmedBooking ? (
          <ConfirmationView booking={confirmedBooking} onClose={handleClose} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-on-surface font-headline">Pesan Tiket</h2>
              <button onClick={handleClose} className="p-1.5 hover:bg-stone-100 rounded-full">
                <Icon name="close" size="20px" />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-surface-container-low rounded-xl p-3 mb-6">
              <img src={destination.image} alt={destination.name} className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-sm text-on-surface">{destination.name}</p>
                <p className="text-xs text-on-surface-variant">{destination.location}, {destination.region}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-on-surface mb-1.5 block">Tanggal Kunjungan</label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-on-surface mb-1.5 block">Jumlah Pengunjung</label>
                <div className="flex items-center gap-4 bg-surface-container-low rounded-xl px-4 py-2.5">
                  <button
                    onClick={() => setVisitors(Math.max(1, visitors - 1))}
                    className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center"
                  >
                    <Icon name="remove" size="18px" />
                  </button>
                  <span className="text-lg font-bold text-on-surface flex-1 text-center">{visitors}</span>
                  <button
                    onClick={() => setVisitors(Math.min(20, visitors + 1))}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                  >
                    <Icon name="add" size="18px" />
                  </button>
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-on-surface-variant">Harga tiket</span>
                  <span className="text-on-surface">{unitPrice === 0 ? 'Gratis' : formatCurrency(unitPrice)} x {visitors}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-primary/10 pt-2">
                  <span className="text-on-surface">Total</span>
                  <span className="text-primary">{totalPrice === 0 ? 'Gratis' : formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!date}
              className="w-full bg-primary text-on-primary rounded-xl py-3.5 font-bold text-sm mt-6 disabled:opacity-40 transition-opacity"
            >
              Konfirmasi Pemesanan
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ConfirmationView({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
        <Icon name="check_circle" size="36px" className="text-emerald-600" />
      </div>
      <h2 className="text-xl font-bold text-on-surface font-headline mb-1">Pemesanan Berhasil!</h2>
      <p className="text-sm text-on-surface-variant mb-6">Tiket Anda telah dikonfirmasi</p>

      <div className="w-full bg-surface-container-low rounded-2xl p-5 mb-4 text-left">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-on-surface-variant">Destinasi</p>
            <p className="font-bold text-on-surface">{booking.destinationName}</p>
          </div>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
            Confirmed
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-on-surface-variant">Tanggal</p>
            <p className="font-semibold text-on-surface">{formatDate(booking.date)}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Pengunjung</p>
            <p className="font-semibold text-on-surface">{booking.visitors} orang</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Total</p>
            <p className="font-semibold text-primary">
              {booking.totalPrice === 0 ? 'Gratis' : formatCurrency(booking.totalPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-stone-900 rounded-2xl p-5 mb-6 text-white">
        <p className="text-xs text-stone-400 mb-1">Kode Tiket</p>
        <p className="text-2xl font-mono font-bold tracking-wider">{booking.ticketCode}</p>
        <p className="text-[10px] text-stone-400 mt-2">Tunjukkan kode ini di pintu masuk</p>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-primary text-on-primary rounded-xl py-3.5 font-bold text-sm"
      >
        Selesai
      </button>
    </div>
  )
}
