import { useState } from 'react'
import Icon from '../components/Icon'
import { destinations, getDensityBgColor, getDensityTextColor } from '../data/destinations'
import { useWatchlist } from '../hooks/useWatchlist'
import { generateWeeklyPrediction, generateHourlyPrediction, getLocalEvents, getBestVisitTime } from '../lib/predictions'
import { showToast } from '../components/Toast'

function getDensityTag(density: number): { label: string; color: string } {
  if (density > 0.7) return { label: 'High', color: 'bg-error/15 text-error' }
  if (density > 0.4) return { label: 'Med', color: 'bg-tertiary/15 text-tertiary' }
  return { label: 'Low', color: 'bg-primary/15 text-primary' }
}

function getImpactBadge(impact: number) {
  if (impact >= 1.4) return 'bg-error/15 text-error'
  if (impact >= 1.2) return 'bg-amber-500/15 text-amber-600'
  return 'bg-primary/15 text-primary'
}

function getImpactLabel(impact: number) {
  if (impact >= 1.4) return 'Tinggi'
  if (impact >= 1.2) return 'Sedang'
  if (impact < 0.5) return 'Tutup'
  return 'Rendah'
}

export default function Prediksi() {
  const [selectedDestination, setSelectedDestination] = useState(destinations[0])
  const [chartMode, setChartMode] = useState<'probability' | 'visitors'>('probability')
  const [showDestPicker, setShowDestPicker] = useState(false)
  const { watchlist, toggleWatchlist, isWatchlisted } = useWatchlist()

  const weeklyData = generateWeeklyPrediction(selectedDestination)
  const hourlyData = generateHourlyPrediction(selectedDestination)
  const events = getLocalEvents()
  const bestTime = getBestVisitTime(selectedDestination)
  const peakDay = weeklyData.reduce((max, d) => d.density > max.density ? d : max, weeklyData[0])
  const peakVisitors = peakDay.visitors

  const watchlistedDestinations = destinations.filter((d) => watchlist.includes(d.id))

  function downloadReport() {
    const lines = [
      `Prediksi Keramaian - ${selectedDestination.name}`,
      `Generated: ${new Date().toLocaleDateString('id-ID')}`,
      '',
      'Prediksi 7 Hari:',
      ...weeklyData.map((d) => `  ${d.day} (${d.date}): ${Math.round(d.density * 100)}% - ${d.visitors} pengunjung${d.hasEvent ? ` [Event: ${d.eventName}]` : ''}`),
      '',
      'Kepadatan Per Jam (Hari Ini):',
      ...hourlyData.map((h) => `  ${h.hour}: ${Math.round(h.density * 100)}% - ${h.visitors} pengunjung`),
      '',
      `Waktu Terbaik Berkunjung: ${bestTime}`,
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prediksi-${selectedDestination.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Laporan berhasil diunduh')
  }

  const faktorData = [
    { icon: 'calendar_today', title: 'Kalender Libur', desc: weeklyData.some((d) => d.dayShort === 'SAB' || d.dayShort === 'MIN') ? 'Weekend dalam 7 hari ke depan' : 'Tidak ada libur', impact: 1.3 },
    { icon: 'cloud', title: 'Prakiraan Cuaca', desc: 'Cerah berawan, ideal untuk kunjungan', impact: 1.0 },
    ...events.slice(0, 1).map((e) => ({ icon: 'music_note' as const, title: 'Event Lokal', desc: e.name, impact: e.impact })),
    { icon: 'bar_chart_4_bars', title: 'Tren Historis', desc: selectedDestination.density > 0.6 ? '+22% vs bulan lalu' : '-8% vs bulan lalu', impact: selectedDestination.density > 0.6 ? 1.3 : 0.9 },
  ]

  return (
    <div>
      {/* MOBILE VIEW */}
      <div className="lg:hidden flex flex-col gap-4 pb-28">
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
          {watchlistedDestinations.length === 0 ? (
            <div className="bg-surface-container-low rounded-2xl p-5 text-center">
              <Icon name="bookmark_border" size="32px" className="text-on-surface-variant/40 mb-2" />
              <p className="text-sm text-on-surface-variant">Belum ada destinasi di watchlist</p>
              <p className="text-xs text-on-surface-variant/70 mt-1">Tambahkan dari halaman detail destinasi</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {watchlistedDestinations.slice(0, 3).map((dest) => {
                const pct = Math.round(dest.density * 100)
                const color = dest.density > 0.7 ? 'error' : dest.density > 0.3 ? 'tertiary' : 'primary'
                return (
                  <button key={dest.id} onClick={() => setSelectedDestination(dest)}
                    className={`bg-surface-container-low rounded-2xl p-4 text-left ${selectedDestination.id === dest.id ? 'ring-2 ring-primary' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-${color}/15 flex items-center justify-center shrink-0`}>
                        <Icon name={dest.category === 'Pura' ? 'temple_hindu' : dest.category === 'Pantai' ? 'beach_access' : 'forest'} size="20px" className={`text-${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-on-surface truncate">{dest.name}</p>
                          <span className={`text-xs font-bold text-${color}`}>{pct}%</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">{dest.densityLabel}</p>
                        <div className={`mt-2 h-2 bg-${color}/15 rounded-full overflow-hidden`}>
                          <div className={`h-full bg-${color} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Destination Selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {destinations.map((dest) => {
            const tag = getDensityTag(dest.density)
            const isSelected = selectedDestination.id === dest.id
            return (
              <button key={dest.id} onClick={() => setSelectedDestination(dest)}
                className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                <span>{dest.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/25 text-on-primary' : tag.color}`}>{tag.label}</span>
              </button>
            )
          })}
        </div>

        {/* Forecast Summary */}
        <div className="bg-gradient-to-br from-primary to-primary-container text-white rounded-[24px] p-6">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="location_on" size="16px" />
            <span className="text-sm font-medium opacity-90">{selectedDestination.location}</span>
          </div>
          <h3 className="text-lg font-bold">{selectedDestination.name}</h3>
          <p className="text-3xl font-extrabold mt-2">{peakVisitors.toLocaleString('id-ID')}</p>
          <p className="text-sm opacity-80 mt-0.5">puncak pengunjung</p>
          <div className="flex items-center gap-3 mt-5">
            {weeklyData.map((d) => {
              const isHigh = d.density > 0.8
              return (
                <div key={d.date} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] opacity-70">{d.dayShort}</span>
                  <span className={`w-3 h-3 rounded-full ${isHigh ? 'bg-error animate-pulse' : 'bg-white/50'}`} />
                </div>
              )
            })}
          </div>
        </div>

        {/* 7-Day Chart */}
        <div className="bg-surface-container-low rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-on-surface">Prediksi 7 Hari</h3>
            <span className="text-[10px] text-on-surface-variant font-medium">{weeklyData[0].date} - {weeklyData[6].date}</span>
          </div>
          <div className="relative h-[180px]">
            <div className="absolute top-[10%] left-0 right-0 border-t-2 border-dashed border-error/30 z-10">
              <span className="absolute -top-4 right-0 text-[9px] text-error font-medium">Max Capacity</span>
            </div>
            <div className="flex items-end justify-between h-full gap-2 pt-6">
              {weeklyData.map((d, i) => {
                const h = Math.round(d.density * 100)
                const isPeak = d === peakDay
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 relative">
                    {isPeak && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-20">
                        {(d.visitors / 1000).toFixed(1)}k
                      </div>
                    )}
                    <div className={`w-full rounded-xl transition-all ${d.density > 0.8 ? 'bg-error' : i >= 5 ? 'bg-tertiary' : 'bg-primary'} ${isPeak ? 'opacity-100' : 'opacity-70'}`}
                      style={{ height: `${h}%` }} />
                    <span className="text-[10px] text-on-surface-variant">{d.dayShort}</span>
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
              {hourlyData.map((h, i) => {
                const pct = Math.round(h.density * 100)
                const isPeak = pct === Math.max(...hourlyData.map((x) => Math.round(x.density * 100)))
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 relative">
                    {isPeak && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-error text-white text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-10">PUNCAK</div>
                    )}
                    <div className={`w-full rounded-lg transition-all ${isPeak ? 'bg-error' : 'bg-tertiary/60'}`} style={{ height: `${pct}%` }} />
                    <span className="text-[9px] text-on-surface-variant">{h.hour.split(':')[0]}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Icon name="schedule" size="16px" className="text-primary" />
            <span className="text-xs text-on-surface-variant">Waktu terbaik:</span>
            <span className="bg-primary/15 text-primary text-[11px] font-bold px-3 py-1 rounded-full">{bestTime}</span>
          </div>
        </div>

        {/* Faktor Penentu */}
        <div>
          <h3 className="text-base font-bold text-on-surface mb-3">Faktor Penentu</h3>
          <div className="grid grid-cols-2 gap-3">
            {faktorData.map((f, i) => (
              <div key={i} className="bg-surface-container-low p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Icon name={f.icon} size="20px" className="text-primary" />
                </div>
                <p className="text-sm font-bold text-on-surface">{f.title}</p>
                <p className="text-xs text-on-surface-variant mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

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

      {/* DESKTOP VIEW */}
      <div className="hidden lg:flex flex-col gap-6 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Prediksi Kedatangan</h1>
            <p className="text-sm text-on-surface-variant mt-1">Analisis prediktif berbasis AI untuk membantu perencanaan kunjungan Anda</p>
          </div>
        </div>

        {/* Watchlist Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="bookmark" size="22px" className="text-primary" filled />
            <h2 className="text-lg font-bold text-on-surface">Watchlist</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(watchlistedDestinations.length > 0 ? watchlistedDestinations.slice(0, 3) : destinations.slice(0, 3)).map((dest) => {
              const isSelected = selectedDestination.id === dest.id
              const crowdIndex = Math.round(dest.density * 100)
              const trend = dest.density > 0.6 ? '+5%' : '-3%'
              const trendUp = dest.density > 0.6
              return (
                <button key={dest.id} onClick={() => setSelectedDestination(dest)}
                  className={`bg-surface-container-low rounded-2xl p-5 text-left transition-all ${isSelected ? 'border-2 border-primary ring-4 ring-primary/15' : 'border-2 border-transparent'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${getDensityBgColor(dest.density)}/15 flex items-center justify-center`}>
                      <Icon name={dest.category === 'Pura' ? 'temple_hindu' : dest.category === 'Pantai' ? 'beach_access' : 'forest'} size="20px" className={getDensityTextColor(dest.density)} />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleWatchlist(dest.id) }}>
                      <Icon name="bookmark" size="18px" className="text-primary" filled={isWatchlisted(dest.id)} />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-on-surface">{dest.name}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{dest.location}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-2xl font-extrabold ${getDensityTextColor(dest.density)}`}>{crowdIndex}%</span>
                    <span className={`text-xs font-bold flex items-center gap-0.5 ${trendUp ? 'text-error' : 'text-primary'}`}>
                      <Icon name={trendUp ? 'trending_up' : 'trending_down'} size="14px" />{trend}
                    </span>
                  </div>
                </button>
              )
            })}
            <button onClick={() => setShowDestPicker(!showDestPicker)} className="border-2 border-dashed border-outline-variant rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary transition-colors relative">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                <Icon name="add" size="24px" />
              </div>
              <span className="text-sm font-bold">Tambah Destinasi</span>
              {showDestPicker && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-2xl border border-stone-100 p-3 z-50 max-h-64 overflow-y-auto">
                  {destinations.filter((d) => !watchlist.includes(d.id)).map((dest) => (
                    <button key={dest.id} onClick={(e) => { e.stopPropagation(); toggleWatchlist(dest.id); setShowDestPicker(false) }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 text-left">
                      <span className={`w-2.5 h-2.5 rounded-full ${getDensityBgColor(dest.density)}`} />
                      <span className="text-sm text-on-surface">{dest.name}</span>
                      <span className="text-xs text-on-surface-variant ml-auto">{Math.round(dest.density * 100)}%</span>
                    </button>
                  ))}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Main Chart Grid */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-surface-container-low rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Prediksi 7 Hari</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{selectedDestination.name} - {weeklyData[0].date} s/d {weeklyData[6].date}</p>
              </div>
              <div className="flex items-center gap-1 bg-surface-container rounded-full p-1">
                <button onClick={() => setChartMode('probability')} className={`text-xs font-bold px-4 py-2 rounded-full ${chartMode === 'probability' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}>Probability</button>
                <button onClick={() => setChartMode('visitors')} className={`text-xs font-bold px-4 py-2 rounded-full ${chartMode === 'visitors' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}>Visitors</button>
              </div>
            </div>
            <div className="relative h-[400px]">
              <div className="absolute top-[8%] left-0 right-0 border-t-2 border-dashed border-error/30 z-10">
                <span className="absolute -top-4 right-0 text-[10px] text-error font-medium">Max Capacity ({selectedDestination.maxCapacity.toLocaleString()})</span>
              </div>
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-on-surface-variant w-8">
                {chartMode === 'visitors'
                  ? [<span key="4">{(selectedDestination.maxCapacity * 1.1 / 1000).toFixed(0)}k</span>, <span key="3">{(selectedDestination.maxCapacity * 0.75 / 1000).toFixed(0)}k</span>, <span key="2">{(selectedDestination.maxCapacity * 0.5 / 1000).toFixed(0)}k</span>, <span key="1">{(selectedDestination.maxCapacity * 0.25 / 1000).toFixed(0)}k</span>, <span key="0">0</span>]
                  : [<span key="4">100%</span>, <span key="3">75%</span>, <span key="2">50%</span>, <span key="1">25%</span>, <span key="0">0%</span>]
                }
              </div>
              <div className="flex items-end justify-between h-full gap-4 pl-10 pt-8 pb-0">
                {weeklyData.map((d, i) => {
                  const h = Math.round(d.density * 100)
                  const isPeak = d === peakDay
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-2 relative">
                      {isPeak && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap z-20 shadow">
                          {chartMode === 'visitors' ? `${(d.visitors / 1000).toFixed(1)}k` : `${h}%`}
                        </div>
                      )}
                      <div className={`w-full rounded-2xl transition-all ${d.density > 0.8 ? 'bg-error' : i >= 5 ? 'bg-tertiary' : 'bg-primary'} ${isPeak ? 'opacity-100 shadow-lg' : 'opacity-70'}`}
                        style={{ height: `${h}%` }} />
                      <span className="text-xs text-on-surface-variant font-medium">{d.dayShort}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary" /><span className="text-xs text-on-surface-variant">Hari biasa</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-tertiary" /><span className="text-xs text-on-surface-variant">Weekend</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-error" /><span className="text-xs text-on-surface-variant">Sangat ramai</span></div>
            </div>
          </div>

          <div className="col-span-4 bg-surface-container-low rounded-3xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-on-surface mb-1">Kepadatan Per Jam</h3>
            <p className="text-xs text-on-surface-variant mb-6">Hari ini</p>
            <div className="flex flex-col gap-4 flex-1">
              {hourlyData.filter((_, i) => i % 2 === 0).map((item) => {
                const pct = Math.round(item.density * 100)
                const barColor = pct > 80 ? 'bg-error' : pct > 60 ? 'bg-tertiary' : 'bg-primary'
                const textColor = pct > 80 ? 'text-error' : pct > 60 ? 'text-tertiary' : 'text-primary'
                return (
                  <div key={item.hour}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-on-surface">{item.hour}</span>
                      <span className={`text-sm font-bold ${textColor}`}>{pct}%</span>
                    </div>
                    <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center gap-2 bg-primary/10 rounded-xl p-3">
                <Icon name="lightbulb" size="20px" className="text-primary shrink-0" />
                <p className="text-xs text-on-surface">Kedatangan ideal jam <span className="font-bold text-primary">{bestTime}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Faktor Penentu */}
        <div>
          <h2 className="text-lg font-bold text-on-surface mb-4">Faktor Penentu</h2>
          <div className="grid grid-cols-4 gap-4">
            {faktorData.map((f, i) => (
              <div key={i} className="bg-surface-container-low rounded-2xl p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon name={f.icon} size="24px" className="text-primary" />
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${getImpactBadge(f.impact)}`}>{getImpactLabel(f.impact)}</span>
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
              <Icon name="analytics" size="24px" /><span className="text-sm font-bold opacity-80">Ringkasan Analisis</span>
            </div>
            <h3 className="text-xl font-bold leading-snug">
              {selectedDestination.name} diprediksi <span className="underline decoration-wavy decoration-white/50">{selectedDestination.density > 0.7 ? 'sangat ramai' : 'cukup tenang'}</span> pada akhir pekan ini.
              {selectedDestination.density > 0.7 ? ' Pertimbangkan kunjungan pagi hari untuk pengalaman terbaik.' : ' Waktu yang baik untuk berkunjung!'}
            </h3>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-8">
            <button onClick={downloadReport} className="bg-white text-primary font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2">
              <Icon name="download" size="18px" />Download Report
            </button>
            <button onClick={() => showToast('Fitur live cam akan segera hadir', 'info')} className="bg-white/20 backdrop-blur-sm text-white font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2">
              <Icon name="videocam" size="18px" />Live Cam
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
