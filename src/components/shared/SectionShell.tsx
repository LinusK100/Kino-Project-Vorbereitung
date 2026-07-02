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
      {/* Kompakter Kopf: eine Zeile Titel + Aktionen, darunter die Einleitung.
          Bewusst keine Karte — der Blick soll auf den Inhalt fallen. */}
      <header className="mb-4" data-pres="section-header">
        <div className="flex items-center justify-between gap-x-3 gap-y-2 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${accent}16`, color: accent }}
            >
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-[22px] font-bold leading-tight truncate" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {title}
              </h1>
              <p className="text-[12.5px] leading-snug truncate" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-semibold" style={{ color: accent }}>{kicker}</span>
                <span className="mx-1.5 opacity-50">·</span>
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {modes && <ModeToggle accent={accent} />}
            {presentation.length > 0 && <Presentation steps={presentation} accent={accent} title={title} />}
          </div>
        </div>

        {intro && <div className="mt-3.5">{intro}</div>}
      </header>

      {children}

      {legend && (
        <div className="mt-6 rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          {legend}
        </div>
      )}
    </motion.div>
  )
}
