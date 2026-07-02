import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Scan, FileText, Image as ImageIcon } from 'lucide-react'

interface DiagramFrameProps {
  children: React.ReactNode          // the SVG / diagram
  textView?: React.ReactNode         // accessible text alternative
  legend?: React.ReactNode
  /** intrinsic diagram height hint for the scroll area */
  minHeight?: number
  /** start zoomed to fit width (default true) */
  zoomable?: boolean
  /** auto-shrink to fit the frame on load (good for wide/large diagrams) */
  fitOnLoad?: boolean
  /** 'both' fits the whole diagram into the frame; 'width' keeps text readable and scrolls vertically */
  fitMode?: 'both' | 'width'
  /** dependency that, when changed, re-triggers the fit (e.g. active diagram id) */
  fitKey?: string | number
}

export function DiagramFrame({ children, textView, legend, minHeight = 420, zoomable = true, fitOnLoad = false, fitMode = 'both', fitKey }: DiagramFrameProps) {
  const [zoom, setZoom] = useState(1)
  const [asText, setAsText] = useState(false)
  const [fitTick, setFitTick] = useState(0)   // „Einpassen“-Button stößt den Fit erneut an
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const userZoomed = useRef(false)

  // Zoom um einen Fixpunkt im Viewport (Cursor bzw. Mitte), damit die Stelle
  // unter dem Cursor beim Zoomen stehen bleibt.
  const zoomAt = useCallback((next: number, vx?: number, vy?: number) => {
    const vp = scrollRef.current
    setZoom((prev) => {
      const z = Math.max(0.3, Math.min(2, +next.toFixed(2)))
      if (vp && z !== prev) {
        const px = vx ?? vp.clientWidth / 2
        const py = vy ?? vp.clientHeight / 2
        const cx = (vp.scrollLeft + px) / prev
        const cy = (vp.scrollTop + py) / prev
        requestAnimationFrame(() => {
          vp.scrollLeft = cx * z - px
          vp.scrollTop = cy * z - py
        })
      }
      return z
    })
  }, [])

  // Fit on load: measure the SVG's intrinsic size (zoom-independent) and pick a
  // zoom so the whole diagram fits the frame for an immediate overview.
  useLayoutEffect(() => {
    if (!fitOnLoad && fitTick === 0) return
    let done = false
    userZoomed.current = false
    const measure = () => {
      if (userZoomed.current) return true // Nutzer hat manuell gezoomt — nicht überschreiben
      const vp = scrollRef.current, c = contentRef.current
      if (!vp || !c) return false
      const svg = c.querySelector('svg')
      if (!svg) return false
      const cw = (svg.width?.baseVal?.value || 0) + 32
      const ch = (svg.height?.baseVal?.value || 0) + 32
      const vw = vp.clientWidth - 8, vh = 632
      if (cw > 32 && ch > 32) {
        const ratio = fitMode === 'width' ? vw / cw : Math.min(vw / cw, vh / ch)
        setZoom(Math.max(0.42, Math.min(1, +ratio.toFixed(2))))
        vp.scrollTo({ left: 0, top: 0 })
        return true
      }
      return false
    }
    // elk layouts the big class diagram asynchronously (seconds) — observe the DOM
    // and fit as soon as the SVG appears; timers only as fallback.
    const obs = new MutationObserver(() => { if (!done) done = measure(); if (done) obs.disconnect() })
    if (contentRef.current) obs.observe(contentRef.current, { childList: true, subtree: true })
    const timers = [60, 400, 1500].map((d) => window.setTimeout(() => { if (!done) done = measure() }, d))
    return () => { obs.disconnect(); timers.forEach(window.clearTimeout) }
  }, [fitOnLoad, fitMode, fitKey, fitTick])

  // Strg/Cmd + Scrollen zoomt am Cursor (non-passive, um das Seiten-Zoomen des
  // Browsers zu unterdrücken); normales Scrollen bleibt Scrollen.
  useEffect(() => {
    const vp = scrollRef.current
    if (!vp || !zoomable) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      userZoomed.current = true
      const r = vp.getBoundingClientRect()
      const cur = parseFloat((vp.dataset.zoom ?? '1'))
      zoomAt(cur * (e.deltaY < 0 ? 1.12 : 0.9), e.clientX - r.left, e.clientY - r.top)
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [zoomable, zoomAt, asText])

  // Ziehen verschiebt den Ausschnitt (Panning). Klicks bleiben Klicks:
  // erst ab ~5 px Bewegung gilt die Geste als Ziehen und der Folge-Klick
  // wird einmalig unterdrückt.
  const drag = useRef<{ x: number; y: number; sl: number; st: number; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState(false)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const vp = scrollRef.current
    if (!vp) return
    drag.current = { x: e.clientX, y: e.clientY, sl: vp.scrollLeft, st: vp.scrollTop, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    const vp = scrollRef.current
    if (!d || !vp) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.moved && Math.hypot(dx, dy) > 5) {
      d.moved = true
      setDragging(true)
      vp.setPointerCapture(e.pointerId)
    }
    if (d.moved) {
      vp.scrollLeft = d.sl - dx
      vp.scrollTop = d.st - dy
    }
  }
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current
    drag.current = null
    setDragging(false)
    if (d?.moved) {
      // den Klick nach dem Ziehen schlucken, damit nichts ungewollt aufgeht
      window.addEventListener('click', (ev) => { ev.stopPropagation(); ev.preventDefault() }, { capture: true, once: true })
      scrollRef.current?.releasePointerCapture?.(e.pointerId)
    }
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2 min-w-0">
          {textView && (
            <button
              onClick={() => setAsText((t) => !t)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
            >
              {asText ? <ImageIcon size={13} /> : <FileText size={13} />}
              {asText ? 'Diagramm' : 'Als Text'}
            </button>
          )}
          {!asText && zoomable && (
            <span className="text-[11px] hidden lg:block truncate" style={{ color: 'var(--text-secondary)', opacity: 0.75 }}>
              Ziehen verschiebt · Strg + Scrollen zoomt
            </span>
          )}
        </div>
        {!asText && zoomable && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <IconBtn onClick={() => { userZoomed.current = true; zoomAt(zoom - 0.12) }} label="Verkleinern"><ZoomOut size={15} /></IconBtn>
            <span className="text-xs font-mono w-12 text-center" style={{ color: 'var(--text-secondary)' }}>{Math.round(zoom * 100)}%</span>
            <IconBtn onClick={() => { userZoomed.current = true; zoomAt(zoom + 0.12) }} label="Vergrößern"><ZoomIn size={15} /></IconBtn>
            {fitOnLoad && <IconBtn onClick={() => setFitTick((t) => t + 1)} label="Einpassen"><Scan size={15} /></IconBtn>}
            <IconBtn onClick={() => { userZoomed.current = true; setZoom(1); scrollRef.current?.scrollTo({ left: 0, top: 0 }) }} label="Originalgröße (100 %)"><Maximize2 size={15} /></IconBtn>
          </div>
        )}
      </div>

      {asText ? (
        <div className="p-4 max-h-[560px] overflow-auto text-sm" style={{ color: 'var(--text-primary)' }}>{textView}</div>
      ) : (
        <div
          ref={scrollRef}
          data-zoom={zoom}
          className="overflow-auto select-none"
          style={{ maxHeight: 640, cursor: dragging ? 'grabbing' : 'grab' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* CSS `zoom` scales layout too, so the scroll area matches the visual size */}
          <div ref={contentRef} style={{ minHeight, zoom, width: 'max-content', padding: 16 }}>
            {children}
          </div>
        </div>
      )}

      {legend && !asText && (
        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border-color)' }}>{legend}</div>
      )}
    </div>
  )
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </button>
  )
}
