export interface Destination {
  id: string
  name: string
  location: string
  region: string
  category: string
  distance: string
  density: number
  densityLabel: 'Sangat Ramai' | 'Ramai' | 'Sedang' | 'Sepi'
  visitors: number
  maxCapacity: number
  rating: number
  reviewCount: number
  openHours: string
  ticketPrice: string
  parking: string
  lat: number
  lng: number
  image: string
  description: string
}

export const destinations: Destination[] = [
  {
    id: 'tanah-lot',
    name: 'Tanah Lot',
    location: 'Tabanan',
    region: 'Tabanan, Bali',
    category: 'Pura',
    distance: '18km',
    density: 0.87,
    densityLabel: 'Sangat Ramai',
    visitors: 1248,
    maxCapacity: 1500,
    rating: 4.5,
    reviewCount: 1284,
    openHours: '06.00 - 19.00',
    ticketPrice: 'Rp 60.000',
    parking: 'Tersedia (Penuh)',
    lat: -8.6212,
    lng: 115.0868,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQZrkgR9E8aRTbbl2lzoV3nu0Dzn7NKA7v6W8NR5Stvcu-r73ly8vaq19HsCEJoEf0IX-jcz4U-htDzF5z7RUnC_qi6Eyk7o8ut2PUvmA9lvqYMXNXTXwUH4gQ4nmZ6giUW6teZIbEzhUTJkqGpfWM0xg8BAq1qX8Uo39bfNtIUGlrV6QK_qE4wzVr5-Wc3eh8yO2qO2eEq9kf4lmNd7o4dPZdJBR80IWol_0y3B-tVusuHLO528WS1jeaAIxGasz8OGeZ3tDdkkbG',
    description: 'Situs Budaya & Keindahan Pesisir',
  },
  {
    id: 'uluwatu',
    name: 'Uluwatu',
    location: 'Badung',
    region: 'Pecatu, Badung',
    category: 'Pura',
    distance: '22km',
    density: 0.85,
    densityLabel: 'Sangat Ramai',
    visitors: 4821,
    maxCapacity: 5500,
    rating: 4.7,
    reviewCount: 2156,
    openHours: '07.00 - 19.00',
    ticketPrice: 'Rp 50.000',
    parking: 'Tersedia',
    lat: -8.8291,
    lng: 115.0849,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF4oacVI2oNDBhKrKKx6XnxC3RY1U-Lbid1sQ-Y1zhyENTJw8QKj4z2YBwNP1BcGSV9lMRep8kyxWxdQ5fTGpmZqaYBEvmH6H_wG62x2fVIsjdRTYLGTgBCeC52UV8UoFXxPdV_ttwz9X3ftAJuf6LCf5FwozQ1HNpqVESrZri6ZXPQe8-J91Hyj4P2C_OI1C-xjgaOVTb9Ipcu8254RV8WdXnRA5Qsg-9ejPWngj_3bmWkA88BsCGPQi3yoU30fwTiJx7CofBUBLk',
    description: 'Pura Luhur dengan pemandangan tebing dramatis',
  },
  {
    id: 'kuta-beach',
    name: 'Kuta Beach',
    location: 'Badung',
    region: 'Kuta, Badung',
    category: 'Pantai',
    distance: '5km',
    density: 0.95,
    densityLabel: 'Sangat Ramai',
    visitors: 6200,
    maxCapacity: 7000,
    rating: 4.2,
    reviewCount: 3890,
    openHours: '24 Jam',
    ticketPrice: 'Gratis',
    parking: 'Berbayar',
    lat: -8.7176,
    lng: 115.1695,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJAJp3zjgvjC4xuZjO8sqQbejba-AnDnS1NV7-91zMBbSZ7g327NAJ0IjtyWEwgbKgFna8PsNYWF8XgeSPksXyLvTzBQb2Zg4s7iDts2Ku-FwlE4aGWWfEtxk2iiwn30Ey650OmeYSh_8EMGlfaqA7VK3HPINC_NeRck1yQ7bVscBr1AxUeeJriGEmgzN-YmCNW4d2PvVLXQuuyzh9DiK6zi0k8pYvZjP2SrL4Vrro0Awb_I8-XmPNCeY558ljg53iKn0dUBMvMzwc',
    description: 'Pantai ikonik untuk surfing dan sunset',
  },
  {
    id: 'bedugul',
    name: 'Bedugul',
    location: 'Tabanan',
    region: 'Tabanan, Bali',
    category: 'Alam',
    distance: '45km',
    density: 0.22,
    densityLabel: 'Sepi',
    visitors: 420,
    maxCapacity: 2000,
    rating: 4.8,
    reviewCount: 980,
    openHours: '07.00 - 18.00',
    ticketPrice: 'Rp 75.000',
    parking: 'Luas',
    lat: -8.2835,
    lng: 115.1677,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOiPb4R_lTPY_1v0Bnqtuwp0PkLxJyGhONL3Dsvdg4usHWy5OWuTNBLi6eDlULDkFbE-YaaxTIyRG73HKci6HHQa_MRK2e6OJ_DA7BY33b36KQS3YY9sQ-roxZrd76W7hz-pJoT8LarVyZt9PZgbF5WjBiBFYmjnsMeGsPCoaPUUzj4cXJ4fcWlWXarc0ax92-pJOukDf6QmV05UUbWqWFEw9wNbyC1KMqVFhAJwq7Tsr7mzDSqcPeId60ySMS4S6qiwnJypIe2_LG',
    description: 'Danau dan pura di pegunungan yang sejuk',
  },
  {
    id: 'sanur',
    name: 'Sanur Beach',
    location: 'Denpasar',
    region: 'Denpasar, Bali',
    category: 'Pantai',
    distance: '12km',
    density: 0.29,
    densityLabel: 'Sepi',
    visitors: 580,
    maxCapacity: 2000,
    rating: 4.6,
    reviewCount: 1540,
    openHours: '24 Jam',
    ticketPrice: 'Gratis',
    parking: 'Tersedia',
    lat: -8.6783,
    lng: 115.2631,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsXSktpF3R6KkvhXzlAB8uQuGxq2iw7cy5ThjZqShUKo-GdCAqFcxJuC-QyrOEuNMQ1xFZuadYwgavd0J_c01cTa9Epg8TTaxL91OrXXrOPanHhCCTuubbeYomCoTqpXPs4k1bX1YodFFom2o40t5_f5J78d0k-SRIg-0dlWW9EeCdSa6-YfiHpmEJ9ErVYTITCZIoU4qkbDTfNQREO3a_VHng2iSQbWqU25jcTH5isZoubzCdBf_AAcR6g97S6kC2bqD7m7HSV_Km',
    description: 'Pantai tenang untuk sunrise dan budaya lokal',
  },
  {
    id: 'ubud-monkey-forest',
    name: 'Ubud Monkey Forest',
    location: 'Gianyar',
    region: 'Ubud, Gianyar',
    category: 'Alam',
    distance: '25km',
    density: 0.45,
    densityLabel: 'Sedang',
    visitors: 1205,
    maxCapacity: 2800,
    rating: 4.5,
    reviewCount: 4200,
    openHours: '08.30 - 18.00',
    ticketPrice: 'Rp 80.000',
    parking: 'Tersedia',
    lat: -8.5188,
    lng: 115.2585,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo6aKGaGU92q0xYEQ_QqBmxMDrcUuvJUoTh9qV4p8ZbVglihhmVeVSj566VKf2HICoufCLyPKeRPh_WTKzOe5aLZ_5BPVeoTU5V2pyMioOTfcMKRgVbqoFaPc7vSo-S7OCBG326fQeTX0rEqKGKHco6eciD1dgAF3xsadpi_2GYwfTMVIkSHMA2B2EVjIxDXDEDSx70QJI1R6f5NEsK5OM8jmFHHyU6_XCz_XKLMyEhT5us9D7Q5nWV1VOxZr7nVvZjFEnPOMjiwsO',
    description: 'Hutan sakral dengan ratusan monyet ekor panjang',
  },
  {
    id: 'tegalalang',
    name: 'Tegalalang Rice Terrace',
    location: 'Gianyar',
    region: 'Ubud, Gianyar',
    category: 'Alam',
    distance: '28km',
    density: 0.62,
    densityLabel: 'Ramai',
    visitors: 1890,
    maxCapacity: 3000,
    rating: 4.6,
    reviewCount: 2890,
    openHours: '07.00 - 18.00',
    ticketPrice: 'Rp 25.000',
    parking: 'Tersedia',
    lat: -8.4328,
    lng: 115.2789,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo6aKGaGU92q0xYEQ_QqBmxMDrcUuvJUoTh9qV4p8ZbVglihhmVeVSj566VKf2HICoufCLyPKeRPh_WTKzOe5aLZ_5BPVeoTU5V2pyMioOTfcMKRgVbqoFaPc7vSo-S7OCBG326fQeTX0rEqKGKHco6eciD1dgAF3xsadpi_2GYwfTMVIkSHMA2B2EVjIxDXDEDSx70QJI1R6f5NEsK5OM8jmFHHyU6_XCz_XKLMyEhT5us9D7Q5nWV1VOxZr7nVvZjFEnPOMjiwsO',
    description: 'Sawah terasering ikonik dengan pemandangan lembah',
  },
  {
    id: 'pandawa',
    name: 'Pantai Pandawa',
    location: 'Badung',
    region: 'Kutuh, Badung',
    category: 'Pantai',
    distance: '20km',
    density: 0.20,
    densityLabel: 'Sepi',
    visitors: 840,
    maxCapacity: 4000,
    rating: 4.4,
    reviewCount: 1250,
    openHours: '07.00 - 18.00',
    ticketPrice: 'Rp 20.000',
    parking: 'Luas',
    lat: -8.8451,
    lng: 115.1866,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJAJp3zjgvjC4xuZjO8sqQbejba-AnDnS1NV7-91zMBbSZ7g327NAJ0IjtyWEwgbKgFna8PsNYWF8XgeSPksXyLvTzBQb2Zg4s7iDts2Ku-FwlE4aGWWfEtxk2iiwn30Ey650OmeYSh_8EMGlfaqA7VK3HPINC_NeRck1yQ7bVscBr1AxUeeJriGEmgzN-YmCNW4d2PvVLXQuuyzh9DiK6zi0k8pYvZjP2SrL4Vrro0Awb_I8-XmPNCeY558ljg53iKn0dUBMvMzwc',
    description: 'Pantai tersembunyi di balik tebing kapur',
  },
  {
    id: 'besakih',
    name: 'Pura Besakih',
    location: 'Karangasem',
    region: 'Karangasem, Bali',
    category: 'Pura',
    distance: '60km',
    density: 0.65,
    densityLabel: 'Ramai',
    visitors: 2150,
    maxCapacity: 3500,
    rating: 4.7,
    reviewCount: 1870,
    openHours: '08.00 - 18.00',
    ticketPrice: 'Rp 60.000',
    parking: 'Tersedia',
    lat: -8.3734,
    lng: 115.4519,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbQfi27NFTfteC2LctoCcpeoLAJoUG8L3lL0m9FZamo6PR_pqCWfcKHR_vrp0kfuBcOsCGU3HekB5ZCMgzFXPi3tZrv4JziuzTx0IY-kEOg9mb_zQ9IvXvvc3hLrxy9v4ARN5QLFbpczw8YQIIBi7xZtSQjyZhM9ppCghfonLM9N-_0b0FZc3XMvbBTCVt80uKB49HkDtV6AWfVh9LTdwR3QHXNE4rQzhw_3AU6nmQqX-jnaOEVaZVvEjThfXBYIfrH1uXvEkC7i5o',
    description: 'Pura terbesar dan terpenting di Bali',
  },
  {
    id: 'kintamani',
    name: 'Kintamani',
    location: 'Bangli',
    region: 'Bangli, Bali',
    category: 'Alam',
    distance: '50km',
    density: 0.35,
    densityLabel: 'Sepi',
    visitors: 950,
    maxCapacity: 3000,
    rating: 4.6,
    reviewCount: 1620,
    openHours: '08.00 - 17.00',
    ticketPrice: 'Rp 30.000',
    parking: 'Tersedia',
    lat: -8.2435,
    lng: 115.3341,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGoIERpUtFD80NrpYXbHt1L8KFSeSCQ9jaj-UhisYv_ZbEJx_jwzXnU8FzG_UqQ9a416FpntY8OoIoJazyrU7Kke2xLNJ-lkBX5A0GbSglkHz12alSqWGvBaQ_az6JKHuDU3Q0EOgR_aO1zWs3HGvxk8-ImNPlKmPdXYEzLQbdJoeFJDMNX4-_ldo4Mv7qYMlIqLcWSVq90wEt-HAnTOyYKK-bQCWgrlL2V4tBH5Bliky9M6FD3W4N-iuCWkiZzFXDAePNARcX4h7U',
    description: 'Pemandangan Gunung Batur dan Danau Batur',
  },
]

export function getDensityColor(density: number): string {
  if (density > 0.8) return 'error'
  if (density > 0.6) return 'tertiary'
  if (density > 0.3) return 'amber-500'
  return 'primary'
}

export function getDensityBgColor(density: number): string {
  if (density > 0.8) return 'bg-error'
  if (density > 0.6) return 'bg-tertiary'
  if (density > 0.3) return 'bg-amber-500'
  return 'bg-primary'
}

export function getDensityTextColor(density: number): string {
  if (density > 0.8) return 'text-error'
  if (density > 0.6) return 'text-tertiary'
  if (density > 0.3) return 'text-amber-600'
  return 'text-primary'
}
