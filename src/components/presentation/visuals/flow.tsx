// Sequenz- und Zustands-Ausschnitte für den Kino-Modus. Nachrichten und
// Zustände stammen 1:1 aus sequences.json bzw. states.json — die Folie wählt
// nur den Ausschnitt und das Layout, damit er groß und lesbar ist.
import { motion, useReducedMotion } from 'motion/react'
import { sequences, stateMachines } from '@/data/content'
import { extraMachines } from '@/data/statesExtra'
import { bright, draw, fadeIn, pop } from './core'

const alleMaschinen = [...stateMachines.machines, ...extraMachines]

const KIND_COLOR: Record<string, string> = { actor: '#475569', control: '#4f46e5', entity: '#7a39bb' }
const STATE_COLOR: Record<string, string> = {
  FREI: '#437a22', 'AUSGEWÄHLT': '#7a39bb', RESERVIERT: '#d19900', BELEGT: '#a13544', DEFEKT: '#64748b',
  'GÜLTIG': '#437a22', 'EINGELÖST': '#006494', STORNIERT: '#a13544', ABGELAUFEN: '#64748b',
  ERFOLGREICH: '#437a22', AUSSTEHEND: '#d19900', FEHLGESCHLAGEN: '#a13544', 'BESTÄTIGT': '#006494',
  ERSTATTET: '#7a39bb',
}

// "VorstellungSitz: FREI→RESERVIERT (reserviertBis +10 min)" → Badge-Text + Zielzustands-Farbe
function parseEffect(e: string) {
  const text = e.replace(/\s*\(.*\)\s*/, '').trim()
  const target = text.split('→').pop()!.trim()
  return { text, color: STATE_COLOR[target] ?? '#64748b' }
}

// Pfeilspitze an (x,y) mit Richtung ang
function head(x: number, y: number, ang: number, fill: string) {
  const b1x = x - 10 * Math.cos(ang) + 4.5 * Math.sin(ang)
  const b1y = y - 10 * Math.sin(ang) - 4.5 * Math.cos(ang)
  const b2x = x - 10 * Math.cos(ang) - 4.5 * Math.sin(ang)
  const b2y = y - 10 * Math.sin(ang) + 4.5 * Math.cos(ang)
  return <polygon points={`${x},${y} ${b1x},${b1y} ${b2x},${b2y}`} fill={fill} />
}

// ── Sequenz-Ausschnitt: gewählte Nachrichten eines Flows ──
interface SeqProps {
  flow: string
  msgSeqs: string[]
  frame?: { label: string; guard: string }  // kombiniertes Fragment (z. B. alt-Operand)
}

export function SeqAusschnitt({ flow, msgSeqs, frame }: SeqProps) {
  const reduce = useReducedMotion()
  const d = sequences.find((s) => s.id === flow)!
  const msgs = msgSeqs.map((n) => d.messages.find((m) => m.seq === n)!)
  const parts = d.participants.filter((p) => msgs.some((m) => m.from === p.id || m.to === p.id))
  const spacing = parts.length <= 3 ? 250 : parts.length === 4 ? 212 : parts.length === 5 ? 178 : 156
  const W = parts.length * spacing
  const colX = (id: string) => parts.findIndex((p) => p.id === id) * spacing + spacing / 2

  const rowY: number[] = []
  let cur = frame ? 104 : 88
  for (const m of msgs) { rowY.push(cur); cur += m.stateEffect ? 78 : 50 }
  const H = cur - 8

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W }} className="h-auto" role="img" aria-label={`Ausschnitt aus ${d.title}`}>
      {/* Lebenslinien */}
      {parts.map((p, i) => (
        <motion.line
          key={p.id} {...draw(i, reduce, 0.2)}
          x1={colX(p.id)} y1={44} x2={colX(p.id)} y2={H - 4}
          stroke="rgba(255,255,255,0.18)" strokeWidth={1} strokeDasharray="5 6"
        />
      ))}

      {/* Fragment-Rahmen */}
      {frame && (
        <motion.g {...fadeIn(0, reduce, 0.3, 0)}>
          <rect x={10} y={58} width={W - 20} height={H - 66} rx={6} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.2} />
          <path d="M 10 58 h 46 v 15 l -8 8 h -38 z" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
          <text x={21} y={74} fontSize={11} fontWeight={700} fill="rgba(255,255,255,0.85)">{frame.label}</text>
          <text x={66} y={74} fontSize={10.5} fontFamily="ui-monospace, monospace" fill="#ffce56">{frame.guard}</text>
        </motion.g>
      )}

      {/* Teilnehmer */}
      {parts.map((p, i) => {
        const c = KIND_COLOR[p.kind]
        const x = colX(p.id)
        const bw = Math.min(spacing - 6, 200)
        return (
          <motion.g key={p.id} {...fadeIn(i, reduce, 0.2, 0)}>
            <rect x={x - bw / 2} y={6} width={bw} height={34} rx={9} fill={`${c}3c`} stroke={`${bright(c)}66`} strokeWidth={1} />
            <text
              x={x} y={27} textAnchor="middle" fontSize={12} fontWeight={600}
              fontFamily={p.kind === 'actor' ? undefined : 'ui-monospace, monospace'} fill={bright(c)}
            >
              {p.label}
            </text>
          </motion.g>
        )
      })}

      {/* Nachrichten */}
      {msgs.map((m, i) => {
        const y = rowY[i]
        const x1 = colX(m.from)
        const x2 = colX(m.to)
        const sgn = x2 >= x1 ? 1 : -1
        const dashed = m.type === 'return' || m.type === 'create'
        const xEnd = x2 - 7 * sgn
        const mid = (x1 + x2) / 2
        const eff = m.stateEffect ? parseEffect(m.stateEffect) : null
        const bw = eff ? eff.text.length * 6.1 + 18 : 0
        return (
          <g key={m.id}>
            <motion.line
              {...draw(i, reduce, 0.45)}
              x1={x1} y1={y} x2={xEnd} y2={y}
              stroke="rgba(255,255,255,0.75)" strokeWidth={1.5}
              strokeDasharray={dashed ? '6 5' : undefined}
            />
            <motion.g {...fadeIn(i, reduce, 0.45)}>
              {dashed
                ? <polyline points={`${x2 - 11 * sgn},${y - 5} ${x2 - 2 * sgn},${y} ${x2 - 11 * sgn},${y + 5}`} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1.5} />
                : <polygon points={`${x2 - 2 * sgn},${y} ${x2 - 12 * sgn},${y - 5.5} ${x2 - 12 * sgn},${y + 5.5}`} fill="rgba(255,255,255,0.9)" />}
              <text x={mid} y={y - 9} textAnchor="middle" fontSize={12} fontWeight={500} fill="rgba(255,255,255,0.88)">{m.label}</text>
              {eff && (
                <g>
                  <rect x={mid - bw / 2} y={y + 10} width={bw} height={20} rx={10} fill={`${eff.color}30`} stroke={`${bright(eff.color)}88`} strokeWidth={0.8} />
                  <text x={mid} y={y + 24} textAnchor="middle" fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600} fill={bright(eff.color)}>{eff.text}</text>
                </g>
              )}
            </motion.g>
          </g>
        )
      })}
    </svg>
  )
}

// ── Zustands-Ausschnitt: gewählte Zustände/Übergänge eines Automaten ──
interface SNode { id: string; x: number; y: number }
interface SEdge {
  from: string
  to: string
  event: string
  guard?: string
  curve?: number   // Bogen statt Gerade: negativ = oben, positiv = unten
  dim?: boolean    // Kontextkante: statisch, stark abgedunkelt
  inline?: boolean // Guard in derselben Zeile wie das Ereignis (bei engen Layouts)
  t?: number       // Labelposition entlang der Kante (0..1, Standard Mitte)
}
interface StateProps {
  machineId: string
  nodes: SNode[]
  edges: SEdge[]
  w: number
  h: number
  initialTo?: string
  initialLabel?: string
}

const NW = 74
const NH = 24

export function StateAusschnitt({ machineId, nodes, edges, w, h, initialTo, initialLabel }: StateProps) {
  const reduce = useReducedMotion()
  const machine = alleMaschinen.find((m) => m.id === machineId)!
  const st = (id: string) => machine.states.find((s) => s.id === id)!
  const pos = Object.fromEntries(nodes.map((nd) => [nd.id, nd]))

  const geom = (e: SEdge) => {
    const a = pos[e.from]
    const b = pos[e.to]
    if (e.curve) {
      const s = e.curve < 0 ? -1 : 1
      const y1 = a.y + NH * s
      const y2 = b.y + NH * s
      const cx = (a.x + b.x) / 2
      const cy = (e.curve < 0 ? Math.min(y1, y2) : Math.max(y1, y2)) + e.curve
      const pm = 0.25 * y1 + 0.5 * cy + 0.25 * y2
      return {
        path: `M ${a.x} ${y1} Q ${cx} ${cy} ${b.x} ${y2}`,
        end: [b.x, y2] as const,
        ang: Math.atan2(y2 - cy, b.x - cx),
        lx: cx,
        eventY: e.curve < 0 ? pm - 22 : pm + 18,
        guardY: e.curve < 0 ? pm - 8 : pm + 32,
      }
    }
    const sgn = b.x >= a.x ? 1 : -1
    const x1 = a.x + NW * sgn
    const x2 = b.x - (NW + 5) * sgn
    const t = e.t ?? 0.5
    const ly = a.y + (b.y - a.y) * t
    return {
      path: `M ${x1} ${a.y} L ${x2} ${b.y}`,
      end: [x2, b.y] as const,
      ang: Math.atan2(b.y - a.y, x2 - x1),
      lx: x1 + (x2 - x1) * t,
      eventY: ly - 13,
      guardY: ly + 21,
    }
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', maxWidth: w }} className="h-auto" role="img" aria-label={`Ausschnitt aus ${machine.title}`}>
      {/* Startmarkierung */}
      {initialTo && (() => {
        const t = pos[initialTo]
        const cx0 = t.x - NW - 46
        return (
          <motion.g {...fadeIn(0, reduce, 0.2, 0)}>
            <circle cx={cx0} cy={t.y} r={5.5} fill="rgba(255,255,255,0.9)" />
            <line x1={cx0 + 6} y1={t.y} x2={t.x - NW - 10} y2={t.y} stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} />
            {head(t.x - NW - 4, t.y, 0, 'rgba(255,255,255,0.9)')}
            {initialLabel && <text x={8} y={t.y + 44} fontSize={9.5} fill="rgba(255,255,255,0.5)">{initialLabel}</text>}
          </motion.g>
        )
      })()}

      {/* Kanten */}
      {edges.map((e, i) => {
        const g = geom(e)
        if (e.dim) {
          return (
            <g key={i} opacity={0.16}>
              <path d={g.path} fill="none" stroke="#fff" strokeWidth={1.3} />
              {head(g.end[0], g.end[1], g.ang, '#fff')}
            </g>
          )
        }
        return (
          <g key={i}>
            <motion.path {...draw(i, reduce, 0.35)} d={g.path} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={1.6} />
            <motion.g {...fadeIn(i, reduce, 0.35)}>
              {head(g.end[0], g.end[1], g.ang, 'rgba(255,255,255,0.9)')}
              <text x={g.lx} y={g.eventY} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="rgba(255,255,255,0.88)" stroke="#000" strokeWidth={3.5} paintOrder="stroke">
                {e.event}
                {e.inline && e.guard && <tspan fontSize={10} fontWeight={400} fontFamily="ui-monospace, monospace" fill="rgba(255,255,255,0.52)">{'  '}[{e.guard}]</tspan>}
              </text>
              {!e.inline && e.guard && (
                <text x={g.lx} y={g.guardY} textAnchor="middle" fontSize={10} fontFamily="ui-monospace, monospace" fill="rgba(255,255,255,0.52)" stroke="#000" strokeWidth={3} paintOrder="stroke">[{e.guard}]</text>
              )}
            </motion.g>
          </g>
        )
      })}

      {/* Zustände */}
      {nodes.map((nd, i) => {
        const s = st(nd.id)
        const color = s.color ?? '#64748b'
        const showLabel = !!s.label && s.label.toUpperCase() !== nd.id
        return (
          <motion.g key={nd.id} {...fadeIn(i, reduce, 0.2, 0)}>
            <rect x={nd.x - NW} y={nd.y - NH} width={NW * 2} height={NH * 2} rx={13} fill={`${color}2a`} stroke={`${bright(color)}99`} strokeWidth={1.3} />
            <text
              x={nd.x} y={nd.y + (showLabel ? 0 : 4.5)} textAnchor="middle"
              fontSize={13} fontWeight={700} fontFamily="ui-monospace, monospace" fill={bright(color)}
            >
              {nd.id}
            </text>
            {showLabel && <text x={nd.x} y={nd.y + 15} textAnchor="middle" fontSize={8.5} fill="rgba(255,255,255,0.5)">{s.label}</text>}
          </motion.g>
        )
      })}
    </svg>
  )
}

// ── Vorgefertigte Zustands-Folien ──

// Sitz je Vorstellung: der Weg zum belegten Sitz (Zickzack, groß lesbar)
export function SitzHappyPath() {
  return (
    <StateAusschnitt
      machineId="vorstellungSitz"
      w={940} h={200} initialTo="FREI"
      nodes={[
        { id: 'FREI', x: 132, y: 44 },
        { id: 'AUSGEWÄHLT', x: 372, y: 152 },
        { id: 'RESERVIERT', x: 612, y: 44 },
        { id: 'BELEGT', x: 852, y: 152 },
      ]}
      edges={[
        { from: 'FREI', to: 'AUSGEWÄHLT', event: 'auswählen()', guard: 'Sitz nicht DEFEKT' },
        { from: 'AUSGEWÄHLT', to: 'RESERVIERT', event: 'reservieren(sessionId)', guard: 'serverseitig noch FREI' },
        { from: 'RESERVIERT', to: 'BELEGT', event: 'belegen(buchung)', guard: 'Hold gültig, Zahlung erfolgreich' },
      ]}
    />
  )
}

// Sitz je Vorstellung: Rückwege (Hold-Timeout und Storno)
export function SitzRueckwege() {
  return (
    <StateAusschnitt
      machineId="vorstellungSitz"
      w={810} h={252}
      nodes={[
        { id: 'FREI', x: 132, y: 140 },
        { id: 'RESERVIERT', x: 430, y: 140 },
        { id: 'BELEGT', x: 728, y: 140 },
      ]}
      edges={[
        { from: 'FREI', to: 'RESERVIERT', event: '', dim: true },
        { from: 'RESERVIERT', to: 'BELEGT', event: '', dim: true },
        { from: 'RESERVIERT', to: 'FREI', curve: -68, event: 'freigeben() / istAbgelaufen()', guard: 'Timeout (10 min) ODER Checkout abgebrochen' },
        { from: 'BELEGT', to: 'FREI', curve: 70, event: 'Buchung.stornieren()', guard: 'vor Vorstellungsbeginn / Kulanz' },
      ]}
    />
  )
}

// Ticket-Lebenszyklus: ein Anfang, drei Enden
export function TicketZyklus() {
  return (
    <StateAusschnitt
      machineId="ticket"
      w={690} h={210} initialTo="GÜLTIG"
      initialLabel="Ticket erzeugt [VorstellungSitz → BELEGT]"
      nodes={[
        { id: 'GÜLTIG', x: 190, y: 96 },
        { id: 'EINGELÖST', x: 600, y: 28 },
        { id: 'STORNIERT', x: 600, y: 96 },
        { id: 'ABGELAUFEN', x: 600, y: 164 },
      ]}
      edges={[
        { from: 'GÜLTIG', to: 'EINGELÖST', event: 'validiere(qrCode)', guard: 'nicht bereits gescannt', inline: true },
        { from: 'GÜLTIG', to: 'STORNIERT', event: 'Buchung.stornieren()' },
        { from: 'GÜLTIG', to: 'ABGELAUFEN', event: 'Vorstellung beendet', guard: 'nie eingelöst' },
      ]}
    />
  )
}

// Buchungs-Lebenszyklus (Erweitert): Ausschnitt mit dem Hauptpfad
export function BuchungZyklus() {
  return (
    <StateAusschnitt
      machineId="buchung"
      w={810} h={224} initialTo="AUSSTEHEND"
      initialLabel="anlegen(antrag)"
      nodes={[
        { id: 'AUSSTEHEND', x: 150, y: 104 },
        { id: 'BESTÄTIGT', x: 440, y: 44 },
        { id: 'STORNIERT', x: 452, y: 176 },
        { id: 'EINGELÖST', x: 724, y: 44 },
      ]}
      edges={[
        { from: 'AUSSTEHEND', to: 'BESTÄTIGT', event: 'bestätigen()', guard: 'Zahlung ERFOLGREICH', t: 0.64 },
        { from: 'AUSSTEHEND', to: 'STORNIERT', event: 'abbrechen()', guard: 'Zahlung fehlgeschlagen / Hold-Timeout', inline: true, t: 0.6 },
        { from: 'BESTÄTIGT', to: 'EINGELÖST', event: 'einchecken()', guard: 'QR validiert' },
      ]}
    />
  )
}

// Zahlungs-Lebenszyklus (Erweitert): verarbeiten → ok/abgelehnt → erstatten
export function ZahlungZyklus() {
  return (
    <StateAusschnitt
      machineId="zahlung"
      w={810} h={224} initialTo="AUSSTEHEND"
      initialLabel="verarbeiten()"
      nodes={[
        { id: 'AUSSTEHEND', x: 150, y: 104 },
        { id: 'ERFOLGREICH', x: 440, y: 44 },
        { id: 'FEHLGESCHLAGEN', x: 452, y: 176 },
        { id: 'ERSTATTET', x: 724, y: 44 },
      ]}
      edges={[
        { from: 'AUSSTEHEND', to: 'ERFOLGREICH', event: 'ok', guard: 'Autorisierung erteilt', t: 0.64 },
        { from: 'AUSSTEHEND', to: 'FEHLGESCHLAGEN', event: 'abgelehnt', guard: 'Deckung/Autorisierung fehlt', inline: true, t: 0.6 },
        { from: 'ERFOLGREICH', to: 'ERSTATTET', event: 'erstatten()', guard: 'Storno' },
      ]}
    />
  )
}

// ── Übersicht der vier Sequenz-Flows (Intro-Folie) ──
export function FlowUebersicht() {
  const reduce = useReducedMotion()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ maxWidth: 720 }}>
      {sequences.map((d, i) => (
        <motion.div
          key={d.id} {...pop(i, reduce)}
          className="rounded-xl px-4 py-3 text-left"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.13)' }}
        >
          <div className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.92)' }}>{d.title}</div>
          <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {d.participants.length} Teilnehmer · {d.messages.length} Nachrichten
          </div>
        </motion.div>
      ))}
    </div>
  )
}
