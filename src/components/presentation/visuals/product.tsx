// Folien-Visuals für Dashboard, Prototyp und Innovation.
// Alle Zahlen/Listen werden aus den JSON-Daten berechnet.
import { motion, useReducedMotion } from 'motion/react'
import {
  Boxes, Braces, Building2, Coffee, CreditCard, LineChart, ListChecks,
  Rocket, ScanLine, ShieldCheck, User, Wrench,
} from 'lucide-react'
import { innovation, personas, prototype, sequences, stateMachines, stories, storyMaps, uml } from '@/data/content'
import { extraMachines } from '@/data/statesExtra'
import { bright, pop } from './core'

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
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.13)', minWidth: 128 }}
        >
          <div className="text-[32px] font-bold leading-none text-white" style={{ fontFamily: 'var(--font-display)' }}>{it.n}</div>
          <div className="text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{it.l}</div>
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
              <div className="text-[10.5px] mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.items}</div>
            </motion.div>
            {i < STATIONEN.length - 1 && (
              <motion.span {...pop(i * 2 + 1, reduce)} className="text-xl" style={{ color: 'rgba(255,255,255,0.35)' }}>→</motion.span>
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
      <motion.div {...pop(0, reduce)} className="rounded-xl overflow-hidden text-left" style={{ border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.04)' }}>
        <div className="px-3.5 py-1.5 text-[10px] font-mono font-semibold flex items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
          <Braces size={11} /> states.json
        </div>
        <div className="px-4 py-3 font-mono text-[11.5px] leading-[1.7]">
          {SNIPPET.map(([k, v], i) => (
            <div key={i}>
              <span style={{ color: '#63c1f5' }}>{k}</span>
              <span style={{ color: '#94d95c' }}>{v}</span>
              {v && i < SNIPPET.length - 2 ? <span style={{ color: 'rgba(255,255,255,0.4)' }}>,</span> : null}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...pop(1, reduce)} className="flex flex-col items-center gap-1 px-1">
        <span className="text-2xl" style={{ color: 'rgba(255,255,255,0.5)' }}>→</span>
        <span className="text-[9.5px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>live als SVG</span>
      </motion.div>

      <motion.div {...pop(2, reduce)} className="flex items-center gap-2.5 rounded-xl px-5 py-6" style={{ border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.04)' }}>
        <span className="px-3.5 py-2 rounded-xl text-[12px] font-mono font-bold" style={{ background: '#d199002a', border: `1px solid ${bright('#d19900')}99`, color: bright('#d19900') }}>RESERVIERT</span>
        <svg width={92} height={30} viewBox="0 0 92 30" aria-hidden>
          <motion.line
            x1={2} y1={12} x2={82} y2={12} stroke="rgba(255,255,255,0.8)" strokeWidth={1.5}
            initial={reduce ? { opacity: 0 } : { pathLength: 0 }}
            animate={reduce ? { opacity: 1 } : { pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          />
          <motion.polygon
            points="90,12 79,6.5 79,17.5" fill="rgba(255,255,255,0.9)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
          />
          <motion.text
            x={46} y={27} textAnchor="middle" fontSize={8.5} fontFamily="ui-monospace, monospace" fill="rgba(255,255,255,0.55)"
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
      style={{ maxWidth: 560, border: '1.5px dashed rgba(255,255,255,0.3)' }}
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-left mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Erweitert · Vollausbau
      </div>
      <motion.div
        {...pop(1, reduce)}
        className="rounded-2xl px-5 py-4"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.22)' }}
      >
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Einfach · MVP-Kern
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {[`${personas.basis.length} Personas`, `${stories.basis.length} Stories`, `${nAktB} Aktivitäten`].map((t, i) => (
            <motion.span key={t} {...pop(2 + i, reduce)} className="text-[11.5px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>{t}</motion.span>
          ))}
        </div>
      </motion.div>
      <div className="flex justify-center gap-2 flex-wrap mt-3.5">
        {[`${personas.erweitert.length} Personas`, `${stories.erweitert.length} Stories`, `${nAktE} Aktivitäten`].map((t, i) => (
          <motion.span key={t} {...pop(5 + i, reduce)} className="text-[11.5px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', border: '1px dashed rgba(255,255,255,0.25)' }}>{t}</motion.span>
        ))}
      </div>
    </motion.div>
  )
}

// ── Prototyp: acht Rollen (vier live, vier Roadmap) ──
const roleIcon: Record<string, React.ElementType> = {
  endkunde: User, kasse: CreditCard, manager: LineChart, einlass: ScanLine,
  service: Coffee, facility: Wrench, marke: Building2, admin: ShieldCheck,
}

export function RollenGrid({ tier = 'erweitert' }: { tier?: 'basis' | 'erweitert' }) {
  const reduce = useReducedMotion()
  const rollen = tier === 'basis' ? prototype.rollen.filter((r) => r.status === 'implementiert') : prototype.rollen
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5" style={{ maxWidth: 760 }}>
      {rollen.map((r, i) => {
        const Icon = roleIcon[r.id] ?? User
        const live = r.status === 'implementiert'
        const c = live ? '#437a22' : '#d19900'
        return (
          <motion.div
            key={r.id} {...pop(i, reduce)}
            className="rounded-xl px-3 py-3.5 text-center"
            style={{
              background: live ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.025)',
              border: live ? '1px solid rgba(255,255,255,0.18)' : '1px dashed rgba(255,255,255,0.14)',
              opacity: live ? 1 : 0.72,
            }}
          >
            <div className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-1.5" style={{ background: `${c}26`, color: bright(c) }}>
              <Icon size={15} />
            </div>
            <div className="text-[11.5px] font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{r.label}</div>
            <div className="mt-1.5 inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide" style={{ background: `${c}26`, color: bright(c) }}>
              {live ? 'live' : 'Roadmap'}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Prototyp: die fünf Wizard-Schritte (= Sequenzdiagramm Online-Buchung) ──
export function WizardSchritte() {
  const reduce = useReducedMotion()
  const schritte = prototype.module.find((m) => m.id === 'buchungs-wizard')!.schritte!
  return (
    <div className="flex items-start justify-center gap-0 flex-wrap" style={{ maxWidth: 900 }}>
      {schritte.map((s, i) => (
        <span key={s.nr} className="inline-flex items-start">
          <motion.div {...pop(i, reduce)} className="flex flex-col items-center" style={{ width: 148 }}>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold text-white"
              style={{ background: '#964219', boxShadow: '0 0 20px #96421988' }}
            >
              {s.nr}
            </div>
            <div className="mt-2 text-[11.5px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.88)' }}>
              {s.name.split(' (')[0]}
            </div>
            {s.name.includes('Hold') && (
              <div className="mt-1.5 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold" style={{ background: '#d1990026', color: bright('#d19900') }}>
                Sitz-Hold: RESERVIERT
              </div>
            )}
            <div className="mt-1.5 flex gap-1 flex-wrap justify-center">
              {s.stories.map((st) => (
                <span key={st} className="text-[8.5px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>{st}</span>
              ))}
            </div>
          </motion.div>
          {i < schritte.length - 1 && (
            <motion.span {...pop(i, reduce)} className="text-lg mt-2.5" style={{ color: 'rgba(255,255,255,0.3)' }}>→</motion.span>
          )}
        </span>
      ))}
    </div>
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
    return { it, x: sx(it.effort), y: sy(it.impact) + (jit === 0 ? 0 : jit % 2 === 1 ? -16 : 16) }
  })

  return (
    <div className="w-full" style={{ maxWidth: W }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Innovations-Ideen nach Impact und Aufwand">
        {[1, 2, 3, 4, 5].map((v) => (
          <g key={v}>
            <line x1={sx(v)} y1={y0} x2={sx(v)} y2={y0 + plotH} stroke="rgba(255,255,255,0.07)" />
            <line x1={x0} y1={sy(v)} x2={x0 + plotW} y2={sy(v)} stroke="rgba(255,255,255,0.07)" />
            <text x={sx(v)} y={y0 + plotH + 16} textAnchor="middle" fontSize={9.5} fill="rgba(255,255,255,0.4)">{v}</text>
            <text x={x0 - 12} y={sy(v) + 3} textAnchor="end" fontSize={9.5} fill="rgba(255,255,255,0.4)">{v}</text>
          </g>
        ))}
        <line x1={x0} y1={y0 + plotH} x2={x0 + plotW} y2={y0 + plotH} stroke="rgba(255,255,255,0.3)" />
        <line x1={x0} y1={y0} x2={x0} y2={y0 + plotH} stroke="rgba(255,255,255,0.3)" />
        <text x={x0 + plotW} y={y0 + plotH + 34} textAnchor="end" fontSize={10.5} fontWeight={600} fill="rgba(255,255,255,0.6)">Aufwand →</text>
        <text x={x0 - 40} y={y0 - 8} fontSize={10.5} fontWeight={600} fill="rgba(255,255,255,0.6)">Impact ↑</text>

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
                fontSize={11} fontWeight={600} fill="rgba(255,255,255,0.85)"
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
    <div className="w-full rounded-2xl px-6 py-5 text-left" style={{ maxWidth: 640, background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.13)' }}>
      <motion.div {...pop(0, reduce)} className="flex items-center gap-2.5 flex-wrap mb-2">
        <span className="text-[15px] font-bold" style={{ color: 'rgba(255,255,255,0.94)' }}>{it.name}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${c}26`, color: bright(c) }}>{feasLabel[it.feasibility]}</span>
        <span className="ml-auto text-[10.5px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Impact {it.impact}/5 · Aufwand {it.effort}/5</span>
      </motion.div>
      <motion.p {...pop(1, reduce)} className="text-[12.5px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.72)' }}>
        {it.summary}
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {[
          { l: 'Persona', v: [it.personaLabel] },
          { l: 'User Stories', v: it.stories },
          { l: 'UML-Klassen', v: it.umlClasses },
        ].map((g, i) => (
          <motion.div key={g.l} {...pop(2 + i, reduce)} className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.42)' }}>{g.l}</div>
            <div className="flex gap-1 flex-wrap">
              {g.v.map((x) => (
                <span key={x} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }}>{x}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
