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

const SYSTEM_PROMPT = `Kamu adalah BaliSense AI, asisten analisis pariwisata cerdas untuk Pulau Bali. Kamu membantu wisatawan merencanakan kunjungan dengan data kepadatan real-time.

Data destinasi saat ini:
${JSON.stringify(destinations, null, 2)}

Panduan:
- Jawab dalam bahasa yang sama dengan pertanyaan pengguna (Indonesia atau English)
- Berikan rekomendasi spesifik berdasarkan data kepadatan aktual
- Sarankan waktu kunjungan terbaik dan alternatif yang lebih sepi
- Gunakan angka dan persentase dari data untuk mendukung jawaban
- Jaga jawaban tetap ringkas dan informatif (maksimal 3-4 paragraf)
- Gunakan emoji secukupnya untuk membuat jawaban lebih menarik
- Jika ditanya di luar topik pariwisata Bali, arahkan kembali ke topik utama`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  const { messages } = req.body
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' })
  }

  // Cap conversation history to last 20 messages
  const trimmedMessages = messages.slice(-20)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: trimmedMessages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', response.status, errorText)
      return res.status(502).json({ error: 'AI service temporarily unavailable' })
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || 'Maaf, saya tidak dapat memberikan respons saat ini.'

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('AI analysis error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
