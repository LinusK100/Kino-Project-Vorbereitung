import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { pageVariants } from '@/lib/transitions'
import { ModeToggle } from './ModeToggle'
import { Presentation } from '@/components/presentation/Presentation'
import type { PresentationStep } from '@/types'

interface SectionShellProps {
  title: string
  subtitle: string
  icon: LucideIcon
  accent: string
  kicker: string                 // small category label above the title
  intro?: React.ReactNode        // explanatory lead block
  presentation?: PresentationStep[]
  modes?: boolean                // show Einfach/Erweitert toggle (default true)
  legend?: React.ReactNode
  children: React.ReactNode
}

export function SectionShell({
  title, subtitle, icon: Icon, accent, kicker,
  intro, presentation = [], modes = true, legend, children,
}: SectionShellProps) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Header band */}
      <div
        className="rounded-2xl p-5 md:p-6 mb-5 relative overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
        data-pres="section-header"
      >
        <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: accent }} />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${accent}18`, color: accent }}
            >
              <Icon size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-0.5" style={{ color: accent }}>
                {kicker}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {title}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {modes && <ModeToggle accent={accent} />}
            {presentation.length > 0 && <Presentation steps={presentation} accent={accent} />}
          </div>
        </div>

        {intro && <div className="mt-5">{intro}</div>}
      </div>

      {children}

      {legend && (
        <div className="mt-6 rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          {legend}
        </div>
      )}
    </motion.div>
  )
}
