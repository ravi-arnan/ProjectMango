import type { Destination } from '../data/destinations'

export type Mood = 'tenang' | 'petualang' | 'romantis' | 'edukatif' | 'seru'

interface MoodConfig {
  emoji: string
  label: string
  description: string
  filter: (d: Destination) => boolean
  sort: (a: Destination, b: Destination) => number
}

const MOOD_MAP: Record<Mood, MoodConfig> = {
  tenang: {
    emoji: '😌',
    label: 'Tenang',
    description: 'Destinasi sepi dengan rating tinggi',
    filter: (d) => d.density < 0.5,
    sort: (a, b) => b.rating - a.rating,
  },
  petualang: {
    emoji: '🏔️',
    label: 'Petualang',
    description: 'Alam & lokasi menantang',
    filter: (d) => d.category === 'Alam',
    sort: (a, b) => b.rating - a.rating,
  },
  romantis: {
    emoji: '💕',
    label: 'Romantis',
    description: 'Pantai & pura berkelas',
    filter: (d) =>
      (d.category === 'Pantai' || d.category === 'Pura') && d.rating >= 4.4,
    sort: (a, b) => b.rating - a.rating,
  },
  edukatif: {
    emoji: '📚',
    label: 'Edukatif',
    description: 'Budaya & desa wisata',
    filter: (d) => d.category === 'Pura' || d.category === 'Desa Wisata',
    sort: (a, b) => b.rating - a.rating,
  },
  seru: {
    emoji: '🎉',
    label: 'Seru',
    description: 'Spot ramai & populer',
    filter: (d) => d.density > 0.6 && d.rating >= 4.2,
    sort: (a, b) => b.visitors - a.visitors,
  },
}

export const MOODS: Mood[] = ['tenang', 'petualang', 'romantis', 'edukatif', 'seru']

export function getMoodMeta(mood: Mood) {
  const { emoji, label, description } = MOOD_MAP[mood]
  return { emoji, label, description }
}

export function filterByMood(destinations: Destination[], mood: Mood): Destination[] {
  const cfg = MOOD_MAP[mood]
  return destinations.filter(cfg.filter).sort(cfg.sort)
}
