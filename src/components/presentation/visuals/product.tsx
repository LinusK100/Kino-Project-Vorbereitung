// Folien-Visuals für Dashboard, Prototyp, Innovation und den Abschluss.
// Alle Zahlen/Listen werden aus den JSON-Daten berechnet.
import { motion, useReducedMotion } from 'motion/react'
import { BadgeCheck, Boxes, Braces, ListChecks, MonitorPlay, Rocket, Route } from 'lucide-react'
import { innovation, personas, prototype, sequences, stateMachines, stories, storyMaps, uml } from '@/data/content'
import { extraMachines } from '@/data/statesExtra'
import { bright, pop, pres } from './core'

// ── Dashboard: Kennzahlen der Dokumentation ──
export function KennzahlenStrip() {
  const reduce = useReducedMotion()
  const nDiagramme = 1 + sequences.length + stateMachines.machines.length + extraMachines.length
  const items = [
    { n: `${personas.basis.length}–${personas.erweitert.length}`, l: 'Personas' },
    { n: `${stories.basis.length}–${stories.erweitert.length}`, l: 'User Stories' },
    { n: `${uml.classes.length}`, l: 'UML-Klassen' },
    { n: `${nDiagramme}`, l: 'Diagramme' },
  ]
  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {items.map((it, i) => (
        <motion.div
          key={it.l} {...pop(i, reduce)}
          className="rounded-2xl px-6 py-4 text-center"
          style={{ background: pres().chip, border: `1px solid ${pres().line}`, minWidth: 128 }}
        >
          <div className="text-[32px] font-bold leading-none" style={{ fontFamily: 'var(--font-display)', color: pres().fg }}>{it.n}</div>
          <div className="text-[11px] mt-1.5" style={{ color: pres().fgFaint }}>{it.l}</div>
        </motion.div>
      ))}
    </div>
  )
}

// ── Dashboard: die drei Stationen der Systementwicklung ──
const STATIONEN = [
  { title: 'Anforderungen', color: '#006494', icon: ListChecks, items: 'Personas · User Stories · Story Map' },
  { title: 'Modellierung', color: '#7a39bb', icon: Boxes, items: 'Klassen · Sequenzen · Zustände' },
  { title: 'Ergebnis', color: '#437a22', icon: Rocket, items: 'Prototyp · Innovation' },
]

export function DreiStationen() {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-center justify-center gap-2.5 flex-wrap">
      {STATIONEN.map((s, i) => {
        const Icon = s.icon
        return (
          <span key={s.title} className="inline-flex items-center gap-2.5">
            <motion.div
              {...pop(i * 2, reduce)}
              className="rounded-2xl px-5 py-4 text-center"
              style={{ background: `${s.color}1e`, border: `1px solid ${bright(s.color)}55`, minWidth: 190 }}
            >
              <div className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center mb-2" style={{ background: `${s.color}38`, color: bright(s.color) }}>
                <Icon size={17} />
              </div>
              <div className="text-[14px] font-bold" style={{ color: bright(s.color) }}>{s.title}</div>
              <div className="text-[10.5px] mt-1" style={{ color: pres().fgFaint }}>{s.items}</div>
            </motion.div>
            {i < STATIONEN.length - 1 && (
              <motion.span {...pop(i * 2 + 1, reduce)} className="text-xl" style={{ color: pres().fgFaint }}>→</motion.span>
            )}
          </span>
        )
      })}
    </div>
  )
}

// ── Dashboard: JSON → SVG (die Kern-Botschaft der Datenhaltung) ──
const SNIPPET: [string, string][] = [
  ['{', ''],
  ['  "from": ', '"RESERVIERT"'],
  ['  "to": ', '"BELEGT"'],
  ['  "event": ', '"belegen(buchung)"'],
  ['}', ''],
]

export function JsonZuSvg() {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap">
      <motion.div {...pop(0, reduce)} className="rounded-xl overflow-hidden text-left" style={{ border: `1px solid ${pres().line}`, background: pres().chip }}>
        <div className="px-3.5 py-1.5 text-[10px] font-mono font-semibold flex items-center gap-1.5" style={{ background: pres().chipStrong, color: pres().fgSoft }}>
          <Braces size={11} /> states.json
        </div>
        <div className="px-4 py-3 font-mono text-[11.5px] leading-[1.7]">
          {SNIPPET.map(([k, v], i) => (
            <div key={i}>
              <span style={{ color: bright('#006494') }}>{k}</span>
              <span style={{ color: bright('#437a22') }}>{v}</span>
              {v && i < SNIPPET.length - 2 ? <span style={{ color: pres().fgFaint }}>,</span> : null}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...pop(1, reduce)} className="flex flex-col items-center gap-1 px-1">
        <span className="text-2xl" style={{ color: pres().fgFaint }}>→</span>
        <span className="text-[9.5px] uppercase tracking-wider font-semibold" style={{ color: pres().fgFaint }}>live als SVG</span>
      </motion.div>

      <motion.div {...pop(2, reduce)} className="flex items-center gap-2.5 rounded-xl px-5 py-6" style={{ border: `1px solid ${pres().line}`, background: pres().chip }}>
        <span className="px-3.5 py-2 rounded-xl text-[12px] font-mono font-bold" style={{ background: '#d199002a', border: `1px solid ${bright('#d19900')}99`, color: bright('#d19900') }}>RESERVIERT</span>
        <svg width={92} height={30} viewBox="0 0 92 30" aria-hidden>
          <motion.line
            x1={2} y1={12} x2={82} y2={12} stroke={pres().stroke} strokeWidth={1.5}
            initial={reduce ? { opacity: 0 } : { pathLength: 0 }}
            animate={reduce ? { opacity: 1 } : { pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          />
          <motion.polygon
            points="90,12 79,6.5 79,17.5" fill={pres().stroke}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
          />
          <motion.text
            x={46} y={27} textAnchor="middle" fontSize={8.5} fontFamily="ui-monospace, monospace" fill={pres().fgFaint}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
          >
            belegen(buchung)
          </motion.text>
        </svg>
        <span className="px-3.5 py-2 rounded-xl text-[12px] font-mono font-bold" style={{ background: '#a135442a', border: `1px solid ${bright('#a13544')}99`, color: bright('#a13544') }}>BELEGT</span>
      </motion.div>
    </div>
  )
}

// ── Dashboard: Einfach ⊂ Erweitert (echte Teilmenge) ──
export function TeilmengeModi() {
  const reduce = useReducedMotion()
  const nAktB = storyMaps.basis.activities.length
  const nAktE = storyMaps.erweitert.activities.length
  return (
    <motion.div
      {...pop(0, reduce)}
      className="rounded-3xl p-5 md:p-6 w-full"
      style={{ maxWidth: 560, border: `1.5px dashed ${pres().lineStrong}` }}
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-left mb-3" style={{ color: pres().fgSoft }}>
        Erweitert · Vollausbau
      </div>
      <motion.div
        {...pop(1, reduce)}
        className="rounded-2xl px-5 py-4"
        style={{ background: pres().chip, border: `1px solid ${pres().lineStrong}` }}
      >
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: pres().fg }}>
          Einfach · MVP-Kern
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {[`${personas.basis.length} Personas`, `${stories.basis.length} Stories`, `${nAktB} Aktivitäten`].map((t, i) => (
            <motion.span key={t} {...pop(2 + i, reduce)} className="text-[11.5px] px-2.5 py-1 rounded-full font-medium" style={{ background: pres().chipStrong, color: pres().fg }}>{t}</motion.span>
          ))}
        </div>
      </motion.div>
      <div className="flex justify-center gap-2 flex-wrap mt-3.5">
        {[`${personas.erweitert.length} Personas`, `${stories.erweitert.length} Stories`, `${nAktE} Aktivitäten`].map((t, i) => (
          <motion.span key={t} {...pop(5 + i, reduce)} className="text-[11.5px] px-2.5 py-1 rounded-full font-medium" style={{ background: pres().chip, color: pres().fgFaint, border: `1px dashed ${pres().lineStrong}` }}>{t}</motion.span>
        ))}
      </div>
    </motion.div>
  )
}

// ── Innovation: Impact-gegen-Aufwand-Matrix ──
const feasColor: Record<string, string> = { machbar: '#437a22', teilweise: '#d19900', konzept: '#7a39bb' }
const feasLabel: Record<string, string> = { machbar: 'im Rahmen machbar', teilweise: 'teilweise machbar', konzept: 'Konzept / Vision' }

export function InnovationsMatrix({ tier = 'erweitert' }: { tier?: 'basis' | 'erweitert' }) {
  const reduce = useReducedMotion()
  const items = tier === 'basis' ? innovation.innovations.filter((it) => it.tier === 'basis') : innovation.innovations
  const W = 680
  const H = 330
  const x0 = 64
  const y0 = 24
  const plotW = W - x0 - 24
  const plotH = H - y0 - 62
  const sx = (v: number) => x0 + ((v - 0.5) / 5) * plotW
  const sy = (v: number) => y0 + plotH - ((v - 0.5) / 5) * plotH

  // Punkte mit identischen Koordinaten leicht versetzen, damit nichts verdeckt
  const seen: Record<string, number> = {}
  const pts = items.map((it) => {
    const key = `${it.effort}-${it.impact}`
    const jit = (seen[key] = (seen[key] ?? -1) + 1)
    return { it, x: sx(it.effort), y: sy(it.impact) + (jit === 0 ? 0 : jit % 2 === 1 ? -19 : 19) }
  })

  return (
    <div style={{ width: W }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Innovations-Ideen nach Impact und Aufwand">
        {[1, 2, 3, 4, 5].map((v) => (
          <g key={v}>
            <line x1={sx(v)} y1={y0} x2={sx(v)} y2={y0 + plotH} stroke={pres().grid} />
            <line x1={x0} y1={sy(v)} x2={x0 + plotW} y2={sy(v)} stroke={pres().grid} />
            <text x={sx(v)} y={y0 + plotH + 16} textAnchor="middle" fontSize={9.5} fill={pres().fgFaint}>{v}</text>
            <text x={x0 - 12} y={sy(v) + 3} textAnchor="end" fontSize={9.5} fill={pres().fgFaint}>{v}</text>
          </g>
        ))}
        <line x1={x0} y1={y0 + plotH} x2={x0 + plotW} y2={y0 + plotH} stroke={pres().lineStrong} />
        <line x1={x0} y1={y0} x2={x0} y2={y0 + plotH} stroke={pres().lineStrong} />
        <text x={x0 + plotW} y={y0 + plotH + 34} textAnchor="end" fontSize={10.5} fontWeight={600} fill={pres().fgSoft}>Aufwand → <tspan fontWeight={400} fill={pres().fgFaint}>(1 gering · 5 hoch)</tspan></text>
        <text x={x0 - 40} y={y0 - 8} fontSize={10.5} fontWeight={600} fill={pres().fgSoft}>Impact ↑ <tspan fontWeight={400} fill={pres().fgFaint}>(1 gering · 5 hoch)</tspan></text>

        {pts.map(({ it, x, y }, i) => {
          const c = feasColor[it.feasibility]
          const name = it.name.split(' (')[0].split(':')[0]
          // Label nach links, wenn rechts der Rand oder ein naher Punkt auf gleicher Höhe liegt
          const clash = pts.some((p, j) => j !== i && Math.abs(p.y - y) < 13 && p.x > x && p.x - x < 200)
          const left = x > W - 190 || clash
          return (
            <motion.g key={it.id} {...pop(i, reduce, 0.3)}>
              <circle cx={x} cy={y} r={8} fill={`${c}66`} stroke={bright(c)} strokeWidth={1.5} />
              <text
                x={left ? x - 14 : x + 14} y={y + 4}
                textAnchor={left ? 'end' : 'start'}
                fontSize={11} fontWeight={600} fill={pres().stroke}
              >
                {name}
              </text>
            </motion.g>
          )
        })}
      </svg>
      <div className="flex justify-center gap-2.5 flex-wrap mt-1">
        {Object.entries(feasLabel).filter(([k]) => items.some((it) => it.feasibility === k)).map(([k, l], i) => (
          <motion.span
            key={k} {...pop(7 + i, reduce)}
            className="inline-flex items-center gap-1.5 text-[10.5px] px-2.5 py-1 rounded-full font-medium"
            style={{ background: `${feasColor[k]}22`, color: bright(feasColor[k]), border: `1px solid ${feasColor[k]}55` }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: bright(feasColor[k]) }} />{l}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ── Innovation: eine Idee mit ihrer Verankerung im Modell ──
export function IdeeVerankert() {
  const reduce = useReducedMotion()
  const it = innovation.innovations[0] // Dynamische Preise – tier basis, machbar
  const c = feasColor[it.feasibility]
  return (
    <div className="w-full rounded-2xl px-6 py-5 text-left" style={{ maxWidth: 640, background: pres().chip, border: `1px solid ${pres().line}` }}>
      <motion.div {...pop(0, reduce)} className="flex items-center gap-2.5 flex-wrap mb-2">
        <span className="text-[15px] font-bold" style={{ color: pres().fg }}>{it.name}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${c}26`, color: bright(c) }}>{feasLabel[it.feasibility]}</span>
        <span className="ml-auto text-[10.5px]" style={{ color: pres().fgFaint }}>Impact {it.impact}/5 · Aufwand {it.effort}/5</span>
      </motion.div>
      <motion.p {...pop(1, reduce)} className="text-[12.5px] leading-relaxed mb-4" style={{ color: pres().fgSoft }}>
        {it.summary}
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {[
          { l: 'Persona', v: [it.personaLabel] },
          { l: 'User Stories', v: it.stories },
          { l: 'UML-Klassen', v: it.umlClasses },
        ].map((g, i) => (
          <motion.div key={g.l} {...pop(2 + i, reduce)} className="rounded-xl px-3 py-2.5" style={{ background: pres().chip, border: `1px solid ${pres().line}` }}>
            <div className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: pres().fgFaint }}>{g.l}</div>
            <div className="flex gap-1 flex-wrap">
              {g.v.map((x) => (
                <span key={x} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: pres().chipStrong, color: pres().fgSoft }}>{x}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Innovation: drei Ideen kompakt auf einer Folie (Gesamt-Präsentation) ──
// gruppe 'nah' = machbar/teilweise, 'vision' = Konzept — deckt sich mit der Matrix.
export function IdeenListe({ gruppe = 'nah' }: { gruppe?: 'nah' | 'vision' }) {
  const reduce = useReducedMotion()
  const P = pres()
  const items = innovation.innovations.filter((it) =>
    gruppe === 'vision' ? it.feasibility === 'konzept' : it.feasibility !== 'konzept')
  return (
    <div className="w-full space-y-2.5" style={{ maxWidth: 680 }}>
      {items.map((it, i) => {
        const c = feasColor[it.feasibility]
        const name = it.name.split(' (')[0]
        return (
          <motion.div
            key={it.id} {...pop(i, reduce)}
            className="rounded-xl text-left"
            style={{ background: P.chip, border: `1px solid ${P.line}`, padding: '12px 18px' }}
          >
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <span className="text-[14px] font-bold" style={{ color: P.fg }}>{name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${c}22`, color: bright(c), border: `1px solid ${c}55` }}>
                {feasLabel[it.feasibility]}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: P.fgSoft }}>{it.summary}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Prototyp: gebaute Rollen vs. Roadmap, Zahlen aus den Daten ──
const PROTO_ACCENT = '#c2410c'

export function RollenLive() {
  const reduce = useReducedMotion()
  const P = pres()
  const live = prototype.rollen.filter((r) => r.status === 'implementiert')
  const roadmap = prototype.rollen.filter((r) => r.status !== 'implementiert')
  const umlImpl = uml.classes.filter((c) => c.implementedInPrototype).length
  const a = bright(PROTO_ACCENT)
  return (
    <div className="flex flex-col items-center gap-4" style={{ maxWidth: 720 }}>
      <div className="flex justify-center gap-2 flex-wrap">
        {live.map((r, i) => (
          <motion.span
            key={r.id} {...pop(i, reduce)}
            className="text-[13px] font-bold px-4 py-2 rounded-xl"
            style={{ background: `${PROTO_ACCENT}1e`, color: a, border: `1px solid ${a}66` }}
          >
            {r.label.split(' (')[0]}
          </motion.span>
        ))}
      </div>
      <div className="flex justify-center gap-2 flex-wrap">
        {roadmap.map((r, i) => (
          <motion.span
            key={r.id} {...pop(live.length + i, reduce)}
            className="text-[11.5px] px-3 py-1.5 rounded-full font-medium"
            style={{ background: P.chip, color: P.fgFaint, border: `1px dashed ${P.lineStrong}` }}
          >
            {r.label.split(' (')[0]} · Roadmap
          </motion.span>
        ))}
      </div>
      <motion.p {...pop(prototype.rollen.length, reduce)} className="text-[12.5px] font-medium" style={{ color: P.fgSoft }}>
        {live.length} von {prototype.rollen.length} Rollen und {umlImpl} von {uml.classes.length} UML-Klassen sind gebaut.
      </motion.p>
    </div>
  )
}

// ── Prototyp: Live-Demo-Moment (Badge wie in der PPT-Vorlage) ──
const DEMO_SCHRITTE: [string, string][] = [
  ['Endkunde', 'buchen'], ['Kasse', 'verkaufen'], ['Manager', 'steuern'], ['Einlass', 'scannen'],
]

export function LiveDemo() {
  const reduce = useReducedMotion()
  const P = pres()
  const g = bright('#437a22')
  return (
    <div className="flex flex-col items-center gap-5">
      <motion.span
        {...pop(0, reduce)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[15px] font-bold tracking-[0.14em]"
        style={{ background: `${'#437a22'}22`, color: g, border: `1.5px solid ${g}77` }}
      >
        <MonitorPlay size={18} /> [ LIVE-DEMO ]
      </motion.span>
      <div className="flex justify-center gap-2.5 flex-wrap">
        {DEMO_SCHRITTE.map(([rolle, verb], i) => (
          <motion.div
            key={rolle} {...pop(1 + i, reduce)}
            className="rounded-xl px-4 py-3 text-center"
            style={{ background: P.chip, border: `1px solid ${P.line}`, minWidth: 128 }}
          >
            <div className="text-[16px] font-bold font-mono mb-0.5" style={{ color: P.fgFaint }}>{i + 1}</div>
            <div className="text-[13px] font-bold" style={{ color: P.fg }}>{rolle}</div>
            <div className="text-[11px]" style={{ color: P.fgSoft }}>{verb}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Agenda: nummerierte Stationen der Präsentation (nach PPT-Vorbild) ──
const AGENDA = [
  { c: '#01696f', t: 'Projekt & Vorgehen', s: 'Datenbasis und Arbeitsweise' },
  { c: '#006494', t: 'Anforderungen', s: 'Personas, User Stories, Story Map' },
  { c: '#7a39bb', t: 'Modellierung', s: 'Klassen, Sequenzen, Zustände' },
  { c: '#c2410c', t: 'Prototyp', s: 'Live-Demo im Browser' },
  { c: '#437a22', t: 'Innovation', s: 'Sechs Ideen nach dem MVP' },
  { c: '#01696f', t: 'Fazit', s: 'Der Weg zum fertigen System' },
]

export function AgendaListe() {
  const reduce = useReducedMotion()
  const P = pres()
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full" style={{ maxWidth: 1220 }}>
      {AGENDA.map((a, i) => (
        <motion.div
          key={a.t} {...pop(i, reduce)}
          className="rounded-2xl overflow-hidden text-left"
          style={{ background: P.chip, border: `1px solid ${P.line}` }}
        >
          <div className="h-[3px]" style={{ background: bright(a.c) }} />
          <div className="px-6 py-5 flex items-start gap-4">
            <span className="text-[32px] font-bold leading-none" style={{ color: bright(a.c) }}>{i + 1}</span>
            <span className="min-w-0">
              <span className="block text-[17px] font-bold leading-tight" style={{ color: P.fg }}>{a.t}</span>
              <span className="block text-[13px] mt-1.5" style={{ color: P.fgSoft }}>{a.s}</span>
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── Fazit: mit diesen Artefakten und agentischem Coding zum fertigen System ──
// Konkret statt Floskel; Zahlen aus den Daten.
export function Fundament() {
  const reduce = useReducedMotion()
  const P = pres()
  // Nur Schlagworte — die Sätze dazu spricht die Person, die präsentiert.
  const punkte = [
    { c: '#006494', icon: Braces, t: 'Daten statt Dokumente' },
    { c: '#01696f', icon: Route, t: 'Roter Faden U47' },
    { c: '#7a39bb', icon: Boxes, t: 'Modell als Bauplan' },
    { c: '#437a22', icon: BadgeCheck, t: 'Erst testen, dann live' },
  ]
  return (
    <div className="w-full flex flex-col gap-5" style={{ maxWidth: 1180 }}>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {punkte.map((k, i) => {
          const Icon = k.icon
          return (
            <motion.div
              key={k.t} {...pop(i * 2, reduce)}
              className="rounded-2xl overflow-hidden text-center"
              style={{ background: P.chip, border: `1px solid ${P.line}` }}
            >
              <div className="h-[4px]" style={{ background: bright(k.c) }} />
              <div className="px-4 py-6 flex flex-col items-center gap-3">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${k.c}18`, color: bright(k.c) }}>
                  <Icon size={22} />
                </span>
                <span className="text-[16px] font-bold leading-tight" style={{ color: P.fg }}>{k.t}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
      {/* Der Weg weiter: was schon steht, und wie es umgesetzt wird */}
      <div className="flex items-center justify-center flex-wrap gap-x-1.5 gap-y-2">
        {['Anforderungen', 'Modell', 'Prototyp'].map((s, i) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <motion.span
              {...pop(8 + i, reduce)}
              className="text-[12.5px] font-semibold px-3.5 py-1.5 rounded-full"
              style={{ background: P.chipStrong, color: P.fg, border: `1px solid ${P.line}` }}
            >
              {s}
            </motion.span>
            <motion.span {...pop(8 + i, reduce)} style={{ color: P.fgFaint }}>→</motion.span>
          </span>
        ))}
        <motion.span
          {...pop(11, reduce)}
          className="text-[12.5px] font-bold px-3.5 py-1.5 rounded-full"
          style={{ background: `${'#437a22'}1e`, color: bright('#437a22'), border: `1.5px dashed ${bright('#437a22')}88` }}
        >
          agentisch umgesetzt: das volle System
        </motion.span>
      </div>
    </div>
  )
}
