import { Info, Lightbulb, AlertTriangle, FlaskConical } from 'lucide-react'

type CalloutKind = 'info' | 'idea' | 'warn' | 'concept'

const config: Record<CalloutKind, { icon: React.ElementType; color: string }> = {
  info: { icon: Info, color: '#006494' },
  idea: { icon: Lightbulb, color: '#d19900' },
  warn: { icon: AlertTriangle, color: '#a13544' },
  concept: { icon: FlaskConical, color: '#7a39bb' },
}

export function Callout({
  kind = 'info', title, children, className = '',
}: { kind?: CalloutKind; title?: string; children: React.ReactNode; className?: string }) {
  const { icon: Icon, color } = config[kind]
  return (
    <div
      className={`flex items-start gap-3 rounded-xl p-3.5 ${className}`}
      style={{ background: `${color}0f`, border: `1px solid ${color}33` }}
    >
      <Icon size={17} style={{ color, flexShrink: 0, marginTop: 1 }} />
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {title && <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{title}: </span>}
        {children}
      </div>
    </div>
  )
}
