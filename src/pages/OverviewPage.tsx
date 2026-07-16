// Dashboard mit zwei Gesichtern (Owner-Entscheidung 2026-07-15):
// Dunkel = „Kinosaal" (Leinwand, Sitzreihen, Filmstreifen — das gewählte Design),
// Hell = „Aurora" (weiche Farbflächen hinter Glas-Karten, aus dem Varianten-
// Archiv docs/DASHBOARD_VARIANTEN.md reaktiviert). Inhalte identisch.
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Braces, Layers, Presentation as PresentationIcon, Rocket } from 'lucide-react'
import { pageVariants } from '@/lib/transitions'
import { NAV } from '@/components/layout/nav'
import { Presentation } from '@/components/presentation/Presentation'
import { useAppStore } from '@/store/appStore'
import { innovation, personas, prototype, stories, storyMaps, uml, sequences, stateMachines } from '@/data/content'
import { extraMachines } from '@/data/statesExtra'
import { DreiStationen, JsonZuSvg, TeilmengeModi } from '@/components/presentation/visuals/product'
import type { PresentationStep } from '@/types'

const ACCENT = '#01696f'
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// Kennzahl je Abschnitt (Spannen = Einfach-/Erweitert-Modus), aus den Daten berechnet
const rollenLive = prototype.rollen.filter((r) => r.status === 'implementiert').length
const sectionStat: Record<string, string> = {
  '/personas': `${personas.basis.length}–${personas.erweitert.length}`,
  '/user-stories': `${stories.basis.length}–${stories.erweitert.length}`,
  '/story-map': `${storyMaps.basis.activities.length}–${storyMaps.erweitert.activities.length} Aktivitäten`,
  '/klassendiagramm': `${uml.classes.length} Klassen`,
  '/sequenzdiagramme': `${sequences.length} Flows`,
  '/zustandsdiagramme': `${stateMachines.machines.length}–${stateMachines.machines.length + extraMachines.length} Automaten`,
  '/prototyp': `${rollenLive} Rollen live`,
  '/innovation': `${innovation.innovations.length} Ideen`,
}

const groupIntro: Record<string, string> = {
  Anforderungen: 'Wer braucht was? Personas, ihre Stories und deren Ordnung nach Nutzerreise und Release.',
  Modellierung: 'Das System als UML: Struktur (Klassen), Abläufe (Sequenzen) und Lebenszyklen (Zustände).',
  Ergebnis: 'Der klickbare Prototyp des MVP – und recherchierte Ideen über ihn hinaus.',
}

const GROUPS = NAV.filter((g) => g.title !== 'Start' && !g.meta)

const HINWEISE = [
  {
    icon: PresentationIcon, accent: '#7a39bb', accentSaal: '#c894f5', title: 'Kino-Tour in jedem Abschnitt',
    text: 'Der „Präsentation"-Knopf oben rechts startet die animierte Vollbild-Tour des Abschnitts – weiter mit ← →, automatisch per Leertaste, Esc beendet.',
  },
  {
    icon: Braces, accent: '#006494', accentSaal: '#63c1f5', title: 'Alle Daten als JSON',
    text: 'Personas, Stories, UML und Zustände liegen als strukturierte JSON-Dateien vor – die Datengrundlage für die spätere Umsetzung. Die Diagramme werden daraus live als SVG gerendert.',
  },
  {
    icon: Layers, accent: '#964219', accentSaal: '#f5a068', title: 'Einfach & Erweitert',
    text: 'Anforderungen und Modellierung haben zwei Detailgrade – umschaltbar oben rechts in jedem Abschnitt. Die Basis ist immer eine echte Teilmenge des Vollausbaus.',
  },
]

const tourSteps: PresentationStep[] = [
  {
    id: 'aufbau', title: 'Von der Idee zur klickbaren App', visual: <DreiStationen />,
    body: 'CineTicket ist ein Kino-Ticketsystem für „Systemanalyse und Entwurf". Die Website folgt dem Weg der Systementwicklung: Aus den Anforderungen entstehen die Modelle, aus den Modellen der Prototyp – jede Station baut auf der vorigen auf.',
  },
  {
    id: 'json', title: 'Alle Inhalte sind JSON-Daten', visual: <JsonZuSvg />,
    body: 'Von den Personas bis zu den Zustandsautomaten liegt jeder Inhalt als strukturierte JSON-Datei vor. Die Diagramme werden daraus live als SVG gerendert – konsistent, interaktiv und jederzeit prüfbar.',
  },
  {
    id: 'modi', title: 'Einfach ⊂ Erweitert', visual: <TeilmengeModi />,
    body: 'Anforderungen und Modellierung haben zwei Detailgrade: Einfach zeigt den MVP-Kern, Erweitert den Vollausbau – die Basis ist immer eine echte Teilmenge. Prototyp und Innovation zeigen immer alles.',
  },
  {
    id: 'ergebnis', title: 'Das Ergebnis: der klickbare Prototyp', visual: <DreiStationen />,
    body: 'Am Ende steht die echte App: Der Kunde bucht im Wizard, die Kasse verkauft im Schnellmodus, der Manager sieht Umsatz und Auslastung, das Einlasspersonal scannt QR-Codes. Der Abschnitt „Prototyp" startet sie mit einem Klick – was darüber hinausgeht, ist im Modell als Roadmap verortet.',
  },
  {
    id: 'praes', title: 'Präsentationsmodus',
    body: 'Jeder Abschnitt erklärt seine wichtigsten Inhalte in einer solchen Kino-Tour – mit echten Ausschnitten aus den Diagrammen. Weiter per Pfeiltasten, automatisch mit einstellbarem Tempo, Esc beendet.',
  },
]

// gestaffeltes Einblenden (beide Ansichten)
function useEnter() {
  const reduce = useReducedMotion()
  return (delay: number) => reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 } }
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.5, ease: EASE } }
}

export default function OverviewPage() {
  const { theme } = useAppStore()
  return theme === 'dark' ? <SaalAnsicht /> : <AuroraAnsicht />
}

// ── Dunkel: der Kinosaal ──
function SaalAnsicht() {
  const enter = useEnter()
  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="-m-4 md:-m-6 min-h-full relative overflow-hidden"
      style={{ background: 'radial-gradient(120% 90% at 50% 0%, #14141d 0%, #0b0b11 55%, #060608 100%)' }}
    >
      {/* Projektor-Lichtkegel auf die Leinwand */}
      <div
        aria-hidden className="absolute pointer-events-none"
        style={{
          top: -180, left: '50%', transform: 'translateX(-50%)',
          width: 900, height: 420, filter: 'blur(70px)',
          background: `radial-gradient(closest-side, ${ACCENT}38, transparent)`,
        }}
      />

      <div className="relative max-w-4xl mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-12">
        {/* Leinwand */}
        <motion.div {...enter(0)}>
          <div
            className="rounded-xl px-6 py-10 md:px-12 md:py-14 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #23232e 0%, #191922 100%)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: `0 30px 80px -30px ${ACCENT}66, inset 0 1px 0 rgba(255,255,255,0.08)`,
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Systemanalyse &amp; Entwurf präsentiert
            </p>
            <h1
              className="font-bold text-white leading-none mb-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 7vw, 4.2rem)', textShadow: `0 0 60px ${ACCENT}88` }}
            >
              CineTicket
            </h1>
            <p className="text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.66)' }}>
              Ein Kino-Ticketsystem – von der Anforderungsanalyse über die UML-Modelle bis zum klickbaren Prototyp.
            </p>
          </div>

          {/* Sitzreihen vor der Leinwand */}
          <div aria-hidden className="mt-5 space-y-1.5 select-none">
            {[0.3, 0.22, 0.14].map((op, row) => (
              <div key={row} className="flex justify-center gap-1.5" style={{ opacity: op, transform: `scale(${1 + row * 0.045})` }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i} className="w-4 h-2.5 rounded-t-md" style={{ background: '#8b93a8' }} />
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div {...enter(0.15)} className="flex items-center justify-center gap-2.5 mt-8 flex-wrap">
          <Presentation steps={tourSteps} accent={ACCENT} title="Überblick" label="Tour starten" />
          <Link
            to="/prototyp"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-colors hover:bg-white/15"
            style={{ border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <Rocket size={14} /> Zum Prototyp
          </Link>
        </motion.div>

        {/* So funktioniert diese Website — direkt sichtbar, nicht erst in der Tour */}
        <motion.div {...enter(0.26)} className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-10">
          {HINWEISE.map((h) => (
            <div key={h.title} className="rounded-xl p-4" style={{ background: '#15151d', border: '1px solid rgba(255,255,255,0.09)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${h.accentSaal}1f`, color: h.accentSaal }}>
                  <h.icon size={15} />
                </span>
                <h4 className="text-sm font-semibold text-white/90">{h.title}</h4>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{h.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Filmstreifen mit den drei Stationen */}
        <motion.div {...enter(0.38)} className="mt-4 rounded-lg overflow-hidden" style={{ background: '#101016', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Sprockets />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {GROUPS.map((group) => (
              <div key={group.title} className="p-5" style={{ background: '#15151d' }}>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: group.items[0].accent, filter: 'brightness(1.6)' }}>
                  {group.title}
                </h4>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{groupIntro[group.title]}</p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.path} to={item.path}
                        className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg group transition-colors hover:bg-white/[0.06]"
                      >
                        <Icon size={15} style={{ color: item.accent, filter: 'brightness(1.6)' }} />
                        <span className="text-sm font-medium flex-1 text-white/90">{item.label}</span>
                        <span className="text-[11px] tabular-nums text-white/40">{sectionStat[item.path]}</span>
                        <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1 text-white/70" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <Sprockets />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Perforationslöcher des Filmstreifens
function Sprockets() {
  return (
    <div aria-hidden className="flex justify-between px-3 py-2" style={{ background: '#101016' }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <span key={i} className="w-2.5 h-2 rounded-[3px] hidden sm:block" style={{ background: 'rgba(255,255,255,0.13)' }} />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={`m${i}`} className="w-2.5 h-2 rounded-[3px] sm:hidden" style={{ background: 'rgba(255,255,255,0.13)' }} />
      ))}
    </div>
  )
}

// ── Hell: Aurora — weiche Farbflächen hinter Glas ──
const glas = {
  background: 'rgba(255,255,255,0.6)',
  border: '1px solid rgba(255,255,255,0.9)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  boxShadow: '0 8px 32px rgba(31,59,84,0.09)',
} as const

function AuroraAnsicht() {
  const enter = useEnter()
  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="-m-4 md:-m-6 min-h-full relative overflow-hidden"
      style={{ background: '#f4f4f2' }}
    >
      {/* Aurora-Flächen */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{ width: 560, height: 560, top: -180, left: '8%', background: ACCENT, opacity: 0.2, filter: 'blur(130px)' }} />
        <div className="absolute rounded-full" style={{ width: 480, height: 480, top: 60, right: '-6%', background: '#7a39bb', opacity: 0.16, filter: 'blur(140px)' }} />
        <div className="absolute rounded-full" style={{ width: 520, height: 520, bottom: -220, left: '34%', background: '#006494', opacity: 0.18, filter: 'blur(150px)' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-12">
        {/* Held */}
        <motion.div {...enter(0)} className="rounded-3xl px-6 py-10 md:px-12 md:py-12 text-center" style={glas}>
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] mb-4" style={{ color: 'var(--text-secondary)' }}>
            Systemanalyse &amp; Entwurf präsentiert
          </p>
          <h1
            className="font-bold leading-none mb-3"
            style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 7vw, 4.2rem)',
              background: `linear-gradient(100deg, ${ACCENT}, #006494 55%, #7a39bb)`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}
          >
            CineTicket
          </h1>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>
            Ein Kino-Ticketsystem – von der Anforderungsanalyse über die UML-Modelle bis zum klickbaren Prototyp.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div {...enter(0.15)} className="flex items-center justify-center gap-2.5 mt-7 flex-wrap">
          <Presentation steps={tourSteps} accent={ACCENT} title="Überblick" label="Tour starten" />
          <Link
            to="/prototyp"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:-translate-y-0.5"
            style={{ ...glas, color: 'var(--text-primary)' }}
          >
            <Rocket size={14} style={{ color: '#964219' }} /> Zum Prototyp
          </Link>
        </motion.div>

        {/* So funktioniert diese Website — direkt sichtbar, nicht erst in der Tour */}
        <motion.div {...enter(0.26)} className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-10">
          {HINWEISE.map((h) => (
            <div key={h.title} className="rounded-2xl p-4" style={glas}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${h.accent}16`, color: h.accent }}>
                  <h.icon size={15} />
                </span>
                <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{h.title}</h4>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{h.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Die drei Stationen als Glas-Panels */}
        <motion.div {...enter(0.38)} className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {GROUPS.map((group) => (
            <div key={group.title} className="rounded-2xl p-5 transition-transform hover:-translate-y-1" style={glas}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: group.items[0].accent }}>{group.title}</h4>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{groupIntro[group.title]}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path} to={item.path}
                      className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg group transition-colors hover:bg-black/[0.04]"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Icon size={15} style={{ color: item.accent }} />
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>{sectionStat[item.path]}</span>
                      <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" style={{ color: item.accent }} />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
