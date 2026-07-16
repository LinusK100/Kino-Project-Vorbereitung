// Folien-Visuals für Anforderungen: Personas, User Stories, Story Map.
// Alle Karten/Balken werden aus den JSON-Daten berechnet.
import { motion, useReducedMotion } from 'motion/react'
import { CheckCircle2, Crown, Frown, Target } from 'lucide-react'
import { personas, personaById, stories, storyMaps } from '@/data/content'
import { zahlwort } from '@/lib/utils'
import { bright, draw, pop, VEASE, pres } from './core'

// ── Personas: die vier Kern-Personas des MVP ──
export function PersonaKern() {
  const reduce = useReducedMotion()
  return (
    <div className="flex justify-center gap-3.5 flex-wrap">
      {personas.basis.map((p, i) => (
        <motion.div
          key={p.id} {...pop(i, reduce)}
          className="rounded-2xl px-4 pt-5 pb-4 w-[196px]"
          style={{ background: pres().chip, border: `1px solid ${pres().line}` }}
        >
          <div
            className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold text-sm"
            style={{ background: p.color, boxShadow: `0 0 24px ${p.color}88` }}
          >
            {p.avatar}
          </div>
          <div className="mt-3 text-[13.5px] font-bold" style={{ color: pres().fg }}>{p.name}</div>
          <div className="text-[11px] mt-0.5" style={{ color: pres().fgFaint }}>{p.role}</div>
          {p.umbrella && (
            <div
              className="mt-2 inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: `${p.color}30`, color: bright(p.color) }}
            >
              <Crown size={9} /> Dach-Persona
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ── Personas: der Endkunde verfeinert sich in vier Ausprägungen ──
export function PersonaBaum() {
  const reduce = useReducedMotion()
  const dach = personaById['endkunde']
  const kinder = personas.erweitert.filter((p) => p.refines === 'endkunde')
  const intern = personas.erweitert.filter((p) => p.tier === 'erweitert' && !p.refines)
  const W = 680
  const childX = (i: number) => (W / kinder.length) * (i + 0.5)

  return (
    <div style={{ width: W }}>
      <motion.div {...pop(0, reduce)} className="flex justify-center">
        <div
          className="inline-flex items-center gap-2.5 rounded-2xl px-5 py-3"
          style={{ background: `${dach.color}22`, border: `1px solid ${bright(dach.color)}66` }}
        >
          <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: dach.color }}>{dach.avatar}</span>
          <span className="text-left">
            <span className="block text-[13px] font-bold" style={{ color: pres().fg }}>{dach.name}</span>
            <span className="text-[10px] inline-flex items-center gap-1" style={{ color: bright(dach.color) }}><Crown size={9} /> Dach-Persona</span>
          </span>
        </div>
      </motion.div>

      <svg viewBox={`0 0 ${W} 36`} className="w-full h-auto" aria-hidden>
        {kinder.map((p, i) => (
          <motion.path
            key={p.id} {...draw(i, reduce, 0.3)}
            d={`M ${W / 2} 2 C ${W / 2} 22, ${childX(i)} 14, ${childX(i)} 34`}
            fill="none" stroke={pres().lineStrong} strokeWidth={1.2}
          />
        ))}
      </svg>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {kinder.map((p, i) => (
          <motion.div
            key={p.id} {...pop(2 + i, reduce)}
            className="rounded-xl px-2 py-3 text-center"
            style={{ background: pres().chip, border: `1px solid ${pres().line}` }}
          >
            <div className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-white text-[10px] font-bold" style={{ background: p.color, boxShadow: `0 0 16px ${p.color}77` }}>{p.avatar}</div>
            <div className="mt-1.5 text-[11.5px] font-semibold" style={{ color: pres().fg }}>{p.name.split(' ')[0]}</div>
            <div className="text-[9.5px]" style={{ color: pres().fgFaint }}>{p.role}</div>
          </motion.div>
        ))}
      </div>

      <motion.p {...pop(7, reduce)} className="mt-3 text-[11px]" style={{ color: pres().fgFaint }}>
        dazu {zahlwort(intern.length)} interne Rollen: {intern.map((p) => p.name.split(' ')[0]).join(' · ')}
      </motion.p>
    </div>
  )
}

// ── Personas: Ziele gegen Frustrationen (eine konkrete Person im Fokus) ──
export function ZieleFrustrationen({ id = 'monika' }: { id?: string }) {
  const reduce = useReducedMotion()
  const p = personaById[id]
  return (
    <div className="w-full rounded-2xl overflow-hidden text-left" style={{ maxWidth: 660, background: pres().chip, border: `1px solid ${pres().line}` }}>
      <motion.div {...pop(0, reduce)} className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: `1px solid ${pres().line}` }}>
        <span className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: p.color, boxShadow: `0 0 18px ${p.color}88` }}>{p.avatar}</span>
        <span>
          <span className="block text-[14px] font-bold" style={{ color: pres().fg }}>{p.name}</span>
          <span className="text-[11px]" style={{ color: pres().fgFaint }}>{p.role} · {p.age} Jahre</span>
        </span>
        <span className="ml-auto text-[11px] italic hidden sm:block" style={{ color: pres().fgFaint, maxWidth: 260 }}>„{p.motto}"</span>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="px-5 py-4 sm:border-r" style={{ borderColor: pres().line }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Target size={13} color={bright('#437a22')} />
            <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: bright('#437a22') }}>Ziele</span>
          </div>
          {p.goals.map((g, i) => (
            <motion.p key={g} {...pop(1 + i, reduce)} className="text-[12px] leading-relaxed mb-1.5 flex gap-2" style={{ color: pres().fgSoft }}>
              <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: bright('#437a22') }} />{g}
            </motion.p>
          ))}
        </div>
        <div className="px-5 py-4" style={{ borderTop: `1px solid ${pres().line}` }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Frown size={13} color={bright('#a13544')} />
            <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: bright('#a13544') }}>Frustrationen</span>
          </div>
          {p.frustrations.map((f, i) => (
            <motion.p key={f} {...pop(4 + i, reduce)} className="text-[12px] leading-relaxed mb-1.5 flex gap-2" style={{ color: pres().fgSoft }}>
              <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: bright('#a13544') }} />{f}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── User Stories: das Schema als große Satz-Schablone ──
const SCHEMA = [
  { text: 'Als', dim: true },
  { text: 'Persona', color: '#006494', hint: 'wer braucht es?' },
  { text: 'möchte ich', dim: true },
  { text: 'Ziel', color: '#7a39bb', hint: 'was soll möglich sein?' },
  { text: 'um', dim: true },
  { text: 'Nutzen', color: '#437a22', hint: 'warum lohnt es sich?' },
]

export function StorySchema() {
  const reduce = useReducedMotion()
  return (
    <div style={{ maxWidth: 760 }}>
      <div className="flex items-baseline justify-center gap-x-2.5 gap-y-3 flex-wrap" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.1rem)' }}>
        {SCHEMA.map((s, i) => s.dim
          ? <motion.span key={i} {...pop(i, reduce)} style={{ color: pres().fgFaint }}>{s.text}</motion.span>
          : (
            <motion.span
              key={i} {...pop(i, reduce)}
              className="px-3.5 py-0.5 rounded-xl"
              style={{ background: `${s.color}28`, border: `1px solid ${bright(s.color!)}77`, color: bright(s.color!) }}
            >
              {s.text}
            </motion.span>
          ))}
        <motion.span {...pop(6, reduce)} style={{ color: pres().fgFaint }}>.</motion.span>
      </div>
      <div className="flex justify-center gap-3 flex-wrap mt-5">
        {SCHEMA.filter((s) => !s.dim).map((s, i) => (
          <motion.span key={s.text} {...pop(7 + i, reduce)} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: pres().chip, color: pres().fgSoft }}>
            <strong style={{ color: bright(s.color!) }}>{s.text}</strong> – {s.hint}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ── User Stories: eine echte Story als Karte (z. B. U47, der Sitz-Hold) ──
const prioCfg: Record<string, { label: string; color: string }> = {
  high: { label: 'Hohe Priorität', color: '#ef4444' },
  medium: { label: 'Mittlere Priorität', color: '#f59e0b' },
  low: { label: 'Niedrige Priorität', color: '#22c55e' },
}
const relColor: Record<number, string> = { 1: '#437a22', 2: '#d19900', 3: '#a13544' }
const relLabel: Record<number, string> = { 1: 'Release 1 – MVP', 2: 'Release 2 – Erweiterung', 3: 'Release 3 – Vollausbau' }

export function StoryKarte({ id }: { id: string }) {
  const reduce = useReducedMotion()
  const s = stories.erweitert.find((x) => x.id === id)!
  const p = personaById[s.persona]
  const prio = prioCfg[s.priority]
  return (
    <div className="w-full rounded-2xl overflow-hidden text-left" style={{ maxWidth: 680, background: pres().chip, border: `1px solid ${pres().line}` }}>
      <motion.div {...pop(0, reduce)} className="flex items-center gap-2 px-5 pt-4 flex-wrap">
        <span className="font-mono text-[15px] font-bold" style={{ color: bright('#006494') }}>{s.id}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${prio.color}26`, color: bright(prio.color) }}>{prio.label}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${relColor[s.release]}26`, color: bright(relColor[s.release]) }}>{relLabel[s.release]}</span>
        {p && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px]" style={{ color: pres().fgSoft }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ background: p.color }}>{p.avatar}</span>
            {p.name.split(' ')[0]}
          </span>
        )}
      </motion.div>
      <motion.p {...pop(1, reduce)} className="px-5 py-3 text-[13.5px] italic leading-relaxed" style={{ color: pres().fg }}>
        {s.story}
      </motion.p>
      <div className="px-5 pb-4">
        <p className="text-[9.5px] font-bold uppercase tracking-wider mb-2" style={{ color: pres().fgFaint }}>Akzeptanzkriterien</p>
        {s.acceptanceCriteria.map((c, i) => (
          <motion.p key={c} {...pop(2 + i, reduce)} className="flex items-start gap-2 text-[12px] leading-relaxed mb-1.5" style={{ color: pres().fgSoft }}>
            <CheckCircle2 size={14} style={{ color: bright('#437a22'), flexShrink: 0, marginTop: 2 }} />{c}
          </motion.p>
        ))}
      </div>
    </div>
  )
}

// ── User Stories: Verteilung über Releases und Prioritäten ──
export function StoryVerteilung({ tier = 'erweitert' }: { tier?: 'basis' | 'erweitert' }) {
  const reduce = useReducedMotion()
  const alle = stories[tier]
  const bars = [
    {
      label: 'Nach Release',
      segs: [1, 2, 3].map((r) => ({
        key: `Release ${r}`, n: alle.filter((s) => s.release === r).length, color: relColor[r],
      })),
    },
    {
      label: 'Nach Priorität (MoSCoW)',
      segs: (['high', 'medium', 'low'] as const).map((pr) => ({
        key: prioCfg[pr].label.split(' ')[0], n: alle.filter((s) => s.priority === pr).length, color: prioCfg[pr].color,
      })),
    },
  ]
  return (
    <div className="w-full space-y-5" style={{ maxWidth: 620 }}>
      <motion.div {...pop(0, reduce)} className="flex justify-center gap-2">
        {tier === 'erweitert' ? (
          <>
            <span className="text-[11.5px] px-3 py-1 rounded-full font-semibold" style={{ background: pres().chipStrong, color: pres().fgSoft }}>
              {stories.basis.length} Stories im Einfach-Modus
            </span>
            <span className="text-[11.5px] px-1 py-1" style={{ color: pres().fgFaint }}>⊂</span>
            <span className="text-[11.5px] px-3 py-1 rounded-full font-semibold" style={{ background: pres().chipStrong, color: pres().fgSoft }}>
              {alle.length} im Erweitert-Modus
            </span>
          </>
        ) : (
          <span className="text-[11.5px] px-3 py-1 rounded-full font-semibold" style={{ background: pres().chipStrong, color: pres().fgSoft }}>
            {alle.length} Stories im Einfach-Modus (Basis-Auswahl)
          </span>
        )}
      </motion.div>
      {bars.map((b, bi) => (
        <div key={b.label} className="text-left">
          <motion.p {...pop(1 + bi * 2, reduce)} className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: pres().fgFaint }}>{b.label}</motion.p>
          <div className="flex h-9 rounded-lg overflow-hidden" style={{ border: `1px solid ${pres().line}` }}>
            {b.segs.map((seg, si) => (
              <motion.div
                key={seg.key}
                initial={reduce ? { opacity: 0 } : { width: '0%' }}
                animate={reduce ? { opacity: 1 } : { width: `${(seg.n / alle.length) * 100}%` }}
                transition={{ delay: 0.35 + bi * 0.16 + si * 0.08, duration: 0.55, ease: VEASE }}
                className="flex items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap"
                style={{ background: `${seg.color}55`, borderRight: si < 2 ? '1px solid rgba(0,0,0,0.4)' : undefined }}
              >
                <span className="text-[13px] font-bold" style={{ color: bright(seg.color) }}>{seg.n}</span>
                <span className="text-[10px] hidden sm:inline" style={{ color: pres().fgSoft }}>{seg.key}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Story Map: das Backbone (Aktivitäten in Reihenfolge der Nutzerreise) ──
const activityColors = ['#01696f', '#006494', '#7a39bb', '#437a22', '#a13544', '#964219', '#2d6a8c', '#9333ea', '#c2410c', '#0e7490']

export function BackboneChips({ tier = 'erweitert' }: { tier?: 'basis' | 'erweitert' }) {
  const reduce = useReducedMotion()
  const alle = storyMaps[tier].activities
  const basisIds = new Set(storyMaps.basis.activities.map((a) => a.id))
  return (
    <div className="flex justify-center items-center gap-x-1.5 gap-y-2.5 flex-wrap" style={{ maxWidth: 900 }}>
      {alle.map((a, i) => {
        const c = activityColors[i % activityColors.length]
        const erwOnly = tier === 'erweitert' && !basisIds.has(a.id)
        return (
          <span key={a.id} className="inline-flex items-center gap-1.5">
            <motion.span
              {...pop(i, reduce)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide"
              style={{
                background: `${c}2c`, color: bright(c),
                border: erwOnly ? `1px dashed ${bright(c)}88` : `1px solid ${bright(c)}55`,
                opacity: erwOnly ? 0.75 : 1,
              }}
              title={erwOnly ? 'nur im Erweitert-Modus' : undefined}
            >
              {a.name}{erwOnly ? ' +' : ''}
            </motion.span>
            {i < alle.length - 1 && (
              <motion.span {...pop(i, reduce)} style={{ color: pres().fgFaint }}>→</motion.span>
            )}
          </span>
        )
      })}
      {tier === 'erweitert' && (
        <motion.p {...pop(alle.length, reduce)} className="w-full text-[10.5px] mt-1" style={{ color: pres().fgFaint }}>
          „+" = Aktivität kommt erst im Erweitert-Modus dazu ({storyMaps.basis.activities.length} → {alle.length})
        </motion.p>
      )}
    </div>
  )
}

// ── Story Map: die drei Release-Bänder (R1 = MVP hervorgehoben) ──
export function ReleaseBaender({ tier = 'erweitert' }: { tier?: 'basis' | 'erweitert' }) {
  const reduce = useReducedMotion()
  const alle = stories[tier]
  const cfg = [
    { r: 1, label: 'Release 1 – MVP', color: '#437a22', hl: true, note: 'die schmale, lauffähige Scheibe — ihren Kern zeigt der Prototyp' },
    { r: 2, label: 'Release 2 – Erweiterung', color: '#d19900', hl: false, note: 'Komfort, Gastro & Service, Facility' },
    { r: 3, label: 'Release 3 – Vollausbau', color: '#a13544', hl: false, note: 'Empfehlungen, Reports, Multi-Site' },
  ]
  return (
    <div className="w-full space-y-2.5" style={{ maxWidth: 640 }}>
      <motion.p {...pop(0, reduce)} className="text-[10.5px] font-bold uppercase tracking-[0.2em]" style={{ color: pres().fgFaint }}>
        alle Aktivitäten →
      </motion.p>
      {cfg.map((c, i) => {
        const n = alle.filter((s) => s.release === c.r).length
        return (
          <motion.div
            key={c.r} {...pop(1 + i, reduce)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-left"
            style={{
              background: `${c.color}${c.hl ? '30' : '1a'}`,
              border: c.hl ? `1.5px solid ${bright(c.color)}` : `1px solid ${c.color}55`,
              boxShadow: c.hl ? `0 0 28px ${c.color}55` : undefined,
              opacity: c.hl ? 1 : 0.82,
            }}
          >
            <span className="text-[12.5px] font-bold whitespace-nowrap" style={{ color: bright(c.color) }}>{c.label}</span>
            <span className="text-[10.5px] hidden sm:block" style={{ color: pres().fgFaint }}>{c.note}</span>
            <span className="ml-auto text-[12px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap" style={{ background: pres().badge, color: bright(c.color) }}>
              {n} Stories
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
