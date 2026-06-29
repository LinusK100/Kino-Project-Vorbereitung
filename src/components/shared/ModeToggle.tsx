import { Layers, Layers3 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import type { Mode } from '@/types'

const options: { value: Mode; label: string; icon: React.ElementType; hint: string }[] = [
  { value: 'einfach', label: 'Einfach', icon: Layers, hint: 'Grundlegende Informationen (Basis / MVP)' },
  { value: 'erweitert', label: 'Erweitert', icon: Layers3, hint: 'Ausführliche Variante (Vollausbau)' },
]

export function ModeToggle({ accent = '#01696f' }: { accent?: string }) {
  const { mode, setMode } = useAppStore()
  return (
    <div
      className="inline-flex p-0.5 rounded-full"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
      role="radiogroup"
      aria-label="Detailgrad"
      data-pres="mode-toggle"
    >
      {options.map(({ value, label, icon: Icon, hint }) => {
        const on = mode === value
        return (
          <button
            key={value}
            onClick={() => setMode(value)}
            role="radio"
            aria-checked={on}
            title={hint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: on ? accent : 'transparent',
              color: on ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
