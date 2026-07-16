import { useState } from 'react'
import { motion } from 'motion/react'
import { HelpCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { pageVariants } from '@/lib/transitions'
import { ModeToggle } from './ModeToggle'
import { Presentation } from '@/components/presentation/Presentation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface SectionShellProps {
  title: string
  subtitle: string
  icon: LucideIcon
  accent: string
  kicker: string                 // small category label above the title
  intro?: React.ReactNode        // explanatory lead block directly under the title
  help?: React.ReactNode         // Grundlagen/Notation — im „Hilfe“-Sheet statt unter dem Titel
  section?: string               // Abschnitts-Schlüssel für den Präsentations-Knopf (steps.tsx)
  modes?: boolean                // show Einfach/Erweitert toggle (default true)
  legend?: React.ReactNode
  children: React.ReactNode
}

export function SectionShell({
  title, subtitle, icon: Icon, accent, kicker,
  intro, help, section, modes = true, legend, children,
}: SectionShellProps) {
  const [helpOpen, setHelpOpen] = useState(false)
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Kompakter Kopf: eine Zeile Titel + Aktionen. */}
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
            {help && (
              <button
                onClick={() => setHelpOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                style={{ background: 'var(--card-bg)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
                title="Grundlagen und Notation dieses Abschnitts"
              >
                <HelpCircle size={14} /> Hilfe
              </button>
            )}
            {modes && <ModeToggle accent={accent} />}
            {section && <Presentation section={section} accent={accent} />}
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

      {help && (
        <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
          <DialogContent
            aria-describedby={undefined}
            className="sm:max-w-lg max-h-[82vh] overflow-y-auto rounded-2xl"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <HelpCircle size={17} style={{ color: accent }} /> {title} — Grundlagen
              </DialogTitle>
            </DialogHeader>
            <div className="mt-3 space-y-3">{help}</div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  )
}
