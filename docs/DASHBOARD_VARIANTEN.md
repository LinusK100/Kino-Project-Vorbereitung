# Dashboard-Varianten — Design-Archiv

Bei der Dashboard-Neugestaltung (2026-07-14) entstanden fünf Varianten;
**gewählt wurde „Kino"** (dunkler Saal, Leinwand, Filmstreifen — jetzt fest in
`src/pages/OverviewPage.tsx`). Die zwei stärksten unterlegenen Entwürfe sind
hier vollständig gesichert und können jederzeit wiederhergestellt werden.

> **Update 2026-07-15:** „Aurora" ist kein reines Archiv mehr — das Dashboard
> ist seitdem theme-abhängig: Dunkel = „Kino", **Hell = „Aurora"-Optik**
> (Farbflächen + Glas, in `OverviewPage.tsx` als `AuroraAnsicht` adaptiert,
> mit den aktuellen Inhalten: Erklär-Karten, Abschnitts-Kennzahlen, ohne
> Kennzahlen-Zeile im Held). Der Original-Entwurf unten bleibt als Referenz.

Beide Varianten waren fertig gebaut und verifiziert (Build/Lint grün,
Hell/Dunkel per Playwright, 0 Konsolenfehler). Zahlen kamen durchgehend
berechnet aus `src/data` (keine hartkodierten Fakten), Bewegung respektierte
`prefers-reduced-motion`.

---

## Variante „Graph" — die Zusammenhänge als animiertes Netz

**Konzept:** Die acht Abschnitte als Knoten in drei Spalten (Anforderungen /
Modellierung / Ergebnis). Die Kanten sind die echten Traceability-Beziehungen
des Projekts („1 Persona je Story", „Status-Enums ≙ Automaten",
„41 Klassen implementiert", „17 von 51 Stories klickbar" …).

**Animation:**
- Beim Laden zeichnen sich die Kanten gestaffelt (motion `pathLength` 0→1).
- Danach wandern kleine Punkte in der Akzentfarbe des Quellknotens als
  „Datenfluss" endlos an den Kanten entlang (SMIL `animateMotion`; erst nach
  ~1,4 s eingeblendet, weil wartende SMIL-Kreise sonst im viewBox-Ursprung
  sichtbar sind; negatives `begin` verteilt die Punkte sofort auf der Strecke).
- Hover auf einen Knoten hebt seine Kanten/Nachbarn hervor und dimmt den Rest;
  Klick (oder Enter/Leertaste) navigiert in den Abschnitt.

**Layout/Technik:** Reines SVG (`viewBox 0 0 1000 640`), Knoten = rounded
Rects mit CSS-Variablen (`var(--card-bg)` etc.) → Hell/Dunkel automatisch;
Kantenlabels mit `paintOrder: stroke` freigestellt. Hintergrund flächig
`var(--sidebar-bg)` statt Karo.

### Quellcode `src/pages/overview/VarianteGraph.tsx`

```tsx
// Variante 2 „Graph": die acht Abschnitte als animiertes Netz — die Kanten
// sind die echten Traceability-Beziehungen, kleine Punkte wandern als
// „Datenfluss" an ihnen entlang. Hover hebt die Nachbarschaft hervor.
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Rocket } from 'lucide-react'
import { pageVariants } from '@/lib/transitions'
import { Presentation } from '@/components/presentation/Presentation'
import { NAV } from '@/components/layout/nav'
import { ACCENT, heroStats, sectionStat, tourSteps } from './shared'

const ITEMS = NAV.flatMap((g) => g.items).filter((i) => i.path !== '/')
const byPath = Object.fromEntries(ITEMS.map((i) => [i.path, i]))

// Layout im viewBox-Raster 1000×640 (Knoten-Mittelpunkte)
const NW = 108 // halbe Knotenbreite
const NH = 30  // halbe Knotenhöhe
const POS: Record<string, { x: number; y: number }> = {
  '/personas': { x: 170, y: 120 },
  '/user-stories': { x: 170, y: 300 },
  '/story-map': { x: 170, y: 480 },
  '/klassendiagramm': { x: 500, y: 120 },
  '/sequenzdiagramme': { x: 500, y: 300 },
  '/zustandsdiagramme': { x: 500, y: 480 },
  '/prototyp': { x: 830, y: 200 },
  '/innovation': { x: 830, y: 440 },
}

interface Edge { from: string; to: string; label: string; d: string; lx: number; ly: number }
const EDGES: Edge[] = [
  { from: '/personas', to: '/user-stories', label: '1 Persona je Story', d: 'M 170 152 L 170 268', lx: 170, ly: 215 },
  { from: '/user-stories', to: '/story-map', label: 'nach Nutzerreise geordnet', d: 'M 170 332 L 170 448', lx: 170, ly: 395 },
  { from: '/user-stories', to: '/klassendiagramm', label: 'modelliert in UML-Klassen', d: 'M 280 288 Q 360 210 390 138', lx: 342, ly: 200 },
  { from: '/klassendiagramm', to: '/sequenzdiagramme', label: 'Methoden = Aufrufe', d: 'M 500 152 L 500 268', lx: 500, ly: 215 },
  { from: '/sequenzdiagramme', to: '/zustandsdiagramme', label: 'löst Statuswechsel aus', d: 'M 500 332 L 500 448', lx: 500, ly: 395 },
  { from: '/klassendiagramm', to: '/zustandsdiagramme', label: 'Status-Enums ≙ Automaten', d: 'M 405 148 Q 322 300 405 452', lx: 344, ly: 262 },
  { from: '/klassendiagramm', to: '/prototyp', label: '41 Klassen implementiert', d: 'M 610 132 Q 680 150 722 185', lx: 694, ly: 130 },
  { from: '/user-stories', to: '/prototyp', label: '17 von 51 Stories klickbar', d: 'M 200 334 Q 500 780 780 234', lx: 500, ly: 566 },
  { from: '/klassendiagramm', to: '/innovation', label: 'Ideen erweitern das Modell', d: 'M 600 148 Q 760 240 812 408', lx: 742, ly: 262 },
]

export default function VarianteGraph() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const [hover, setHover] = useState<string | null>(null)

  // Fluss-Punkte erst zeigen, wenn die Kanten fertig gezeichnet sind
  // (SMIL-Kreise stünden sonst wartend in der Ecke des viewBox)
  const [dots, setDots] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setDots(true), 1400)
    return () => window.clearTimeout(id)
  }, [])

  const connected = (path: string) => EDGES.some((e) => (e.from === hover || e.to === hover) && (e.from === path || e.to === path))
  const nodeDim = (path: string) => hover !== null && hover !== path && !connected(path)
  const edgeActive = (e: Edge) => hover !== null && (e.from === hover || e.to === hover)
  const edgeDim = (e: Edge) => hover !== null && !edgeActive(e)

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="-m-4 md:-m-6 min-h-full"
      style={{ background: 'var(--sidebar-bg)' }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">
        {/* Kopf */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-2">
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: ACCENT }}>Systemanalyse &amp; Entwurf</p>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              CineTicket – ein Kino-Ticketsystem
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Alles hängt zusammen: {heroStats.join(' · ')} – jede Kante unten ist eine echte Beziehung.
            </p>
          </div>
          <div className="flex items-center gap-2 pb-1">
            <Presentation steps={tourSteps} accent={ACCENT} title="Überblick" label="Tour starten" />
            <Link
              to="/prototyp"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            >
              <Rocket size={14} style={{ color: '#964219' }} /> Zum Prototyp
            </Link>
          </div>
        </div>

        {/* Netz */}
        <svg viewBox="0 0 1000 640" className="w-full h-auto" role="img" aria-label="Zusammenhänge der Abschnitte: von den Anforderungen über die Modellierung zum Ergebnis">
          {/* Spaltenüberschriften */}
          {[['Anforderungen', 170, '#006494'], ['Modellierung', 500, '#7a39bb'], ['Ergebnis', 830, '#437a22']].map(([t, x, c]) => (
            <text key={t as string} x={x as number} y={48} textAnchor="middle" fontSize={12} fontWeight={700} letterSpacing="0.18em" fill={c as string} opacity={0.9}>
              {(t as string).toUpperCase()}
            </text>
          ))}

          {/* Kanten */}
          {EDGES.map((e, i) => (
            <g key={i} style={{ transition: 'opacity 0.2s' }} opacity={edgeDim(e) ? 0.15 : 1}>
              <motion.path
                d={e.d} fill="none"
                stroke={edgeActive(e) ? byPath[e.from].accent : 'var(--text-secondary)'}
                strokeOpacity={edgeActive(e) ? 0.9 : 0.3}
                strokeWidth={edgeActive(e) ? 2 : 1.4}
                initial={reduce ? { opacity: 0 } : { pathLength: 0 }}
                animate={reduce ? { opacity: 1 } : { pathLength: 1 }}
                transition={{ delay: 0.25 + i * 0.1, duration: 0.55, ease: 'easeOut' }}
              />
              {/* Datenfluss-Punkt */}
              {!reduce && dots && (
                <circle r={3.2} fill={byPath[e.from].accent} opacity={edgeDim(e) ? 0 : 0.85}>
                  <animateMotion dur={`${3.6 + (i % 3)}s`} begin={`${-i * 1.1}s`} repeatCount="indefinite" path={e.d} />
                </circle>
              )}
              <motion.text
                x={e.lx} y={e.ly} textAnchor="middle" fontSize={10.5}
                fill="var(--text-secondary)" stroke="var(--sidebar-bg)" strokeWidth={4} paintOrder="stroke"
                initial={{ opacity: 0 }} animate={{ opacity: edgeDim(e) ? 0.15 : 0.8 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                {e.label}
              </motion.text>
            </g>
          ))}

          {/* Knoten */}
          {ITEMS.map((item, i) => {
            const p = POS[item.path]
            return (
              <motion.g
                key={item.path}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: nodeDim(item.path) ? 0.35 : 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ cursor: 'pointer', transformOrigin: `${p.x}px ${p.y}px` }}
                role="link" tabIndex={0} aria-label={`${item.label} öffnen`}
                onClick={() => navigate(item.path)}
                onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); navigate(item.path) } }}
                onMouseEnter={() => setHover(item.path)}
                onMouseLeave={() => setHover(null)}
              >
                <rect
                  x={p.x - NW} y={p.y - NH} width={NW * 2} height={NH * 2} rx={15}
                  fill="var(--card-bg)"
                  stroke={hover === item.path ? item.accent : 'var(--border-color)'}
                  strokeWidth={hover === item.path ? 1.8 : 1}
                  style={{ filter: hover === item.path ? `drop-shadow(0 4px 14px ${item.accent}55)` : 'drop-shadow(0 1px 3px rgba(0,0,0,0.12))', transition: 'stroke 0.15s' }}
                />
                <circle cx={p.x - NW + 22} cy={p.y} r={5} fill={item.accent} />
                <text x={p.x - NW + 38} y={p.y - 2} fontSize={13.5} fontWeight={600} fill="var(--text-primary)">{item.label}</text>
                <text x={p.x - NW + 38} y={p.y + 15} fontSize={10.5} fill="var(--text-secondary)">{sectionStat[item.path]}</text>
              </motion.g>
            )
          })}
        </svg>

        <p className="text-center text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>
          Knoten anklicken öffnet den Abschnitt · Überfahren zeigt die direkten Beziehungen
        </p>
      </div>
    </motion.div>
  )
}
```

---

## Variante „Aurora" — weiche Farbflächen hinter Glas

**Konzept:** Drei große, stark weichgezeichnete Farbflächen in den
Akzentfarben (Petrol `#01696f`, Violett `#7a39bb`, Blau `#006494`) liegen
hinter halbtransparenten Glas-Karten (`backdrop-filter: blur(18px)`).
Zentrierter Held mit Verlaufs-Titel (Petrol → Blau → Violett via
`background-clip: text`), darunter die drei Stationen als schwebende Panels
mit sanftem Hover-Lift.

**Hell/Dunkel:** Glas- und Blob-Werte hängen am Theme (hell:
`rgba(255,255,255,0.6)`-Glas, Blob-Deckkraft 0,2 · dunkel:
`rgba(255,255,255,0.055)`-Glas auf `#121216`, Blob-Deckkraft 0,3;
Akzentfarben im Dunkeln über `filter: brightness(1.5)` aufgehellt).

### Quellcode `src/pages/overview/VarianteAurora.tsx`

```tsx
// Variante 5 „Aurora": weiche, unscharfe Farbflächen in den Akzentfarben
// hinter Glas-Karten (backdrop-blur). Zentrierter Held, darunter die drei
// Stationen als schwebende Panels.
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Rocket } from 'lucide-react'
import { pageVariants } from '@/lib/transitions'
import { Presentation } from '@/components/presentation/Presentation'
import { useAppStore } from '@/store/appStore'
import { ACCENT, GROUPS, groupIntro, heroStats, sectionStat, tourSteps } from './shared'

export default function VarianteAurora() {
  const reduce = useReducedMotion()
  const { theme } = useAppStore()
  const dark = theme === 'dark'

  const enter = (delay: number) => reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.05 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }

  const glass = {
    background: dark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.6)',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9)'}`,
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(31,59,84,0.09)',
  } as const

  const blobOp = dark ? 0.3 : 0.2

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="-m-4 md:-m-6 min-h-full relative overflow-hidden"
      style={{ background: dark ? '#121216' : '#f4f4f2' }}
    >
      {/* Aurora-Flächen */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{ width: 560, height: 560, top: -180, left: '8%', background: ACCENT, opacity: blobOp, filter: 'blur(130px)' }} />
        <div className="absolute rounded-full" style={{ width: 480, height: 480, top: 60, right: '-6%', background: '#7a39bb', opacity: blobOp * 0.8, filter: 'blur(140px)' }} />
        <div className="absolute rounded-full" style={{ width: 520, height: 520, bottom: -220, left: '34%', background: '#006494', opacity: blobOp * 0.9, filter: 'blur(150px)' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {/* Held */}
        <motion.div {...enter(0)} className="rounded-3xl px-6 py-10 md:px-12 md:py-12 text-center" style={glass}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: 'var(--text-secondary)' }}>
            Systemanalyse &amp; Entwurf · 2026
          </p>
          <h1
            className="font-bold leading-[1.05] mb-3"
            style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
              background: `linear-gradient(100deg, ${dark ? '#4fd4c7' : '#01696f'}, ${dark ? '#7cc0e8' : '#006494'} 55%, ${dark ? '#c894f5' : '#7a39bb'})`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}
          >
            CineTicket
          </h1>
          <p className="text-sm md:text-base max-w-xl mx-auto mb-5" style={{ color: 'var(--text-primary)' }}>
            Ein Kino-Ticketsystem, vollständig dokumentiert – von der Anforderungsanalyse
            über die UML-Modelle bis zum klickbaren Prototyp.
          </p>
          <div className="flex justify-center gap-1.5 flex-wrap mb-6">
            {heroStats.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ ...glass, color: 'var(--text-primary)' }}>{s}</span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <Presentation steps={tourSteps} accent={ACCENT} title="Überblick" label="Tour starten" />
            <Link
              to="/prototyp"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:-translate-y-0.5"
              style={{ ...glass, color: 'var(--text-primary)' }}
            >
              <Rocket size={14} style={{ color: '#964219' }} /> Zum Prototyp
            </Link>
          </div>
        </motion.div>

        {/* Die drei Stationen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {GROUPS.map((group, gi) => (
            <motion.div key={group.title} {...enter(0.14 + gi * 0.08)} className="rounded-2xl p-5 transition-transform hover:-translate-y-1" style={glass}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: group.items[0].accent, filter: dark ? 'brightness(1.5)' : undefined }}>
                {group.title}
              </h4>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{groupIntro[group.title]}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.path} to={item.path} className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg group transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.07]" style={{ color: 'var(--text-primary)' }}>
                      <Icon size={15} style={{ color: item.accent, filter: dark ? 'brightness(1.5)' : undefined }} />
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>{sectionStat[item.path]}</span>
                      <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" style={{ color: item.accent }} />
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p {...enter(0.42)} className="mt-8 text-center text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          Einfach ⊂ Erweitert in jedem Abschnitt · alle Diagramme live aus JSON · Kino-Tour über „Präsentation"
        </motion.p>
      </div>
    </motion.div>
  )
}
```

---

## Gemeinsame Datenbasis der Varianten

Beide Varianten importierten Kennzahlen, Gruppen und Tour-Folien aus
`src/pages/overview/shared.tsx`. Diese Daten leben inzwischen wieder direkt
in `src/pages/OverviewPage.tsx` — beim Wiederherstellen einer Variante
entweder von dort importieren oder diese Datei wieder anlegen:

### Quellcode `src/pages/overview/shared.tsx` (Stand der Auswahl)

```tsx
// Gemeinsame Daten für alle Dashboard-Varianten: Kennzahlen, Tour-Folien,
// Gruppen-Texte. Alles aus src/data berechnet, nichts hartkodiert.
import { NAV } from '@/components/layout/nav'
import { innovation, personas, prototype, stories, storyMaps, uml, sequences, stateMachines } from '@/data/content'
import { extraMachines } from '@/data/statesExtra'
import { DreiStationen, JsonZuSvg, KennzahlenStrip, TeilmengeModi } from '@/components/presentation/visuals/product'
import type { PresentationStep } from '@/types'

export const ACCENT = '#01696f'

// Klassendiagramm + Sequenzdiagramme + Zustandsautomaten (inkl. Enum-Automaten)
export const nDiagramme = 1 + sequences.length + stateMachines.machines.length + extraMachines.length

export const heroStats = [
  `${personas.basis.length}–${personas.erweitert.length} Personas`,
  `${stories.basis.length}–${stories.erweitert.length} User Stories`,
  `${uml.classes.length} UML-Klassen`,
  `${nDiagramme} Diagramme`,
]

export const rollenLive = prototype.rollen.filter((r) => r.status === 'implementiert').length

// Kennzahl je Abschnitt (Spannen = Einfach-/Erweitert-Modus)
export const sectionStat: Record<string, string> = {
  '/personas': `${personas.basis.length}–${personas.erweitert.length}`,
  '/user-stories': `${stories.basis.length}–${stories.erweitert.length}`,
  '/story-map': `${storyMaps.basis.activities.length}–${storyMaps.erweitert.activities.length} Aktivitäten`,
  '/klassendiagramm': `${uml.classes.length} Klassen`,
  '/sequenzdiagramme': `${sequences.length} Flows`,
  '/zustandsdiagramme': `${stateMachines.machines.length}–${stateMachines.machines.length + extraMachines.length} Automaten`,
  '/prototyp': `${rollenLive} Rollen live`,
  '/innovation': `${innovation.innovations.length} Ideen`,
}

export const groupIntro: Record<string, string> = {
  Anforderungen: 'Wer braucht was? Personas, ihre Stories und deren Ordnung nach Nutzerreise und Release.',
  Modellierung: 'Das System als UML: Struktur (Klassen), Abläufe (Sequenzen) und Lebenszyklen (Zustände).',
  Ergebnis: 'Der klickbare Prototyp des MVP – und recherchierte Ideen über ihn hinaus.',
}

export const GROUPS = NAV.filter((g) => g.title !== 'Start')

export const tourSteps: PresentationStep[] = [
  {
    id: 'welcome', title: 'CineTicket', visual: <KennzahlenStrip />,
    body: 'Die Dokumentation eines Kino-Ticketsystems für „Systemanalyse und Entwurf" – von der Anforderungsanalyse über die UML-Modellierung bis zum klickbaren Prototyp.',
  },
  {
    id: 'aufbau', title: 'Drei Stationen', visual: <DreiStationen />,
    body: 'Die Website folgt dem Weg der Systementwicklung: Aus den Anforderungen entstehen die Modelle, aus den Modellen der Prototyp – jede Station baut auf der vorigen auf.',
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
    id: 'praes', title: 'Präsentationsmodus',
    body: 'Jeder Abschnitt erklärt seine wichtigsten Inhalte in einer solchen Kino-Tour – mit echten Ausschnitten aus den Diagrammen. Weiter per Pfeiltasten, automatisch mit einstellbarem Tempo, Esc beendet.',
  },
]
```

---

Screenshots aller fünf Varianten (Auswahlphase): siehe Vergleichsgalerie-
Artifact vom 2026-07-14 bzw. PROGRESS-Changelog. Die übrigen Entwürfe
(„Editorial", „Bento") wurden bewusst nicht archiviert.
