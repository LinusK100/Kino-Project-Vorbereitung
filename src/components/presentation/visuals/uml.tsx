// UML-Ausschnitte für den Kino-Modus. Jede Folie zeigt echte Klassen aus
// uml.json — reduziert auf die Attribute/Operationen, um die es gerade geht,
// damit der Ausschnitt groß und lesbar bleibt.
import { motion, useReducedMotion } from 'motion/react'
import { uml } from '@/data/content'
import { UML_GROUP_COLOR } from '@/lib/statusColors'
import { bright, pop, VEASE } from './core'

const byId = Object.fromEntries(uml.classes.map((c) => [c.id, c]))

interface UmlBoxProps {
  id: string
  attrs?: string[]      // Attributnamen, die diese Folie zeigt
  methods?: string[]    // Operationsnamen, die diese Folie zeigt
  highlight?: string[]  // hervorgehobene Zeilen
  emphasized?: boolean  // Akzent-Rahmen (z. B. Assoziationsklasse)
  width?: number
  i?: number
}

export function UmlBox({ id, attrs = [], methods = [], highlight = [], emphasized, width = 190, i = 0 }: UmlBoxProps) {
  const reduce = useReducedMotion()
  const c = byId[id]
  const color = UML_GROUP_COLOR[c.group]
  const isEnum = c.group === 'enum'

  const attrRows = c.attributes
    .filter((a) => attrs.includes(a.name))
    .map((a) => ({
      key: a.name,
      label: isEnum ? a.name : `${a.visibility} ${a.name}: ${a.type}`,
      hl: highlight.includes(a.name),
    }))
  const methodRows = c.methods
    .filter((m) => methods.includes(m.name))
    .map((m) => ({
      key: m.name,
      label: `${m.visibility} ${m.name}(${m.params.length > 22 ? '…' : m.params}): ${m.returnType}`,
      hl: highlight.includes(m.name),
    }))

  return (
    <motion.div
      {...pop(i, reduce)}
      className="text-left flex-shrink-0"
      style={{
        width,
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${emphasized ? bright(color) : 'rgba(255,255,255,0.16)'}`,
        background: 'rgba(255,255,255,0.045)',
        boxShadow: emphasized ? `0 0 36px ${color}66` : '0 2px 14px rgba(0,0,0,0.5)',
      }}
    >
      <div className="px-3 py-1.5 text-center" style={{ background: `${color}30`, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        {c.stereotype && <div className="text-[9px] font-mono leading-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>{c.stereotype}</div>}
        <div className="text-[13px] font-bold leading-snug" style={{ color: bright(color) }}>{c.id}</div>
      </div>
      {attrRows.length > 0 && <Compartment rows={attrRows} color={color} />}
      {methodRows.length > 0 && <Compartment rows={methodRows} color={color} divider />}
    </motion.div>
  )
}

function Compartment({ rows, color, divider }: { rows: { key: string; label: string; hl: boolean }[]; color: string; divider?: boolean }) {
  return (
    <div className="px-3 py-1.5" style={divider ? { borderTop: '1px solid rgba(255,255,255,0.1)' } : undefined}>
      {rows.map((r) => (
        <div
          key={r.key}
          className="font-mono text-[10.5px] leading-[1.55] whitespace-nowrap overflow-hidden text-ellipsis"
          style={r.hl ? { color: bright(color), fontWeight: 600 } : { color: 'rgba(255,255,255,0.68)' }}
        >
          {r.label}
        </div>
      ))}
    </div>
  )
}

interface UmlRelProps {
  kind: 'composition' | 'association'
  label?: string
  from?: string        // Multiplizität am linken Ende
  to?: string          // Multiplizität am rechten Ende
  owner?: 'l' | 'r'    // Komposition: Raute an diesem Ende
  dir?: 'l' | 'r'      // Assoziation: Pfeilspitze zeigt dorthin
  w?: number
  i?: number
}

export function UmlRel({ kind, label, from, to, owner = 'l', dir = 'r', w = 92, i = 0 }: UmlRelProps) {
  const reduce = useReducedMotion()
  const y = 30
  return (
    <motion.div {...pop(i, reduce)} className="flex-shrink-0">
      <svg viewBox={`0 0 ${w} 60`} width={w} height={60} aria-hidden>
        <line x1={4} y1={y} x2={w - 4} y2={y} stroke="rgba(255,255,255,0.5)" strokeWidth={1.4} />
        {kind === 'composition' && (owner === 'l'
          ? <polygon points={`2,${y} 11,${y - 5} 20,${y} 11,${y + 5}`} fill="#fff" opacity={0.85} />
          : <polygon points={`${w - 2},${y} ${w - 11},${y - 5} ${w - 20},${y} ${w - 11},${y + 5}`} fill="#fff" opacity={0.85} />)}
        {kind === 'association' && (dir === 'r'
          ? <polyline points={`${w - 13},${y - 5} ${w - 4},${y} ${w - 13},${y + 5}`} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1.4} />
          : <polyline points={`13,${y - 5} 4,${y} 13,${y + 5}`} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1.4} />)}
        {from && <text x={7} y={y - 8} fontSize={9.5} fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, monospace">{from}</text>}
        {to && <text x={w - 7} y={y - 8} textAnchor="end" fontSize={9.5} fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, monospace">{to}</text>}
        {label && <text x={w / 2} y={y + 17} textAnchor="middle" fontSize={9.5} fill="rgba(255,255,255,0.5)">{label}</text>}
      </svg>
    </motion.div>
  )
}

// ── Folie: Kompositions-Kette Kette → Kino → Kinosaal → Sitzplatz ──
export function UmlKomposition() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-y-4">
      <UmlBox i={0} id="Kette" width={160} attrs={['name']} methods={['standorte']} />
      <UmlRel i={1} kind="composition" owner="l" from="1" to="1..*" label="umfasst" w={84} />
      <UmlBox i={2} id="Kino" width={192} attrs={['name', 'adresse']} methods={['aktiveSäle']} />
      <UmlRel i={3} kind="composition" owner="l" from="1" to="1..*" label="besitzt" w={84} />
      <UmlBox i={4} id="Kinosaal" width={172} attrs={['name', 'kapazität', 'reihen']} />
      <UmlRel i={5} kind="composition" owner="l" from="1" to="1..*" label="enthält" w={84} />
      <UmlBox i={6} id="Sitzplatz" width={196} attrs={['reihe', 'nummer', 'kategorie', 'barrierefrei']} methods={['getLabel']} />
    </div>
  )
}

// ── Folie: Die Assoziationsklasse VorstellungSitz ──
export function UmlVorstellungSitz() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-y-4">
      <UmlBox i={0} id="Vorstellung" width={196} attrs={['beginn', 'ende']} methods={['istBuchbar']} />
      <UmlRel i={1} kind="composition" owner="l" from="1" to="1..*" label="belegt mit" w={96} />
      <UmlBox
        i={2} id="VorstellungSitz" width={292} emphasized
        attrs={['status', 'reserviertBis', 'buchungId']}
        methods={['reservieren', 'belegen', 'freigeben']}
        highlight={['status', 'reservieren', 'belegen', 'freigeben']}
      />
      <UmlRel i={3} kind="association" dir="l" from="*" to="1" label="Status je Vorstellung" w={126} />
      <UmlBox i={4} id="Sitzplatz" width={196} attrs={['reihe', 'nummer', 'kategorie']} />
    </div>
  )
}

// ── Folie: Buchungskette mit Operationen an den Objekten ──
export function UmlBuchungskette() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-y-4">
      <UmlBox i={0} id="Zahlung" width={182} attrs={['betragCent', 'status']} methods={['verarbeiten', 'erstatten']} highlight={['verarbeiten']} />
      <UmlRel i={1} kind="composition" owner="r" from="1" to="1" label="bezahlt durch" w={98} />
      <UmlBox i={2} id="Buchung" width={188} attrs={['summeCent', 'status']} methods={['bestätigen', 'stornieren']} highlight={['bestätigen']} />
      <UmlRel i={3} kind="composition" owner="l" from="1" to="1..*" label="enthält" w={84} />
      <UmlBox i={4} id="Ticket" width={178} attrs={['qrCode', 'status']} methods={['istGültig', 'einlösen']} highlight={['einlösen']} />
      <UmlRel i={5} kind="association" dir="r" from="1" to="1" label="gilt für" w={84} />
      <UmlBox i={6} id="VorstellungSitz" width={158} attrs={['status']} />
    </div>
  )
}

// ── Folie: 82 Klassen in fünf Gruppen ──
export function UmlGruppen() {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-stretch justify-center gap-3 flex-wrap">
      {uml.groups.map((g, i) => {
        const cs = uml.classes.filter((c) => c.group === g.id)
        const impl = cs.filter((c) => c.implementedInPrototype).length
        const color = UML_GROUP_COLOR[g.id]
        return (
          <motion.div
            key={g.id} {...pop(i, reduce)}
            className="rounded-2xl px-5 py-4 text-center"
            style={{ background: `${color}1c`, border: `1px solid ${color}66`, minWidth: 132 }}
          >
            <div className="text-[34px] font-bold leading-none" style={{ color: bright(color), fontFamily: 'var(--font-display)' }}>{cs.length}</div>
            <div className="text-[11px] font-semibold mt-1.5" style={{ color: 'rgba(255,255,255,0.85)' }}>{g.label}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{impl} implementiert</div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Folie: Modell ⊇ Prototyp (implementiert vs. Design-only) ──
export function ImplSplit({ extras = [] }: { extras?: string[] }) {
  const reduce = useReducedMotion()
  const total = uml.classes.length
  const impl = uml.classes.filter((c) => c.implementedInPrototype).length
  return (
    <div className="w-full" style={{ maxWidth: 660 }}>
      <div className="flex h-14 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.16)' }}>
        <motion.div
          initial={reduce ? { opacity: 0 } : { width: '0%' }}
          animate={reduce ? { opacity: 1 } : { width: `${(impl / total) * 100}%` }}
          transition={{ delay: 0.45, duration: 0.8, ease: VEASE }}
          className="flex items-center justify-center gap-2 overflow-hidden"
          style={{ background: '#437a22a8' }}
        >
          <span className="text-white font-bold text-xl">{impl}</span>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.8)' }}>implementiert</span>
        </motion.div>
        <div className="flex-1 flex items-center justify-center gap-2" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <span className="font-bold text-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>{total - impl}</span>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.55)' }}>Design-only</span>
        </div>
      </div>
      <motion.div {...pop(2, reduce)} className="mt-3 flex justify-center gap-2 flex-wrap">
        <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
          zusammen {total} UML-Klassen
        </span>
        {extras.map((e) => (
          <span key={e} className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>{e}</span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Folie: Zustandsautomat ≙ Status-Enum des Klassendiagramms ──
const SITZ_FARBEN: Record<string, string> = {
  FREI: '#437a22', 'AUSGEWÄHLT': '#7a39bb', RESERVIERT: '#d19900', BELEGT: '#a13544', DEFEKT: '#64748b',
}

export function EnumAbgleich() {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-center justify-center gap-5 md:gap-8 flex-wrap">
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Enum im Klassendiagramm</span>
        <UmlBox i={0} id="Sitzstatus" width={200} attrs={Object.keys(SITZ_FARBEN)} />
      </div>
      <motion.div {...pop(1, reduce)} className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>≙</motion.div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Zustände im Automaten</span>
        <div className="flex flex-col gap-1.5">
          {Object.entries(SITZ_FARBEN).map(([s, c], i) => (
            <motion.span
              key={s} {...pop(2 + i, reduce)}
              className="px-4 py-1 rounded-full text-[11.5px] font-mono font-semibold text-center"
              style={{ background: `${c}2e`, border: `1px solid ${bright(c)}88`, color: bright(c) }}
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}
