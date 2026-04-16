import { type ReactNode } from 'react'
import Icon from './Icon'

interface Props {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function SettingsModal({ title, isOpen, onClose, children }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[390px] lg:max-w-md bg-surface-container-lowest rounded-t-3xl lg:rounded-3xl p-6 max-h-[80vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-on-surface font-headline">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-full">
            <Icon name="close" size="20px" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
