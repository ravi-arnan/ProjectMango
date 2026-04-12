import { useState } from 'react'
import Icon from '../components/Icon'
import { destinations, getDensityBgColor, getDensityTextColor } from '../data/destinations'

const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const chartBarHeights = [55, 40, 48, 60, 72, 92, 88] // percentage heights for 7-day chart
const hourlyBarHeights = [30, 45, 60, 80, 100, 90, 70, 55, 40, 35] // 10 bars for hourly
const hourlyLabels = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16']

const desktopHourlyData = [
  { time: '09:00', pct: 45 },
  { time: '12:00', pct: 78 },
  { time: '15:00', pct: 92 },
  { time: '18:00', pct: 65 },
  { time: '21:00', pct: 30 },
]

const faktorData = [
  {
    icon: 'calendar_today',
    title: 'Kalender Libur',
    desc: 'Long weekend 12-14 Apr',
    impact: 'Tinggi',
  },
  {
    icon: 'cloud',
    title: 'Prakiraan Cuaca',
    desc: 'Cerah berawan, 31\u00b0C',
    impact: 'Rendah',
  },
  {
    icon: 'music_note',
    title: 'Event Lokal',
    desc: 'Bali Spirit Festival',
    impact: 'Sedang',
  },
  {
    icon: 'bar_chart_4_bars',
    title: 'Tren Historis',
    desc: '+22% vs bulan lalu',
    impact: 'Sedang',
  },
]

function getDensityTag(density: number): { label: string; color: string } {
  if (density > 0.7) return { label: 'High', color: 'bg-error/15 text-error' }
  if (density > 0.4) return { label: 'Med', color: 'bg-tertiary/15 text-tertiary' }
  return { label: 'Low', color: 'bg-primary/15 text-primary' }
}

function getImpactBadge(impact: string) {
  if (impact === 'Tinggi') return 'bg-error/15 text-error'
  if (impact === 'Sedang') return 'bg-amber-500/15 text-amber-600'
  return 'bg-primary/15 text-primary'
}

export default function Prediksi() {
  const [selectedDestination, setSelectedDestination] = useState(destinations[0])
  const [chartMode, setChartMode] = useState<'probability' | 'visitors'>('probability')

  const tanahLot = destinations.find((d) => d.id === 'tanah-lot')!
  const ubudMonkey = destinations.find((d) => d.id === 'ubud-monkey-forest')!

  return (
    <div>
      {/* ===================== MOBILE VIEW ===================== */}
      <div className="lg:hidden flex flex-col gap-4 pb-28">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-on-surface">Prediksi Kerumunan</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container">
            <Icon name="info" size="20px" className="text-on-surface-variant" />
          </button>
        </div>

        {/* Watchlist Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="bookmark" size="20px" className="text-primary" filled />
            <h2 className="text-base font-bold text-on-surface">Watchlist Saya</h2>
          </div>
          <div className="flex flex-col gap-3">
            {/* Tanah Lot - 88% error */}
            <div className="bg-surface-container-low rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-error/15 flex items-center justify-center shrink-0">
                  <Icon name="temple_hindu" size="20px" className="text-error" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-on-surface truncate">{tanahLot.name}</p>
                    <span className="text-xs font-bold text-error">88%</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">Sangat Ramai</p>
                  <div className="mt-2 h-2 bg-error/15 rounded-full overflow-hidden">
                    <div className="h-full bg-error rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Ubud Monkey Forest - 24% green */}
            <div className="bg-surface-container-low rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon name="forest" size="20px" className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-on-surface truncate">{ubudMonkey.name}</p>
                    <span className="text-xs font-bold text-primary">24%</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">Sepi</p>
                  <div className="mt-2 h-2 bg-primary/15 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Destination Selector - Horizontal scroll chips */}
        <div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {destinations.map((dest) => {
              const tag = getDensityTag(dest.density)
              const isSelected = selectedDestination.id === dest.id
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest)}
                  className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span>{dest.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-white/25 text-on-primary' : tag.color
                    }`}
                  >
                    {tag.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Forecast Summary Card */}
        <div className="bg-gradient-to-br from-primary to-primary-container text-white rounded-[24px] p-6">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="location_on" size="16px" />
            <span className="text-sm font-medium opacity-90">{selectedDestination.location}</span>
          </div>
          <h3 className="text-lg font-bold">{selectedDestination.name}</h3>
          <p className="text-3xl font-extrabold mt-2">18.400</p>
          <p className="text-sm opacity-80 mt-0.5">puncak pengunjung</p>

          {/* 7-day dot indicators */}
          <div className="flex items-center gap-3 mt-5">
            {weekDays.map((day, i) => {
              const isWeekend = i >= 5
              return (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] opacity-70">{day}</span>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      isWeekend ? 'bg-error animate-pulse' : 'bg-white/50'
                    }`}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* 7-Day Chart */}
        <div className="bg-surface-container-low rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-on-surface">Prediksi 7 Hari</h3>
            <span className="text-[10px] text-on-surface-variant font-medium">12 Apr - 18 Apr</span>
          </div>
          <div className="relative h-[180px]">
            {/* Max capacity dashed line */}
            <div className="absolute top-[10%] left-0 right-0 border-t-2 border-dashed border-error/30 z-10">
              <span className="absolute -top-4 right-0 text-[9px] text-error font-medium">
                Max Capacity
              </span>
            </div>
            {/* Bars */}
            <div className="flex items-end justify-between h-full gap-2 pt-6">
              {chartBarHeights.map((h, i) => {
                const isWeekend = i >= 5
                const isPeak = h === Math.max(...chartBarHeights)
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 relative">
                    {isPeak && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-20">
                        18.4k peak
                      </div>
                    )}
                    <div
                      className={`w-full rounded-xl transition-all ${
                        isWeekend ? 'bg-error' : 'bg-primary'
                      } ${isPeak ? 'opacity-100' : 'opacity-70'}`}
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] text-on-surface-variant">{weekDays[i]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Hourly Breakdown */}
        <div className="bg-surface-container-highest rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-on-surface">Kepadatan Per Jam</h3>
            <span className="text-[10px] text-on-surface-variant font-medium">Hari ini</span>
          </div>
          <div className="relative h-[160px]">
            <div className="flex items-end justify-between h-full gap-1.5">
              {hourlyBarHeights.map((h, i) => {
                const isPeak = h === 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 relative">
                    {isPeak && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-error text-white text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-10">
                        SEKARANG
                      </div>
                    )}
                    <div
                      className={`w-full rounded-lg transition-all ${
                        isPeak ? 'bg-error' : 'bg-tertiary/60'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-on-surface-variant">{hourlyLabels[i]}</span>
                  </div>
                )
              })}
            </div>
          </div>
          {/* Best visit time chips */}
          <div className="flex items-center gap-2 mt-4">
            <Icon name="schedule" size="16px" className="text-primary" />
            <span className="text-xs text-on-surface-variant">Waktu terbaik:</span>
            <span className="bg-primary/15 text-primary text-[11px] font-bold px-3 py-1 rounded-full">
              07.00 - 08.30
            </span>
            <span className="bg-primary/15 text-primary text-[11px] font-bold px-3 py-1 rounded-full">
              Setelah 17.00
            </span>
          </div>
        </div>

        {/* Faktor Penentu */}
        <div>
          <h3 className="text-base font-bold text-on-surface mb-3">Faktor Penentu</h3>
          <div className="grid grid-cols-2 gap-3">
            {faktorData.map((f) => (
              <div key={f.icon} className="bg-surface-container-low p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Icon name={f.icon} size="20px" className="text-primary" />
                </div>
                <p className="text-sm font-bold text-on-surface">{f.title}</p>
                <p className="text-xs text-on-surface-variant mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Live Badge */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 lg:hidden">
          <div className="bg-inverse-surface text-inverse-on-surface rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs font-bold">Live Updates Aktif</span>
          </div>
        </div>
      </div>

      {/* ===================== DESKTOP VIEW ===================== */}
      <div className="hidden lg:flex flex-col gap-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Prediksi Kedatangan</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Analisis prediktif berbasis AI untuk membantu perencanaan kunjungan Anda
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-11 h-11 flex items-center justify-center rounded-full bg-surface-container">
              <Icon name="search" size="22px" className="text-on-surface-variant" />
            </button>
            <button className="w-11 h-11 flex items-center justify-center rounded-full bg-surface-container relative">
              <Icon name="notifications" size="22px" className="text-on-surface-variant" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full" />
            </button>
          </div>
        </div>

        {/* Watchlist Grid - 4 cols */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="bookmark" size="22px" className="text-primary" filled />
            <h2 className="text-lg font-bold text-on-surface">Watchlist</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {destinations.slice(0, 3).map((dest) => {
              const isSelected = selectedDestination.id === dest.id
              const crowdIndex = Math.round(dest.density * 100)
              const trend = dest.density > 0.6 ? '+5%' : '-3%'
              const trendUp = dest.density > 0.6
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest)}
                  className={`bg-surface-container-low rounded-2xl p-5 text-left transition-all ${
                    isSelected ? 'border-2 border-primary ring-4 ring-primary/15' : 'border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${getDensityBgColor(dest.density)}/15 flex items-center justify-center`}
                    >
                      <Icon
                        name={dest.category === 'Pura' ? 'temple_hindu' : dest.category === 'Pantai' ? 'beach_access' : 'forest'}
                        size="20px"
                        className={getDensityTextColor(dest.density)}
                      />
                    </div>
                    <Icon name="bookmark" size="18px" className="text-primary" filled />
                  </div>
                  <p className="text-sm font-bold text-on-surface">{dest.name}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{dest.location}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-2xl font-extrabold ${getDensityTextColor(dest.density)}`}>
                      {crowdIndex}%
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center gap-0.5 ${
                        trendUp ? 'text-error' : 'text-primary'
                      }`}
                    >
                      <Icon name={trendUp ? 'trending_up' : 'trending_down'} size="14px" />
                      {trend}
                    </span>
                  </div>
                </button>
              )
            })}
            {/* Add destination card */}
            <button onClick={() => alert('Fitur tambah destinasi akan segera hadir!')} className="border-2 border-dashed border-outline-variant rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                <Icon name="add" size="24px" />
              </div>
              <span className="text-sm font-bold">Tambah Destinasi</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid: Chart (8) + Hourly (4) */}
        <div className="grid grid-cols-12 gap-6">
          {/* 7-Day Forecast Chart */}
          <div className="col-span-8 bg-surface-container-low rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Prediksi 7 Hari</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {selectedDestination.name} - 12 Apr s/d 18 Apr
                </p>
              </div>
              <div className="flex items-center gap-1 bg-surface-container rounded-full p-1">
                <button
                  onClick={() => setChartMode('probability')}
                  className={`text-xs font-bold px-4 py-2 rounded-full ${chartMode === 'probability' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}
                >
                  Probability
                </button>
                <button
                  onClick={() => setChartMode('visitors')}
                  className={`text-xs font-bold px-4 py-2 rounded-full ${chartMode === 'visitors' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}
                >
                  Visitors
                </button>
              </div>
            </div>
            <div className="relative h-[400px]">
              {/* Max capacity dashed line */}
              <div className="absolute top-[8%] left-0 right-0 border-t-2 border-dashed border-error/30 z-10">
                <span className="absolute -top-4 right-0 text-[10px] text-error font-medium">
                  Max Capacity ({selectedDestination.maxCapacity.toLocaleString()})
                </span>
              </div>
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-on-surface-variant w-8">
                <span>20k</span>
                <span>15k</span>
                <span>10k</span>
                <span>5k</span>
                <span>0</span>
              </div>
              {/* Bars */}
              <div className="flex items-end justify-between h-full gap-4 pl-10 pt-8 pb-0">
                {chartBarHeights.map((h, i) => {
                  const isWeekend = i >= 5
                  const isPeak = h === Math.max(...chartBarHeights)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 relative">
                      {isPeak && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap z-20 shadow">
                          18.4k peak
                        </div>
                      )}
                      <div
                        className={`w-full rounded-2xl transition-all ${
                          isWeekend ? 'bg-tertiary' : 'bg-primary'
                        } ${isPeak ? 'opacity-100 shadow-lg' : 'opacity-70'}`}
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-xs text-on-surface-variant font-medium">{weekDays[i]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-primary" />
                <span className="text-xs text-on-surface-variant">Hari biasa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-tertiary" />
                <span className="text-xs text-on-surface-variant">Weekend</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 border-t-2 border-dashed border-error/50" />
                <span className="text-xs text-on-surface-variant">Kapasitas maks</span>
              </div>
            </div>
          </div>

          {/* Hourly Breakdown - Desktop */}
          <div className="col-span-4 bg-surface-container-low rounded-3xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-on-surface mb-1">Kepadatan Per Jam</h3>
            <p className="text-xs text-on-surface-variant mb-6">Hari ini, Sabtu 12 Apr</p>
            <div className="flex flex-col gap-4 flex-1">
              {desktopHourlyData.map((item) => {
                const barColor =
                  item.pct > 80 ? 'bg-error' : item.pct > 60 ? 'bg-tertiary' : 'bg-primary'
                const textColor =
                  item.pct > 80 ? 'text-error' : item.pct > 60 ? 'text-tertiary' : 'text-primary'
                return (
                  <div key={item.time}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-on-surface">{item.time}</span>
                      <span className={`text-sm font-bold ${textColor}`}>{item.pct}%</span>
                    </div>
                    <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${barColor}`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center gap-2 bg-primary/10 rounded-xl p-3">
                <Icon name="lightbulb" size="20px" className="text-primary shrink-0" />
                <p className="text-xs text-on-surface">
                  Kedatangan ideal jam <span className="font-bold text-primary">08:30 WITA</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Faktor Penentu - Desktop grid-cols-4 */}
        <div>
          <h2 className="text-lg font-bold text-on-surface mb-4">Faktor Penentu</h2>
          <div className="grid grid-cols-4 gap-4">
            {faktorData.map((f) => (
              <div
                key={f.icon}
                className="bg-surface-container-low rounded-2xl p-5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon name={f.icon} size="24px" className="text-primary" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full ${getImpactBadge(f.impact)}`}
                  >
                    {f.impact}
                  </span>
                </div>
                <p className="text-sm font-bold text-on-surface">{f.title}</p>
                <p className="text-xs text-on-surface-variant mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion Banner */}
        <div className="bg-primary text-white rounded-[2rem] p-8 flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="analytics" size="24px" />
              <span className="text-sm font-bold opacity-80">Ringkasan Analisis</span>
            </div>
            <h3 className="text-xl font-bold leading-snug">
              {selectedDestination.name} diprediksi <span className="underline decoration-wavy decoration-white/50">sangat ramai</span> pada akhir pekan ini.
              Pertimbangkan kunjungan pagi hari untuk pengalaman terbaik.
            </h3>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-8">
            <button onClick={() => alert('Laporan akan segera tersedia untuk diunduh!')} className="bg-white text-primary font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2">
              <Icon name="download" size="18px" />
              Download Report
            </button>
            <button
              onClick={() => alert('Fitur live cam akan segera hadir!')}
              className="bg-white/20 backdrop-blur-sm text-white font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2"
            >
              <Icon name="videocam" size="18px" />
              Live Cam
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
