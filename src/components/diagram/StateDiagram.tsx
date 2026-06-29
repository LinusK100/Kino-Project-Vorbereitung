import { useId } from 'react'
import type { StateMachine, SmTransition } from '@/types'
import { contrastText } from '@/lib/statusColors'

// Curated node centers + edge routing hints per machine → guarantees a clean,
// overlap-free layout while all labels/colors come from the JSON.
type Side = 'spine' | 'left' | 'right' | 'self' | 'diagonal'
interface Layout {
  w: number; h: number
  nodes: Record<string, { x: number; y: number }>
  edges: Record<string, { side: Side; bow?: number; labelDy?: number; dashed?: boolean }>
}

const HW = 78, HH = 27

const LAYOUTS: Record<string, Layout> = {
  vorstellungSitz: {
    w: 1180, h: 620,
    nodes: {
      _initial: { x: 540, y: 44 },
      FREI: { x: 540, y: 104 },
      AUSGEWÄHLT: { x: 540, y: 214 },
      RESERVIERT: { x: 540, y: 324 },
      BELEGT: { x: 540, y: 434 },
      _ende: { x: 540, y: 552 },
      DEFEKT: { x: 880, y: 324 },
    },
    edges: {
      t1: { side: 'spine' },
      t2: { side: 'left', bow: 90 },
      t3: { side: 'spine' },
      t3b: { side: 'left', bow: 300 },
      t4: { side: 'spine' },
      t5: { side: 'left', bow: 180 },
      t6: { side: 'left', bow: 410 },
      t7: { side: 'diagonal', bow: 46, dashed: true },
      t8: { side: 'diagonal', bow: -64, dashed: true },
      t9: { side: 'diagonal', bow: 70, dashed: true },
      t10: { side: 'spine' },
      t11: { side: 'left', bow: 480, dashed: true },
    },
  },
  ticket: {
    w: 880, h: 480,
    nodes: {
      _initial: { x: 200, y: 44 },
      GÜLTIG: { x: 200, y: 104 },
      EINGELÖST: { x: 200, y: 260 },
      STORNIERT: { x: 480, y: 104 },
      ABGELAUFEN: { x: 480, y: 320 },
    },
    edges: {
      tt0: { side: 'spine' },
      tt1: { side: 'spine' },
      tt2: { side: 'right', bow: 40 },
      tt3: { side: 'right', bow: 60 },
    },
  },
  buchung: {
    w: 820, h: 440,
    nodes: {
      _initial: { x: 200, y: 44 },
      AUSSTEHEND: { x: 200, y: 104 },
      BESTÄTIGT: { x: 200, y: 240 },
      EINGELÖST: { x: 200, y: 372 },
      STORNIERT: { x: 520, y: 240 },
    },
    edges: {
      b0: { side: 'spine' },
      b1: { side: 'spine' },
      b2: { side: 'left', bow: 60 },
      b3: { side: 'spine' },
      b4: { side: 'right', bow: 40 },
    },
  },
  zahlung: {
    w: 820, h: 420,
    nodes: {
      _initial: { x: 200, y: 44 },
      AUSSTEHEND: { x: 200, y: 104 },
      ERFOLGREICH: { x: 200, y: 250 },
      FEHLGESCHLAGEN: { x: 520, y: 104 },
      ERSTATTET: { x: 200, y: 372 },
    },
    edges: {
      z0: { side: 'spine' },
      z1: { side: 'spine' },
      z2: { side: 'right', bow: 40 },
      z3: { side: 'spine' },
    },
  },
}

function autoLayout(m: StateMachine): Layout {
  // simple vertical fallback
  const ids = [m.initial === m.states[0]?.id ? '_initial' : '_initial', ...m.states.map((s) => s.id)]
  const nodes: Layout['nodes'] = {}
  ids.forEach((id, i) => { nodes[id] = { x: 240, y: 44 + i * 100 } })
  const edges: Layout['edges'] = {}
  m.transitions.forEach((t) => { edges[t.id] = { side: t.to && nodes[t.to] && nodes[t.from] && nodes[t.to].y < nodes[t.from].y ? 'left' : 'spine' } })
  return { w: 600, h: 44 + ids.length * 100, nodes, edges }
}

// Event only on the diagram (guards/actions live in the table) → short, readable labels.
function edgeLabel(t: SmTransition): string {
  const first = t.event.split('/')[0].trim()
  const m = first.match(/^[A-Za-zÄÖÜäöü.]+\([^)]*\)/)
  return m ? m[0].replace(/\([^)]*\)/, '()') : first
}

export function StateDiagram({ machine }: { machine: StateMachine }) {
  const uid = useId().replace(/:/g, '')
  const L = LAYOUTS[machine.id] ?? autoLayout(machine)

  const nodeColor = (id: string) => machine.states.find((s) => s.id === id)?.color ?? '#64748b'

  type P = { d: string; lx: number; ly: number; dashed?: boolean }
  const path = (t: SmTransition): P | null => {
    const a = L.nodes[t.from]; const b = L.nodes[t.to]
    if (!a || !b) return null
    const hint = L.edges[t.id] ?? { side: 'spine' as Side }
    const bow = hint.bow ?? 80
    const dy = hint.labelDy ?? 0
    if (t.from === t.to) {
      const x = a.x + HW
      return { d: `M ${x} ${a.y - 12} C ${x + 54} ${a.y - 34}, ${x + 54} ${a.y + 34}, ${x} ${a.y + 12}`, lx: x + 30, ly: a.y, dashed: hint.dashed }
    }
    // Diagonal: nodes not vertically aligned (e.g. side-state DEFEKT)
    if (hint.side === 'diagonal' || Math.abs(a.x - b.x) > HW * 1.6) {
      const dir = b.x > a.x ? 1 : -1
      const sx = a.x + dir * HW, ex = b.x - dir * HW
      const cy = (a.y + b.y) / 2 + bow
      return { d: `M ${sx} ${a.y} C ${(sx + ex) / 2} ${a.y + bow}, ${(sx + ex) / 2} ${b.y + bow}, ${ex} ${b.y}`, lx: (sx + ex) / 2, ly: cy, dashed: hint.dashed }
    }
    if (hint.side === 'spine') {
      const down = b.y > a.y
      const sy = down ? a.y + HH : a.y - HH
      const ey = down ? b.y - HH : b.y + HH
      return { d: `M ${a.x} ${sy} C ${a.x} ${(sy + ey) / 2}, ${b.x} ${(sy + ey) / 2}, ${b.x} ${ey}`, lx: (a.x + b.x) / 2 + 64, ly: (sy + ey) / 2 + dy, dashed: hint.dashed }
    }
    // Same-x curved arc bowing left/right; label centered at the apex.
    const dir = hint.side === 'left' ? -1 : 1
    const sx = a.x + dir * HW, ex = b.x + dir * HW
    const cx1 = sx + dir * bow, cx2 = ex + dir * bow
    const apexX = a.x + dir * (HW + bow * 0.75)
    const apexY = (a.y + b.y) / 2
    return { d: `M ${sx} ${a.y} C ${cx1} ${a.y}, ${cx2} ${b.y}, ${ex} ${b.y}`, lx: apexX, ly: apexY + dy, dashed: hint.dashed }
  }

  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} width={L.w} height={L.h} role="img" aria-label={`Zustandsdiagramm ${machine.title}`} style={{ fontFamily: 'var(--font-body)' }}>
      <defs>
        <marker id={`arr-${uid}`} markerWidth="11" markerHeight="11" refX="8.5" refY="4" orient="auto">
          <path d="M0,0 L9,4 L0,8 z" fill="var(--text-secondary)" />
        </marker>
      </defs>

      {/* edges */}
      {machine.transitions.map((t) => {
        const p = path(t)
        if (!p) return null
        const label = edgeLabel(t)
        const w = label.length * 6.1 + 14
        return (
          <g key={t.id}>
            <path d={p.d} fill="none" stroke="var(--text-secondary)" strokeWidth={1.6} strokeDasharray={p.dashed ? '5 4' : undefined} markerEnd={`url(#arr-${uid})`} opacity={p.dashed ? 0.55 : 0.9} />
            <g transform={`translate(${p.lx - w / 2}, ${p.ly - 9})`}>
              <rect width={w} height={18} rx={5} fill="var(--card-bg)" stroke="var(--border-color)" strokeWidth={1} />
              <text x={w / 2} y={13} textAnchor="middle" fontSize={10.5} fill="var(--text-primary)" style={{ fontFamily: 'var(--mono, monospace)' }}>{label}</text>
            </g>
          </g>
        )
      })}

      {/* nodes */}
      {Object.entries(L.nodes).map(([id, pos]) => {
        // Initial pseudostate: filled circle
        if (id === '_initial') {
          return <circle key={id} cx={pos.x} cy={pos.y} r={9} fill="var(--text-primary)" />
        }
        const st = machine.states.find((s) => s.id === id)
        if (!st) return null
        // Final pseudostate (abstract end, id like "_ende"): ringed circle + caption
        if (id.startsWith('_')) {
          return (
            <g key={id}>
              <circle cx={pos.x} cy={pos.y} r={13} fill="none" stroke="var(--text-primary)" strokeWidth={2} />
              <circle cx={pos.x} cy={pos.y} r={6} fill="var(--text-primary)" />
              <text x={pos.x} y={pos.y + 30} textAnchor="middle" fontSize={11} fill="var(--text-secondary)">{st.label}</text>
            </g>
          )
        }
        // All named states (including terminal ones) are normal rounded-rect states
        const col = nodeColor(id)
        return (
          <g key={id}>
            <rect x={pos.x - HW} y={pos.y - HH} width={HW * 2} height={HH * 2} rx={12} fill={col} />
            <text x={pos.x} y={pos.y - 2} textAnchor="middle" fontSize={13} fontWeight={700} fill={contrastText(col)}>{st.label}</text>
            <text x={pos.x} y={pos.y + 13} textAnchor="middle" fontSize={9} fill={contrastText(col)} opacity={0.85} style={{ fontFamily: 'var(--mono, monospace)' }}>{st.id}</text>
          </g>
        )
      })}
    </svg>
  )
}
