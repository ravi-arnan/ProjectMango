import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  DEFAULT_SYSTEM_PROMPT as BASE_SYSTEM_PROMPT,
  DEFAULT_FALLBACK_MESSAGE,
  DEFAULT_REFUSAL_MESSAGE,
} from '../src/data/aiDefaults'
import { chatCompletionsUrl, DEFAULT_PROVIDER_ID } from '../src/data/aiProviders'

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

const DEFAULT_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

---

## DATA KEPADATAN REAL-TIME PLATFORM

Platform ini memiliki data kepadatan pengunjung real-time untuk destinasi populer berikut. Gunakan data ini saat user bertanya tentang kepadatan atau waktu terbaik berkunjung:

${JSON.stringify(destinations, null, 2)}

Untuk destinasi di luar daftar ini, gunakan pengetahuanmu tentang pola kunjungan wisata Bali secara umum.`

const DEFAULT_FALLBACK = DEFAULT_FALLBACK_MESSAGE
const DEFAULT_REFUSAL = DEFAULT_REFUSAL_MESSAGE

type Persona = 'informatif' | 'formal' | 'santai' | 'profesional'

const PERSONA_HINT: Record<Persona, string> = {
  informatif: '',
  formal: 'Gunakan bahasa formal dan sopan.',
  santai: 'Gunakan bahasa santai dan akrab, boleh pakai emoji.',
  profesional: 'Jawab dengan nada profesional, ringkas, dan data-driven.',
}

interface AiSettings {
  api_key: string | null
  api_provider: string
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
  api_key: null,
  api_provider: DEFAULT_PROVIDER_ID,
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
  // Service role bypasses RLS so we can read api_key. Falls back to anon key
  // for local dev where the service role might not be configured (in which
  // case api_key reads will return empty and we use GITHUB_TOKEN env fallback).
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return DEFAULT_SETTINGS

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/ai_agent_settings?id=eq.1&select=api_key,api_provider,default_model,system_prompt,max_tokens,temperature,persona,content_filter_enabled,blocked_keywords,refusal_message,fallback_message,allow_anonymous_chat`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    )
    if (!res.ok) return DEFAULT_SETTINGS
    const rows = (await res.json()) as Partial<AiSettings>[]
    const row = rows[0]
    if (!row) return DEFAULT_SETTINGS
    return {
      api_key: row.api_key ?? null,
      api_provider: row.api_provider || DEFAULT_SETTINGS.api_provider,
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

  const { messages } = req.body
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' })
  }

  const trimmedMessages = messages.slice(-20)
  const settings = await fetchAiSettings()

  // API key resolution: DB value wins, env var as fallback for migration safety
  const apiKey = settings.api_key?.trim() || process.env.GITHUB_TOKEN
  if (!apiKey) {
    return res.status(503).json({ error: 'AI not configured. Set API key in /app/ai-agent.' })
  }

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
    const response = await fetch(chatCompletionsUrl(settings.api_provider), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
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
      console.error(`${settings.api_provider} error:`, response.status, errorText)
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
