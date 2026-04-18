import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { supabase } from '../lib/supabase'
import { showToast } from '../components/Toast'
import { AI_MODELS, DEFAULT_MODEL_ID } from '../data/aiModels'
import { useAuth } from '../context/AuthContext'

interface AiSettings {
  default_model: string
  system_prompt: string | null
  max_tokens: number
  temperature: number
}

const DEFAULT_SETTINGS: AiSettings = {
  default_model: DEFAULT_MODEL_ID,
  system_prompt: '',
  max_tokens: 1024,
  temperature: 0.7,
}

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
      .select('default_model, system_prompt, max_tokens, temperature')
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
            max_tokens: data.max_tokens ?? 1024,
            temperature: data.temperature ?? 0.7,
          })
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const { error: updateError } = await supabase
      .from('ai_agent_settings')
      .update({
        default_model: settings.default_model,
        system_prompt: settings.system_prompt || null,
        max_tokens: settings.max_tokens,
        temperature: settings.temperature,
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

      <section className="bg-surface-container-lowest rounded-3xl p-6 lg:p-7 border border-stone-100 shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Icon name="auto_awesome" className="text-primary" size="20px" />
          <h2 className="text-lg font-headline font-bold text-on-surface">AI Agent Settings</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 py-6 text-on-surface-variant text-sm">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Memuat setting...
          </div>
        ) : (
          <>
            {/* Model */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface">Model default</span>
              <span className="text-xs text-on-surface-variant -mt-1">
                Model yang dipakai AI Analysis chatbot saat user bertanya.
              </span>
              <select
                value={settings.default_model}
                onChange={(e) => setSettings({ ...settings, default_model: e.target.value })}
                className="bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} — {m.description}
                  </option>
                ))}
              </select>
            </label>

            {/* System prompt */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface">System prompt (opsional)</span>
              <span className="text-xs text-on-surface-variant -mt-1">
                Kosongkan untuk pakai prompt bawaan Mango AI.
              </span>
              <textarea
                value={settings.system_prompt ?? ''}
                onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
                rows={6}
                placeholder="Kamu adalah Mango AI..."
                className="bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 font-mono resize-y"
              />
            </label>

            {/* Max tokens */}
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
                onChange={(e) =>
                  setSettings({ ...settings, max_tokens: Number(e.target.value) })
                }
                className="accent-primary"
              />
            </label>

            {/* Temperature */}
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
                onChange={(e) =>
                  setSettings({ ...settings, temperature: Number(e.target.value) })
                }
                className="accent-primary"
              />
              <span className="text-xs text-on-surface-variant -mt-1">
                Rendah = lebih konsisten, tinggi = lebih kreatif.
              </span>
            </label>

            {error && (
              <div className="bg-error-container text-on-error-container rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full text-sm flex items-center gap-2 disabled:opacity-60"
              >
                <Icon name={saving ? 'hourglass_top' : 'save'} size="18px" />
                {saving ? 'Menyimpan...' : 'Simpan perubahan'}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
