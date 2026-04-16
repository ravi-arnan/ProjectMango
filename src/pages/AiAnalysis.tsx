import { useState, useRef, useEffect } from 'react'
import Icon from '../components/Icon'
import { destinations } from '../data/destinations'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const suggestedPrompts = [
  'Destinasi mana yang paling sepi saat ini?',
  'Rekomendasi wisata untuk keluarga?',
  'Kapan waktu terbaik ke Tanah Lot?',
  'Bandingkan Uluwatu dan Bedugul',
  'Destinasi dengan rating tertinggi?',
  'Rencana itinerary 3 hari di Bali',
]

export default function AiAnalysis() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: text.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: 'Maaf, terjadi kesalahan. Pastikan koneksi internet Anda stabil dan coba lagi.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  const emptyState = messages.length === 0 && !isLoading

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-100px)]">
      {/* ===== CHAT AREA ===== */}
      <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl lg:rounded-3xl overflow-hidden border border-stone-100/50">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100/50">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center text-white">
            <Icon name="auto_awesome" size="20px" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-on-surface">Mango AI</h2>
            <p className="text-[11px] text-on-surface-variant">Analisis cerdas destinasi wisata Bali</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-xs font-semibold text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
            >
              <Icon name="refresh" size="16px" />
              Reset
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
          {emptyState && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Icon name="travel_explore" size="32px" className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-1">Halo! Saya Mango AI</h3>
              <p className="text-sm text-on-surface-variant mb-6 max-w-sm">
                Tanyakan apa saja tentang destinasi wisata di Bali — kepadatan, rekomendasi, waktu terbaik berkunjung, dan lainnya.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs font-medium text-primary bg-primary/8 hover:bg-primary/15 px-3.5 py-2 rounded-full transition-colors border border-primary/10"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-on-primary rounded-br-md'
                    : 'bg-surface-container-low text-on-surface rounded-bl-md'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-surface-container-low rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-stone-100/50 bg-surface-container-lowest">
          <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya tentang destinasi Bali..."
              className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 bg-primary text-on-primary rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Icon name="send" size="18px" />
            </button>
          </div>
        </form>
      </div>

      {/* ===== SIDEBAR (Desktop only) ===== */}
      <div className="hidden lg:flex flex-col w-[320px] shrink-0 gap-4">
        {/* Destination Quick Reference */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 border border-stone-100/50">
          <h3 className="text-sm font-bold text-on-surface mb-1">Status Destinasi</h3>
          <p className="text-[11px] text-on-surface-variant mb-4">Data kepadatan real-time</p>
          <div className="space-y-2.5">
            {destinations.map((dest) => {
              const color =
                dest.density > 0.8 ? 'bg-error' :
                dest.density > 0.6 ? 'bg-tertiary' :
                dest.density > 0.3 ? 'bg-amber-500' :
                'bg-emerald-500'
              const textColor =
                dest.density > 0.8 ? 'text-error' :
                dest.density > 0.6 ? 'text-tertiary' :
                dest.density > 0.3 ? 'text-amber-600' :
                'text-emerald-600'

              return (
                <div key={dest.id} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
                  <span className="text-xs font-medium text-on-surface flex-1 truncate">{dest.name}</span>
                  <span className={`text-[11px] font-bold ${textColor}`}>
                    {Math.round(dest.density * 100)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="lightbulb" size="18px" className="text-primary" />
            <h3 className="text-sm font-bold text-primary">Tips Bertanya</h3>
          </div>
          <ul className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary shrink-0">•</span>
              Tanyakan perbandingan antar destinasi
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0">•</span>
              Minta rekomendasi berdasarkan preferensi
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0">•</span>
              Tanyakan waktu terbaik berkunjung
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0">•</span>
              Minta rencana itinerary perjalanan
            </li>
          </ul>
        </div>

        {/* Suggested Prompts */}
        {messages.length > 0 && (
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-stone-100/50">
            <h3 className="text-sm font-bold text-on-surface mb-3">Pertanyaan Lainnya</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.slice(0, 4).map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className="text-[11px] font-medium text-primary bg-primary/8 hover:bg-primary/15 px-3 py-1.5 rounded-full transition-colors border border-primary/10 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
