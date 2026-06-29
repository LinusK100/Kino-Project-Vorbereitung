import { useId, useMemo } from 'react'
import type { SequenceDiagram as SeqType, SeqMessage } from '@/types'
import { stateEffectColor } from '@/lib/statusColors'

const COL_GAP = 220
const LEFT = 96          // left gutter (seq numbers)
const HEAD_H = 76
const ROW_H = 50
const TOP_PAD = 26

const kindStyle: Record<string, { fill: string; label: string }> = {
  actor: { fill: '#475569', label: 'Akteur' },
  control: { fill: '#4f46e5', label: '«control»' },
  entity: { fill: '#7a39bb', label: '«entity»' },
}

export function SequenceDiagram({ diagram, showFragments }: { diagram: SeqType; showFragments: boolean }) {
  const uid = useId().replace(/:/g, '')

  // Messages hidden in happy-path (einfach): alt operands beyond the first, and break fragments.
  const hidden = useMemo(() => {
    const set = new Set<string>()
    if (!showFragments) {
      for (const f of diagram.fragments) {
        if (f.kind === 'alt') f.operands.slice(1).forEach((o) => o.messageRefs.forEach((m) => set.add(m)))
        if (f.kind === 'break') f.operands.forEach((o) => o.messageRefs.forEach((m) => set.add(m)))
      }
    }
    return set
  }, [diagram, showFragments])

  const messages = diagram.messages.filter((m) => !hidden.has(m.id))
  const colX = (id: string) => {
    const i = diagram.participants.findIndex((p) => p.id === id)
    return LEFT + 80 + i * COL_GAP
  }
  const rowOf = (id: string) => messages.findIndex((m) => m.id === id)
  const yOf = (row: number) => HEAD_H + TOP_PAD + row * ROW_H

  const width = LEFT + 80 + (diagram.participants.length - 1) * COL_GAP + 200
  const height = HEAD_H + TOP_PAD + messages.length * ROW_H + 40

  // Fragment geometry (erweitert only)
  const frames = useMemo(() => {
    if (!showFragments) return []
    const f = diagram.fragments.map((fr) => {
      const rows = fr.operands.flatMap((o) => o.messageRefs.map(rowOf)).filter((r) => r >= 0)
      if (rows.length === 0) return null
      const top = Math.min(...rows), bottom = Math.max(...rows)
      const xs = fr.operands.flatMap((o) => o.messageRefs).map((id) => messages.find((m) => m.id === id)).filter(Boolean)
        .flatMap((m) => [colX(m!.from), colX(m!.to)])
      const minX = Math.min(...xs), maxX = Math.max(...xs)
      const operandStarts = fr.operands.map((o) => ({ guard: o.guard, row: Math.min(...o.messageRefs.map(rowOf).filter((r) => r >= 0)) }))
        .filter((o) => Number.isFinite(o.row)).sort((a, b) => a.row - b.row)
      return { fr, top, bottom, minX, maxX, operandStarts, span: bottom - top }
    }).filter(Boolean) as { fr: typeof diagram.fragments[0]; top: number; bottom: number; minX: number; maxX: number; operandStarts: { guard: string; row: number }[]; span: number }[]
    // nesting depth
    return f.map((a) => ({ ...a, depth: f.filter((b) => b !== a && b.top <= a.top && b.bottom >= a.bottom && b.span > a.span).length }))
  }, [showFragments, messages]) // colX/rowOf derive from messages

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={`Sequenzdiagramm ${diagram.title}`} style={{ fontFamily: 'var(--font-body)' }}>
      <defs>
        <marker id={`s-${uid}`} markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="var(--text-primary)" /></marker>
        <marker id={`o-${uid}`} markerWidth="13" markerHeight="13" refX="9" refY="4.5" orient="auto"><path d="M0,0 L10,4.5 L0,9" fill="none" stroke="var(--text-primary)" strokeWidth="1.4" /></marker>
      </defs>

      {/* lifelines */}
      {diagram.participants.map((p) => {
        const x = colX(p.id)
        return <line key={p.id} x1={x} y1={HEAD_H} x2={x} y2={height - 24} stroke="var(--border-color)" strokeWidth={1.4} strokeDasharray="4 4" />
      })}

      {/* fragment frames (behind messages) */}
      {frames.map(({ fr, top, bottom, minX, maxX, operandStarts, depth }) => {
        const x = minX - 46 + depth * 12, w = (maxX - minX) + 92 - depth * 24
        const y = yOf(top) - 26, h = (bottom - top) * ROW_H + 50
        const tag = fr.kind
        const tagW = tag.length * 7 + 16
        return (
          <g key={fr.id}>
            <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke="#7a39bb" strokeWidth={1.3} strokeOpacity={0.5} />
            <path d={`M ${x} ${y} h ${tagW} l 0 13 l -8 8 h -${tagW - 8} z`} fill="#7a39bb" fillOpacity={0.12} stroke="#7a39bb" strokeOpacity={0.5} strokeWidth={1} />
            <text x={x + 7} y={y + 15} fontSize={11} fontWeight={700} fill="#7a39bb">{tag}</text>
            {operandStarts.map((o, i) => (
              <g key={i}>
                {i > 0 && <line x1={x} y1={yOf(o.row) - 26} x2={x + w} y2={yOf(o.row) - 26} stroke="#7a39bb" strokeOpacity={0.4} strokeWidth={1} strokeDasharray="6 4" />}
                <text x={x + (i === 0 ? tagW + 8 : 8)} y={yOf(o.row) - 26 + (i === 0 ? 12 : 13)} fontSize={10} fontWeight={600} fill="#7a39bb" fillOpacity={0.95}>[{o.guard}]</text>
              </g>
            ))}
          </g>
        )
      })}

      {/* participant heads */}
      {diagram.participants.map((p) => {
        const x = colX(p.id); const ks = kindStyle[p.kind]
        const bw = 150
        return (
          <g key={p.id}>
            {p.kind === 'actor' ? (
              <g transform={`translate(${x}, 16)`} stroke={ks.fill} strokeWidth={2} fill="none">
                <circle cx={0} cy={0} r={7} /><line x1={0} y1={7} x2={0} y2={24} /><line x1={-11} y1={14} x2={11} y2={14} /><line x1={0} y1={24} x2={-9} y2={38} /><line x1={0} y1={24} x2={9} y2={38} />
              </g>
            ) : (
              <rect x={x - bw / 2} y={12} width={bw} height={46} rx={8} fill={ks.fill} />
            )}
            <text x={x} y={p.kind === 'actor' ? 70 : 32} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={p.kind === 'actor' ? 'var(--text-primary)' : '#fff'} style={{ textDecoration: p.kind === 'entity' ? 'underline' : 'none' }}>
              {p.label.length > 22 ? p.label.slice(0, 21) + '…' : p.label}
            </text>
            {p.kind !== 'actor' && <text x={x} y={48} textAnchor="middle" fontSize={8.5} fill="#fff" opacity={0.85}>{ks.label}</text>}
          </g>
        )
      })}

      {/* messages */}
      {messages.map((m, row) => <Message key={m.id} m={m} y={yOf(row)} colX={colX} uid={uid} />)}
    </svg>
  )
}

function Message({ m, y, colX, uid }: { m: SeqMessage; y: number; colX: (id: string) => number; uid: string }) {
  const x1 = colX(m.from), x2 = colX(m.to)
  const dashed = m.type === 'return' || m.type === 'create'
  const marker = m.type === 'return' ? `url(#o-${uid})` : `url(#s-${uid})`
  const seqLabel = m.seq

  if (m.from === m.to) {
    const x = x1
    return (
      <g>
        <text x={LEFT - 10} y={y + 4} textAnchor="end" fontSize={10} fill="var(--text-secondary)" style={{ fontFamily: 'var(--mono,monospace)' }}>{seqLabel}</text>
        <path d={`M ${x} ${y - 8} h 40 v 16 h -40`} fill="none" stroke="var(--text-primary)" strokeWidth={1.5} markerEnd={marker} />
        <text x={x + 48} y={y - 2} fontSize={10.5} fill="var(--text-primary)">{m.label}</text>
        {m.stateEffect && <Badge x={x + 48} y={y + 12} text={m.stateEffect} />}
      </g>
    )
  }

  const dir = x2 > x1 ? 1 : -1
  const midX = (x1 + x2) / 2
  return (
    <g>
      <text x={LEFT - 10} y={y + 4} textAnchor="end" fontSize={10} fill="var(--text-secondary)" style={{ fontFamily: 'var(--mono,monospace)' }}>{seqLabel}</text>
      <line x1={x1} y1={y} x2={x2 - dir * 2} y2={y} stroke="var(--text-primary)" strokeWidth={1.5} strokeDasharray={dashed ? '6 4' : undefined} markerEnd={marker} opacity={dashed ? 0.8 : 1} />
      <text x={midX} y={y - 6} textAnchor="middle" fontSize={10.5} fill="var(--text-primary)">
        {m.label.length > 34 ? m.label.slice(0, 33) + '…' : m.label}
        {m.stories?.length ? '' : ''}
      </text>
      {m.stories?.length ? (
        <text x={midX} y={y + 11} textAnchor="middle" fontSize={8.5} fill="var(--text-secondary)" style={{ fontFamily: 'var(--mono,monospace)' }}>{m.stories.join(' ')}</text>
      ) : null}
      {m.stateEffect && <Badge x={x2} y={y + (m.stories?.length ? 22 : 12)} text={m.stateEffect} anchor={dir > 0 ? 'end' : 'start'} />}
    </g>
  )
}

function Badge({ x, y, text, anchor = 'start' }: { x: number; y: number; text: string; anchor?: 'start' | 'end' }) {
  const color = stateEffectColor(text)
  const short = text.length > 40 ? text.slice(0, 39) + '…' : text
  const w = short.length * 5.4 + 14
  const bx = anchor === 'end' ? x - w : x
  return (
    <g>
      <rect x={bx} y={y - 8} width={w} height={15} rx={4} fill={color} fillOpacity={0.14} stroke={color} strokeWidth={1} />
      <text x={bx + 6} y={y + 3} fontSize={9} fontWeight={600} fill={color} style={{ fontFamily: 'var(--mono,monospace)' }}>「{short}」</text>
    </g>
  )
}
