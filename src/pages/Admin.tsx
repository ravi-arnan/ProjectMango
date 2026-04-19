import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import TagInput from '../components/admin/TagInput'
import { supabase } from '../lib/supabase'
import { showToast } from '../components/Toast'
import { AI_MODELS, DEFAULT_MODEL_ID } from '../data/aiModels'
import { useAuth } from '../context/AuthContext'

type Persona = 'informatif' | 'formal' | 'santai' | 'profesional'

interface AiSettings {
  default_model: string
  system_prompt: string
  greeting_message: string
  fallback_message: string
  suggested_prompts: string[]
  persona: Persona
  max_tokens: number
  temperature: number
  content_filter_enabled: boolean
  blocked_keywords: string[]
  refusal_message: string
  allow_anonymous_chat: boolean
}

const DEFAULT_SETTINGS: AiSettings = {
  default_model: DEFAULT_MODEL_ID,
  system_prompt: '',
  greeting_message: '',
  fallback_message: '',
  suggested_prompts: [],
  persona: 'informatif',
  max_tokens: 1024,
  temperature: 0.7,
  content_filter_enabled: true,
  blocked_keywords: [],
  refusal_message: '',
  allow_anonymous_chat: true,
}

const PERSONA_OPTIONS: { id: Persona; label: string; hint: string }[] = [
  { id: 'informatif', label: 'Informatif', hint: 'Netral, padat, data-driven' },
  { id: 'formal', label: 'Formal', hint: 'Bahasa sopan & baku' },
  { id: 'santai', label: 'Santai', hint: 'Akrab, boleh emoji' },
  { id: 'profesional', label: 'Profesional', hint: 'Ringkas seperti konsultan' },
]

export default function Admin() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<AiSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('ai_agent_settings')
      .select(
        'default_model, system_prompt, greeting_message, fallback_message, suggested_prompts, persona, max_tokens, temperature, content_filter_enabled, blocked_keywords, refusal_message, allow_anonymous_chat'
      )
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setError(error.message)
        } else if (data) {
          setSettings({
            default_model: data.default_model ?? DEFAULT_MODEL_ID,
            system_prompt: data.system_prompt ?? '',
            greeting_message: data.greeting_message ?? '',
            fallback_message: data.fallback_message ?? '',
            suggested_prompts: data.suggested_prompts ?? [],
            persona: (data.persona ?? 'informatif') as Persona,
            max_tokens: data.max_tokens ?? 1024,
            temperature: data.temperature ?? 0.7,
            content_filter_enabled: data.content_filter_enabled ?? true,
            blocked_keywords: data.blocked_keywords ?? [],
            refusal_message: data.refusal_message ?? '',
            allow_anonymous_chat: data.allow_anonymous_chat ?? true,
          })
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const patch = <K extends keyof AiSettings>(key: K, val: AiSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    if (!settings.refusal_message.trim()) {
      setError('Refusal message tidak boleh kosong.')
      return
    }
    setSaving(true)
    setError(null)
    const { error: updateError } = await supabase
      .from('ai_agent_settings')
      .update({
        default_model: settings.default_model,
        system_prompt: settings.system_prompt || null,
        greeting_message: settings.greeting_message || null,
        fallback_message: settings.fallback_message || null,
        suggested_prompts: settings.suggested_prompts,
        persona: settings.persona,
        max_tokens: settings.max_tokens,
        temperature: settings.temperature,
        content_filter_enabled: settings.content_filter_enabled,
        blocked_keywords: settings.blocked_keywords,
        refusal_message: settings.refusal_message,
        allow_anonymous_chat: settings.allow_anonymous_chat,
        updated_by: user?.id ?? null,
      })
      .eq('id', 1)
    setSaving(false)
    if (updateError) {
      setError(updateError.message)
      showToast('Gagal menyimpan setting', 'error')
    } else {
      showToast('Setting AI berhasil disimpan', 'success')
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-8 max-w-3xl">
      <header className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon name="admin_panel_settings" className="text-primary" size="24px" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-headline font-extrabold text-on-surface">
            Admin Panel
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Atur konfigurasi runtime untuk Mango. Perubahan berlaku tanpa redeploy.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="bg-surface-container-lowest rounded-3xl p-6 border border-stone-100 flex items-center gap-3 text-on-surface-variant text-sm">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Memuat setting...
        </div>
      ) : (
        <>
          {/* ===================== AI Agent Settings ===================== */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 lg:p-7 border border-stone-100 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" className="text-primary" size="20px" />
              <h2 className="text-lg font-headline font-bold text-on-surface">AI Agent Settings</h2>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface">Model default</span>
              <span className="text-xs text-on-surface-variant -mt-1">
                Model yang dipakai AI Analysis chatbot saat user bertanya.
              </span>
              <select
                value={settings.default_model}
                onChange={(e) => patch('default_model', e.target.value)}
                className="bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} — {m.description}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-on-surface">Max tokens</span>
                <span className="text-xs font-mono text-on-surface-variant">{settings.max_tokens}</span>
              </div>
              <input
                type="range"
                min={64}
                max={8192}
                step={64}
                value={settings.max_tokens}
                onChange={(e) => patch('max_tokens', Number(e.target.value))}
                className="accent-primary"
              />
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-on-surface">Temperature</span>
                <span className="text-xs font-mono text-on-surface-variant">
                  {settings.temperature.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={settings.temperature}
                onChange={(e) => patch('temperature', Number(e.target.value))}
                className="accent-primary"
              />
              <span className="text-xs text-on-surface-variant -mt-1">
                Rendah = lebih konsisten, tinggi = lebih kreatif.
              </span>
            </label>
          </section>

          {/* ===================== AI Prompt Settings ===================== */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 lg:p-7 border border-stone-100 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Icon name="prompt_suggestion" className="text-primary" size="20px" />
              <h2 className="text-lg font-headline font-bold text-on-surface">AI Prompt Settings</h2>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface">System prompt (opsional)</span>
              <span className="text-xs text-on-surface-variant -mt-1">
                Kosongkan untuk pakai prompt bawaan Mango AI.
              </span>
              <textarea
                value={settings.system_prompt}
                onChange={(e) => patch('system_prompt', e.target.value)}
                rows={6}
                placeholder="Kamu adalah Mango AI..."
                className="bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 font-mono resize-y"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface">Greeting message</span>
              <span className="text-xs text-on-surface-variant -mt-1">
                Pesan sambutan yang user lihat pertama kali membuka chatbot.
              </span>
              <textarea
                value={settings.greeting_message}
                onChange={(e) => patch('greeting_message', e.target.value)}
                rows={3}
                placeholder="Halo! Saya Mango AI..."
                className="bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface">Fallback message</span>
              <span className="text-xs text-on-surface-variant -mt-1">
                Ditampilkan kalau AI mengembalikan respons kosong.
              </span>
              <textarea
                value={settings.fallback_message}
                onChange={(e) => patch('fallback_message', e.target.value)}
                rows={2}
                placeholder="Maaf, saya tidak bisa memberikan respons..."
                className="bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface">Persona</span>
              <span className="text-xs text-on-surface-variant -mt-1">
                Gaya bicara bot — di-append ke system prompt saat request.
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {PERSONA_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => patch('persona', opt.id)}
                    className={`flex flex-col items-start text-left rounded-xl px-3 py-2.5 transition-colors ${
                      settings.persona === opt.id
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="text-sm font-semibold">{opt.label}</span>
                    <span
                      className={`text-[11px] ${
                        settings.persona === opt.id ? 'text-on-primary/80' : 'text-on-surface-variant/80'
                      }`}
                    >
                      {opt.hint}
                    </span>
                  </button>
                ))}
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface">Suggested prompts</span>
              <span className="text-xs text-on-surface-variant -mt-1">
                Chip saran pertanyaan di halaman AI Analysis. Tekan Enter atau koma untuk tambah.
              </span>
              <TagInput
                value={settings.suggested_prompts}
                onChange={(next) => patch('suggested_prompts', next)}
                placeholder="Ketik pertanyaan saran lalu Enter..."
                maxTagLength={120}
              />
            </label>
          </section>

          {/* ===================== AI Safeguard ===================== */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 lg:p-7 border border-stone-100 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Icon name="shield" className="text-primary" size="20px" />
              <h2 className="text-lg font-headline font-bold text-on-surface">AI Safeguard</h2>
            </div>

            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-on-surface block">
                  Content filter
                </span>
                <span className="text-xs text-on-surface-variant">
                  Tolak pesan user yang mengandung blocked keywords di bawah.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.content_filter_enabled}
                onChange={(e) => patch('content_filter_enabled', e.target.checked)}
                className="mt-1 w-5 h-5 accent-primary"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface">Blocked keywords</span>
              <span className="text-xs text-on-surface-variant -mt-1">
                Kata yang akan memicu refusal (case-insensitive, word-boundary match).
              </span>
              <TagInput
                value={settings.blocked_keywords}
                onChange={(next) => patch('blocked_keywords', next)}
                placeholder="Ketik keyword lalu Enter..."
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface">Refusal message</span>
              <span className="text-xs text-on-surface-variant -mt-1">
                Pesan yang dibalas bot ketika safeguard ter-trigger.
              </span>
              <textarea
                value={settings.refusal_message}
                onChange={(e) => patch('refusal_message', e.target.value)}
                rows={2}
                className="bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              />
            </label>

            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-on-surface block">
                  Izinkan tamu chat
                </span>
                <span className="text-xs text-on-surface-variant">
                  Jika dimatikan, guest (anonymous login) tidak bisa pakai AI Analysis.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.allow_anonymous_chat}
                onChange={(e) => patch('allow_anonymous_chat', e.target.checked)}
                className="mt-1 w-5 h-5 accent-primary"
              />
            </label>
          </section>

          {error && (
            <div className="bg-error-container text-on-error-container rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full text-sm flex items-center gap-2 disabled:opacity-60"
            >
              <Icon name={saving ? 'hourglass_top' : 'save'} size="18px" />
              {saving ? 'Menyimpan...' : 'Simpan semua perubahan'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
