export interface AiModelOption {
  id: string
  label: string
  description: string
}

export const AI_MODELS: AiModelOption[] = [
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    description: 'Cepat & murah — default',
  },
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    description: 'Kualitas tertinggi dari OpenAI',
  },
  {
    id: 'o1-mini',
    label: 'o1-mini',
    description: 'Reasoning model, cocok untuk analisis',
  },
  {
    id: 'Meta-Llama-3.1-8B-Instruct',
    label: 'Llama 3.1 8B Instruct',
    description: 'Open-source, ringan',
  },
  {
    id: 'Mistral-Nemo',
    label: 'Mistral Nemo',
    description: 'Cepat, multibahasa',
  },
  {
    id: 'Phi-3.5-mini-instruct',
    label: 'Phi 3.5 Mini',
    description: 'Small language model Microsoft',
  },
]

export const DEFAULT_MODEL_ID = 'gpt-4o-mini'
