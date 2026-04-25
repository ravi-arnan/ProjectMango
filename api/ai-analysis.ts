import type { VercelRequest, VercelResponse } from '@vercel/node'

const destinations = [
  { name: 'Tanah Lot', location: 'Tabanan', category: 'Pura', density: 0.87, densityLabel: 'Sangat Ramai', visitors: 1248, maxCapacity: 1500, rating: 4.5, reviewCount: 1284, openHours: '06.00 - 19.00', ticketPrice: 'Rp 60.000', description: 'Situs Budaya & Keindahan Pesisir' },
  { name: 'Uluwatu', location: 'Badung', category: 'Pura', density: 0.85, densityLabel: 'Sangat Ramai', visitors: 4821, maxCapacity: 5500, rating: 4.7, reviewCount: 2156, openHours: '07.00 - 19.00', ticketPrice: 'Rp 50.000', description: 'Pura Luhur dengan pemandangan tebing dramatis' },
  { name: 'Kuta Beach', location: 'Badung', category: 'Pantai', density: 0.95, densityLabel: 'Sangat Ramai', visitors: 6200, maxCapacity: 7000, rating: 4.2, reviewCount: 3890, openHours: '24 Jam', ticketPrice: 'Gratis', description: 'Pantai ikonik untuk surfing dan sunset' },
  { name: 'Bedugul', location: 'Tabanan', category: 'Alam', density: 0.22, densityLabel: 'Sepi', visitors: 420, maxCapacity: 2000, rating: 4.8, reviewCount: 980, openHours: '07.00 - 18.00', ticketPrice: 'Rp 75.000', description: 'Danau dan pura di pegunungan yang sejuk' },
  { name: 'Sanur Beach', location: 'Denpasar', category: 'Pantai', density: 0.29, densityLabel: 'Sepi', visitors: 580, maxCapacity: 2000, rating: 4.6, reviewCount: 1540, openHours: '24 Jam', ticketPrice: 'Gratis', description: 'Pantai tenang untuk sunrise dan budaya lokal' },
  { name: 'Ubud Monkey Forest', location: 'Gianyar', category: 'Alam', density: 0.45, densityLabel: 'Sedang', visitors: 1205, maxCapacity: 2800, rating: 4.5, reviewCount: 4200, openHours: '08.30 - 18.00', ticketPrice: 'Rp 80.000', description: 'Hutan sakral dengan ratusan monyet ekor panjang' },
  { name: 'Tegalalang Rice Terrace', location: 'Gianyar', category: 'Alam', density: 0.62, densityLabel: 'Ramai', visitors: 1890, maxCapacity: 3000, rating: 4.6, reviewCount: 2890, openHours: '07.00 - 18.00', ticketPrice: 'Rp 25.000', description: 'Sawah terasering ikonik dengan pemandangan lembah' },
  { name: 'Pantai Pandawa', location: 'Badung', category: 'Pantai', density: 0.20, densityLabel: 'Sepi', visitors: 840, maxCapacity: 4000, rating: 4.4, reviewCount: 1250, openHours: '07.00 - 18.00', ticketPrice: 'Rp 20.000', description: 'Pantai tersembunyi di balik tebing kapur' },
  { name: 'Pura Besakih', location: 'Karangasem', category: 'Pura', density: 0.65, densityLabel: 'Ramai', visitors: 2150, maxCapacity: 3500, rating: 4.7, reviewCount: 1870, openHours: '08.00 - 18.00', ticketPrice: 'Rp 60.000', description: 'Pura terbesar dan terpenting di Bali' },
  { name: 'Kintamani', location: 'Bangli', category: 'Alam', density: 0.35, densityLabel: 'Sepi', visitors: 950, maxCapacity: 3000, rating: 4.6, reviewCount: 1620, openHours: '08.00 - 17.00', ticketPrice: 'Rp 30.000', description: 'Pemandangan Gunung Batur dan Danau Batur' },
]

const DEFAULT_SYSTEM_PROMPT = `Kamu adalah Mango AI, asisten wisata cerdas untuk platform pariwisata Bali. Kamu membantu pengguna menemukan destinasi terbaik di seluruh Bali, memberikan informasi lengkap, rekomendasi waktu kunjungan, dan rencana perjalanan.

---

## KEPRIBADIAN & GAYA BAHASA

- Gunakan Bahasa Indonesia yang ramah, hangat, dan informatif
- Gunakan emoji secukupnya agar jawaban lebih menarik dan mudah dibaca
- Jawab secara terstruktur, ringkas, dan mudah dipahami
- Jadilah seperti teman perjalanan yang berpengetahuan luas tentang Bali

---

## CAKUPAN PENGETAHUAN

Kamu bebas menjawab pertanyaan tentang semua destinasi wisata di Bali, tidak terbatas pada daftar tertentu. Ini termasuk:
- Destinasi wisata alam, pantai, pura, desa wisata, museum, dll
- Hotel dan akomodasi di seluruh Bali
- Restoran, kafe, dan kuliner khas Bali
- Aktivitas wisata seperti rafting, surfing, spa, cooking class, dll
- Tips perjalanan, budaya lokal, dan etika berkunjung
- Rekomendasi itinerary berdasarkan durasi dan preferensi user

---

## ATURAN LINK BOOKING — WAJIB DIIKUTI

Setiap kali menyebut atau merekomendasikan destinasi, hotel, restoran, atau aktivitas wisata, WAJIB sertakan link booking dari platform yang paling relevan.

### Format link berdasarkan jenis:

**Destinasi Wisata / Tiket Masuk:**
🎫 [Beli Tiket di Klook](https://www.klook.com/id/search/?query={nama-destinasi}+bali)
🎫 [Beli Tiket di GetYourGuide](https://www.getyourguide.com/s/?q={nama-destinasi}+bali)

**Hotel / Akomodasi:**
🏨 [Cek Harga di Traveloka](https://www.traveloka.com/id-id/hotel/search?spec={nama-hotel}+bali)
🏨 [Cek Harga di Tiket.com](https://www.tiket.com/hotel/search?q={nama-hotel}+bali)

**Restoran / Kuliner:**
🍽️ [Lihat di TripAdvisor](https://www.tripadvisor.co.id/Search?q={nama-restoran}+bali)

**Aktivitas Wisata:**
🎯 [Booking Aktivitas di Klook](https://www.klook.com/id/search/?query={nama-aktivitas}+bali)

### Aturan pengisian link:
- Ganti {nama-destinasi}, {nama-hotel}, dll dengan nama asli dalam bahasa Inggris atau nama umumnya
- Gunakan tanda + untuk spasi dalam URL
- Selalu gunakan link pencarian (bukan halaman statis) agar selalu relevan

### Contoh nyata:
- Tanah Lot → https://www.klook.com/id/search/?query=tanah+lot+bali
- The Mulia Resort → https://www.traveloka.com/id-id/hotel/search?spec=mulia+resort+bali
- Locavore Restaurant → https://www.tripadvisor.co.id/Search?q=locavore+ubud+bali
- Arung Jeram Ayung → https://www.klook.com/id/search/?query=ayung+river+rafting+bali

---

## CARA MENJAWAB BERDASARKAN KONTEKS

**Rekomendasi destinasi:**
Jelaskan keunggulan, lokasi, jam buka, harga estimasi, tips kunjungan → lalu sertakan link booking tiket

**Rekomendasi hotel:**
Jelaskan fasilitas, lokasi, kisaran harga per malam → lalu sertakan link cek harga

**Rekomendasi restoran:**
Jelaskan jenis masakan, suasana, kisaran harga per orang → lalu sertakan link TripAdvisor

**Itinerary:**
Susun rencana per hari dengan jam estimasi, setiap tempat yang disebut WAJIB disertai link booking yang relevan

**Pertanyaan umum (budaya, tips, cuaca, dll):**
Jawab informatif dan lengkap, arahkan ke destinasi atau aktivitas relevan jika memungkinkan

---

## DATA KEPADATAN REAL-TIME PLATFORM

Platform ini memiliki data kepadatan pengunjung real-time untuk destinasi populer berikut. Gunakan data ini saat user bertanya tentang kepadatan atau waktu terbaik berkunjung:

${JSON.stringify(destinations, null, 2)}

Untuk destinasi di luar daftar ini, gunakan pengetahuanmu tentang pola kunjungan wisata Bali secara umum.`

const DEFAULT_FALLBACK =
  'Maaf, saya tidak bisa memberikan respons saat ini. Coba tanyakan lagi dengan kata lain ya.'
const DEFAULT_REFUSAL =
  'Maaf, saya tidak bisa membantu dengan topik itu. Tanyakan seputar wisata Bali ya.'

type Persona = 'informatif' | 'formal' | 'santai' | 'profesional'

const PERSONA_HINT: Record<Persona, string> = {
  informatif: '',
  formal: 'Gunakan bahasa formal dan sopan.',
  santai: 'Gunakan bahasa santai dan akrab, boleh pakai emoji.',
  profesional: 'Jawab dengan nada profesional, ringkas, dan data-driven.',
}

interface AiSettings {
  default_model: string
  system_prompt: string | null
  max_tokens: number
  temperature: number
  persona: Persona
  content_filter_enabled: boolean
  blocked_keywords: string[]
  refusal_message: string
  fallback_message: string
  allow_anonymous_chat: boolean
}

const DEFAULT_SETTINGS: AiSettings = {
  default_model: 'gpt-4o-mini',
  system_prompt: null,
  max_tokens: 1024,
  temperature: 0.7,
  persona: 'informatif',
  content_filter_enabled: true,
  blocked_keywords: [],
  refusal_message: DEFAULT_REFUSAL,
  fallback_message: DEFAULT_FALLBACK,
  allow_anonymous_chat: true,
}

async function fetchAiSettings(): Promise<AiSettings> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return DEFAULT_SETTINGS

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/ai_agent_settings?id=eq.1&select=default_model,system_prompt,max_tokens,temperature,persona,content_filter_enabled,blocked_keywords,refusal_message,fallback_message,allow_anonymous_chat`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      }
    )
    if (!res.ok) return DEFAULT_SETTINGS
    const rows = (await res.json()) as Partial<AiSettings>[]
    const row = rows[0]
    if (!row) return DEFAULT_SETTINGS
    return {
      default_model: row.default_model || DEFAULT_SETTINGS.default_model,
      system_prompt: row.system_prompt ?? null,
      max_tokens: row.max_tokens || DEFAULT_SETTINGS.max_tokens,
      temperature: row.temperature ?? DEFAULT_SETTINGS.temperature,
      persona: (row.persona as Persona) || DEFAULT_SETTINGS.persona,
      content_filter_enabled: row.content_filter_enabled ?? DEFAULT_SETTINGS.content_filter_enabled,
      blocked_keywords: row.blocked_keywords ?? DEFAULT_SETTINGS.blocked_keywords,
      refusal_message: row.refusal_message || DEFAULT_SETTINGS.refusal_message,
      fallback_message: row.fallback_message || DEFAULT_SETTINGS.fallback_message,
      allow_anonymous_chat: row.allow_anonymous_chat ?? DEFAULT_SETTINGS.allow_anonymous_chat,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

async function getUserFromToken(
  token: string | undefined
): Promise<{ is_anonymous?: boolean } | null> {
  if (!token) return null
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return null
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) return null
    return (await res.json()) as { is_anonymous?: boolean }
  } catch {
    return null
  }
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isBlocked(message: string, keywords: string[]): boolean {
  if (keywords.length === 0) return false
  const lower = message.toLowerCase()
  return keywords.some((kw) => {
    const trimmed = kw.trim()
    if (!trimmed) return false
    const pattern = new RegExp(`\\b${escapeRegex(trimmed.toLowerCase())}\\b`)
    return pattern.test(lower)
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const githubToken = process.env.GITHUB_TOKEN
  if (!githubToken) {
    return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })
  }

  const { messages } = req.body
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' })
  }

  const trimmedMessages = messages.slice(-20)
  const settings = await fetchAiSettings()

  // 1. Guest gate
  if (!settings.allow_anonymous_chat) {
    const authHeader = req.headers.authorization
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
    const user = await getUserFromToken(accessToken)
    if (!user || user.is_anonymous) {
      return res.status(403).json({ error: settings.refusal_message })
    }
  }

  // 2. Content filter on latest user message
  if (settings.content_filter_enabled && settings.blocked_keywords.length > 0) {
    const lastUserMessage = [...trimmedMessages]
      .reverse()
      .find((m: { role: string }) => m.role === 'user')?.content ?? ''
    if (isBlocked(lastUserMessage, settings.blocked_keywords)) {
      return res.status(200).json({ reply: settings.refusal_message })
    }
  }

  // 3. Build system prompt with persona hint appended
  const baseSystem = settings.system_prompt?.trim() || DEFAULT_SYSTEM_PROMPT
  const personaHint = PERSONA_HINT[settings.persona] || ''
  const systemContent = personaHint ? `${baseSystem}\n\n${personaHint}` : baseSystem

  try {
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        model: settings.default_model,
        max_tokens: settings.max_tokens,
        temperature: settings.temperature,
        messages: [
          { role: 'system', content: systemContent },
          ...trimmedMessages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub Models error:', response.status, errorText)
      return res.status(502).json({ error: 'AI service temporarily unavailable' })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || settings.fallback_message

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('AI analysis error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
