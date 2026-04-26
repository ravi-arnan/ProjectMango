// Single source of truth for AI providers — imported by both the admin UI
// (src/pages/AiAgent.tsx) and the API routes (api/ai-analysis.ts, api/ai-test.ts).
// All providers listed here MUST be OpenAI-compatible (POST /chat/completions
// with the standard messages payload). Anthropic / non-compatible providers
// would need a separate code path and are not included.

export interface AiProvider {
  id: string
  label: string
  /** Base URL — `/chat/completions` is appended at request time. */
  baseUrl: string
  /** Hint shown in the API key input. */
  keyPlaceholder: string
  /** Where to get the key. */
  keyHelpUrl: string
  /** Suggested models for this provider. The user picks one from here. */
  models: { id: string; label: string; description: string }[]
}

export const AI_PROVIDERS: AiProvider[] = [
  {
    id: 'github-models',
    label: 'GitHub Models',
    baseUrl: 'https://models.inference.ai.azure.com',
    keyPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyHelpUrl: 'https://github.com/settings/personal-access-tokens',
    models: [
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Cepat & murah — default' },
      { id: 'gpt-4o', label: 'GPT-4o', description: 'Kualitas tertinggi dari OpenAI' },
      { id: 'o1-mini', label: 'o1-mini', description: 'Reasoning model, cocok untuk analisis' },
      { id: 'Meta-Llama-3.1-8B-Instruct', label: 'Llama 3.1 8B Instruct', description: 'Open-source, ringan' },
      { id: 'Mistral-Nemo', label: 'Mistral Nemo', description: 'Cepat, multibahasa' },
      { id: 'Phi-3.5-mini-instruct', label: 'Phi 3.5 Mini', description: 'SLM dari Microsoft' },
    ],
  },
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    keyPlaceholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyHelpUrl: 'https://platform.openai.com/api-keys',
    models: [
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Cepat & murah' },
      { id: 'gpt-4o', label: 'GPT-4o', description: 'Flagship multimodal' },
      { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini', description: 'Generasi 4.1, ringan' },
      { id: 'gpt-4.1', label: 'GPT-4.1', description: 'Kualitas tertinggi 4.1' },
      { id: 'o1-mini', label: 'o1-mini', description: 'Reasoning, lebih murah' },
      { id: 'o1', label: 'o1', description: 'Reasoning model penuh' },
    ],
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    keyPlaceholder: 'sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyHelpUrl: 'https://openrouter.ai/keys',
    models: [
      { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', description: 'Via OpenRouter' },
      { id: 'openai/gpt-4o', label: 'GPT-4o', description: 'Via OpenRouter' },
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', description: 'Anthropic via OR' },
      { id: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku', description: 'Cepat & murah' },
      { id: 'google/gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash', description: 'Google via OR' },
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B', description: 'Open weights' },
    ],
  },
  {
    id: 'groq',
    label: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    keyPlaceholder: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyHelpUrl: 'https://console.groq.com/keys',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', description: 'Fast inference' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', description: 'Sangat cepat' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', description: 'Konteks panjang' },
      { id: 'gemma2-9b-it', label: 'Gemma 2 9B', description: 'Google, ringan' },
    ],
  },
]

export const DEFAULT_PROVIDER_ID = 'github-models'

export function getProvider(id: string): AiProvider {
  return AI_PROVIDERS.find((p) => p.id === id) ?? AI_PROVIDERS[0]
}

export function getDefaultModel(providerId: string): string {
  return getProvider(providerId).models[0]?.id ?? 'gpt-4o-mini'
}

/** Returns `${baseUrl}/chat/completions` for a given provider id. */
export function chatCompletionsUrl(providerId: string): string {
  return `${getProvider(providerId).baseUrl}/chat/completions`
}
