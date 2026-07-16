import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ZoomIn, ZoomOut, Maximize2, Scan, FileText, Image as ImageIcon, X } from 'lucide-react'

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
  const [fullscreen, setFullscreen] = useState(false)
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
            <IconBtn onClick={() => setFullscreen(true)} label="Vollbild"><Maximize2 size={15} /></IconBtn>
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

      {fullscreen && <DiagramFullscreen legend={legend} onClose={() => setFullscreen(false)}>{children}</DiagramFullscreen>}
    </div>
  )
}

// Vollbild-Ansicht: das Diagramm groß über der ganzen Seite, mit eigenem
// Zoom/Pan, auf die Fläche eingepasst. Esc oder der X-Knopf schließen.
function DiagramFullscreen({ children, legend, onClose }: { children: React.ReactNode; legend?: React.ReactNode; onClose: () => void }) {
  const [zoom, setZoom] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; sl: number; st: number; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState(false)

  // Body-Scroll sperren, Esc schließt
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  // Beim Öffnen auf die verfügbare Fläche einpassen
  useLayoutEffect(() => {
    const fit = () => {
      const vp = scrollRef.current, c = contentRef.current
      const svg = c?.querySelector('svg')
      if (!vp || !svg) return false
      const cw = (svg.width?.baseVal?.value || 0) + 48
      const ch = (svg.height?.baseVal?.value || 0) + 48
      if (cw <= 48 || ch <= 48) return false
      const ratio = Math.min(vp.clientWidth / cw, vp.clientHeight / ch)
      setZoom(Math.max(0.4, Math.min(2.5, +ratio.toFixed(2))))
      return true
    }
    if (fit()) return
    const t = [50, 300, 900].map((d) => window.setTimeout(fit, d))
    return () => t.forEach(window.clearTimeout)
  }, [])

  // Strg/Cmd + Scrollen zoomt
  useEffect(() => {
    const vp = scrollRef.current
    if (!vp) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      setZoom((z) => Math.max(0.3, Math.min(3, +(z * (e.deltaY < 0 ? 1.12 : 0.9)).toFixed(2))))
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [])

  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const vp = scrollRef.current; if (!vp) return
    drag.current = { x: e.clientX, y: e.clientY, sl: vp.scrollLeft, st: vp.scrollTop, moved: false }
  }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current, vp = scrollRef.current
    if (!d || !vp) return
    const dx = e.clientX - d.x, dy = e.clientY - d.y
    if (!d.moved && Math.hypot(dx, dy) > 5) { d.moved = true; setDragging(true); vp.setPointerCapture(e.pointerId) }
    if (d.moved) { vp.scrollLeft = d.sl - dx; vp.scrollTop = d.st - dy }
  }
  const onUp = () => { drag.current = null; setDragging(false) }
  const bump = (f: number) => setZoom((z) => Math.max(0.3, Math.min(3, +(z * f).toFixed(2))))

  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col" style={{ background: 'var(--card-bg)' }} role="dialog" aria-modal="true" aria-label="Diagramm im Vollbild">
      <div className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Ziehen verschiebt · Strg + Scrollen zoomt</span>
        <div className="flex items-center gap-1">
          <IconBtn onClick={() => bump(0.85)} label="Verkleinern"><ZoomOut size={16} /></IconBtn>
          <span className="text-xs font-mono w-12 text-center" style={{ color: 'var(--text-secondary)' }}>{Math.round(zoom * 100)}%</span>
          <IconBtn onClick={() => bump(1.18)} label="Vergrößern"><ZoomIn size={16} /></IconBtn>
          <button onClick={onClose} className="inline-flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10" style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
            <X size={15} /> Schließen
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto select-none flex items-center justify-center"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      >
        <div ref={contentRef} style={{ zoom, width: 'max-content', padding: 24 }}>{children}</div>
      </div>
      {legend && <div className="px-4 py-3 border-t flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>{legend}</div>}
    </div>,
    document.body,
  )
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </button>
  )
}
