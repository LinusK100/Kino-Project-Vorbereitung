import { useEffect, useMemo, useState } from 'react'
import ELK from 'elkjs/lib/elk.bundled.js'
import type { UmlClass, UmlRelationship } from '@/types'
import { UML_GROUP_COLOR, contrastText } from '@/lib/statusColors'

const elk = new ELK()

interface Props {
  classes: UmlClass[]
  relationships: UmlRelationship[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

interface Laid {
  w: number; h: number
  nodes: { id: string; x: number; y: number; w: number; h: number }[]
  edges: { id: string; type: string; pts: { x: number; y: number }[]; from: string; to: string; label?: string; fromM?: string; toM?: string }[]
}

const HEADER = 34, LINE = 15, PADV = 6

function sizeOf(c: UmlClass): { w: number; h: number } {
  const isEnum = c.group === 'enum'
  const attrLines = isEnum ? (c.attributes.map((a) => a.name)) : c.attributes.map((a) => `${a.visibility} ${a.name}: ${a.type}`)
  const methLines = c.methods.map((m) => `${m.visibility} ${m.name}(${m.params}): ${m.returnType}`)
  const all = [c.id, ...(c.stereotype ? [c.stereotype] : []), ...attrLines, ...methLines]
  const longest = all.reduce((mx, s) => Math.max(mx, s.length), 0)
  const w = Math.max(150, Math.min(248, longest * 6.2 + 20))
  const h = HEADER + (c.stereotype ? 12 : 0)
    + (attrLines.length ? attrLines.length * LINE + PADV * 2 : 10)
    + (methLines.length ? methLines.length * LINE + PADV * 2 : (isEnum ? 0 : 10))
  return { w, h }
}

export function ClassDiagram({ classes, relationships, selectedId, onSelect }: Props) {
  const [laid, setLaid] = useState<Laid | null>(null)
  // Render-time Reset: altes Layout sofort verwerfen, wenn die Klassenmenge wechselt,
  // damit weder ein veraltetes SVG gerendert noch vom Fit-on-load vermessen wird.
  const [prevClasses, setPrevClasses] = useState(classes)
  if (classes !== prevClasses) { setPrevClasses(classes); setLaid(null) }
  const idset = useMemo(() => new Set(classes.map((c) => c.id)), [classes])

  // synthetic class->enum dependency edges (status attributes)
  const edges = useMemo(() => {
    const base = relationships.filter((r) => idset.has(r.from) && idset.has(r.to))
    const enumIds = new Set(classes.filter((c) => c.group === 'enum').map((c) => c.id))
    const syn: UmlRelationship[] = []
    for (const c of classes) {
      for (const a of c.attributes) {
        if (enumIds.has(a.type) && !base.some((r) => r.from === c.id && r.to === a.type)) {
          syn.push({ id: `syn-${c.id}-${a.type}`, type: 'dependency', from: c.id, to: a.type, label: a.name })
        }
      }
    }
    return [...base, ...syn]
  }, [relationships, classes, idset])

  useEffect(() => {
    let alive = true
    const sizes = Object.fromEntries(classes.map((c) => [c.id, sizeOf(c)]))
    const graph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered', 'elk.direction': 'DOWN',
        'elk.layered.spacing.nodeNodeBetweenLayers': '64',
        'elk.spacing.nodeNode': '46',
        'elk.layered.spacing.edgeNodeBetweenLayers': '28',
        'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
        'elk.edgeRouting': 'ORTHOGONAL',
      },
      children: classes.map((c) => ({ id: c.id, width: sizes[c.id].w, height: sizes[c.id].h })),
      edges: edges.map((e) => ({ id: e.id, sources: [e.from], targets: [e.to] })),
    }
    elk.layout(graph as Parameters<typeof elk.layout>[0]).then((res) => {
      if (!alive) return
      const nodes = (res.children ?? []).map((n) => ({ id: n.id!, x: n.x!, y: n.y!, w: n.width!, h: n.height! }))
      const eMap = Object.fromEntries(edges.map((e) => [e.id, e]))
      const laidEdges = (res.edges ?? []).map((e) => {
        const sec = e.sections?.[0]
        const pts = sec ? [sec.startPoint, ...(sec.bendPoints ?? []), sec.endPoint] : []
        const meta = eMap[e.id!]
        return { id: e.id!, type: meta.type, pts, from: meta.from, to: meta.to, label: meta.label, fromM: meta.fromMultiplicity, toM: meta.toMultiplicity }
      })
      setLaid({ w: res.width ?? 1000, h: res.height ?? 800, nodes, edges: laidEdges })
    })
    return () => { alive = false }
  }, [classes, edges])

  if (!laid) return <div className="py-20 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>Layout wird berechnet …</div>

  const relatedToSel = selectedId
    ? new Set(edges.filter((e) => e.from === selectedId || e.to === selectedId).flatMap((e) => [e.from, e.to]))
    : null

  return (
    <svg viewBox={`0 0 ${laid.w + 20} ${laid.h + 20}`} width={laid.w + 20} height={laid.h + 20} style={{ fontFamily: 'var(--font-body)' }}>
      <defs>
        <marker id="cd-tri" markerWidth="16" markerHeight="14" refX="14" refY="7" orient="auto"><path d="M1,1 L15,7 L1,13 z" fill="var(--card-bg)" stroke="var(--text-secondary)" strokeWidth="1.3" /></marker>
        <marker id="cd-arr" markerWidth="13" markerHeight="13" refX="10" refY="5" orient="auto"><path d="M0,0 L11,5 L0,10" fill="none" stroke="var(--text-secondary)" strokeWidth="1.4" /></marker>
        <marker id="cd-dia" markerWidth="18" markerHeight="12" refX="1" refY="6" orient="auto"><path d="M1,6 L9,1.5 L17,6 L9,10.5 z" fill="var(--text-secondary)" /></marker>
      </defs>

      {/* edges */}
      {laid.edges.map((e) => {
        if (e.pts.length < 2) return null
        const d = e.pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
        const dim = selectedId && e.from !== selectedId && e.to !== selectedId
        const isComp = e.type === 'composition'
        const isInh = e.type === 'inheritance'
        const isDep = e.type === 'dependency'
        const a = e.pts[0], b = e.pts[e.pts.length - 1]
        return (
          <g key={e.id} opacity={dim ? 0.12 : 1}>
            <path d={d} fill="none" stroke="var(--text-secondary)" strokeWidth={1.4} strokeDasharray={isDep ? '5 4' : undefined}
              markerStart={isComp ? 'url(#cd-dia)' : undefined}
              markerEnd={isInh ? 'url(#cd-tri)' : 'url(#cd-arr)'} />
            {e.fromM && <text x={a.x + 6} y={a.y + 12} fontSize={9} fill="var(--text-secondary)" style={{ fontFamily: 'var(--mono,monospace)' }}>{e.fromM}</text>}
            {e.toM && <text x={b.x + 6} y={b.y - 5} fontSize={9} fill="var(--text-secondary)" style={{ fontFamily: 'var(--mono,monospace)' }}>{e.toM}</text>}
          </g>
        )
      })}

      {/* nodes */}
      {laid.nodes.map((n) => {
        // Beim View-Wechsel kann das alte Layout noch Klassen enthalten, die es
        // in der neuen Ansicht nicht gibt — bis elk fertig ist, überspringen.
        const c = classes.find((cl) => cl.id === n.id)
        if (!c) return null
        const color = UML_GROUP_COLOR[c.group]
        const dim = relatedToSel ? !relatedToSel.has(n.id) : false
        const sel = selectedId === n.id
        const isEnum = c.group === 'enum'
        const attrLines = isEnum ? c.attributes.map((a) => a.name) : c.attributes.map((a) => `${a.visibility} ${a.name}: ${a.type}`)
        const methLines = c.methods.map((m) => `${m.visibility} ${m.name}(${trim(m.params, 14)}): ${m.returnType}`)
        const attrY = n.y + (c.stereotype ? HEADER + 12 : HEADER)
        const methY = attrY + (attrLines.length ? attrLines.length * LINE + PADV * 2 : 10)
        return (
          <g key={n.id} opacity={dim ? 0.28 : 1} style={{ cursor: 'pointer' }} onClick={() => onSelect(sel ? null : n.id)}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={7} fill="var(--card-bg)" stroke={sel ? color : 'var(--border-color)'} strokeWidth={sel ? 2.4 : 1.2} />
            {/* header */}
            <path d={`M ${n.x} ${n.y + 7} q 0 -7 7 -7 h ${n.w - 14} q 7 0 7 7 v ${(c.stereotype ? 39 : 27)} h -${n.w} z`} fill={color} />
            {c.stereotype && <text x={n.x + n.w / 2} y={n.y + 14} textAnchor="middle" fontSize={9} fill={contrastText(color)} opacity={0.9}>{c.stereotype}</text>}
            <text x={n.x + n.w / 2} y={n.y + (c.stereotype ? 30 : 19)} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={contrastText(color)}>{c.id}</text>
            {c.implementedInPrototype && <circle cx={n.x + n.w - 11} cy={n.y + 11} r={4} fill="#4ade80" stroke="#0008" strokeWidth={0.5}><title>im Prototyp implementiert</title></circle>}
            {/* attributes */}
            {attrLines.length > 0 && <line x1={n.x} y1={attrY + 1} x2={n.x + n.w} y2={attrY + 1} stroke="var(--border-color)" />}
            {attrLines.map((l, i) => <text key={i} x={n.x + 8} y={attrY + PADV + 11 + i * LINE} fontSize={10} fill="var(--text-primary)" style={{ fontFamily: 'var(--mono,monospace)' }}>{trim(l, 36)}</text>)}
            {/* methods */}
            {methLines.length > 0 && <line x1={n.x} y1={methY + 1} x2={n.x + n.w} y2={methY + 1} stroke="var(--border-color)" />}
            {methLines.map((l, i) => <text key={i} x={n.x + 8} y={methY + PADV + 11 + i * LINE} fontSize={10} fill="var(--text-primary)" style={{ fontFamily: 'var(--mono,monospace)' }}>{trim(l, 36)}</text>)}
          </g>
        )
      })}
    </svg>
  )
}

function trim(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}
