import { useLayoutEffect, useRef, useState } from 'react'
import { ZoomIn, ZoomOut, Maximize2, FileText, Image as ImageIcon } from 'lucide-react'

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
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Fit on load: measure the SVG's intrinsic size (zoom-independent) and pick a
  // zoom so the whole diagram fits the frame for an immediate overview.
  useLayoutEffect(() => {
    if (!fitOnLoad) return
    let done = false
    const measure = () => {
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
        return true
      }
      return false
    }
    // retry a few times because the class diagram lays out asynchronously (elk)
    const timers = [60, 250, 600, 1100].map((d) => window.setTimeout(() => { if (!done) done = measure() }, d))
    return () => timers.forEach(window.clearTimeout)
  }, [fitOnLoad, fitMode, fitKey])

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-1">
          {textView && (
            <button
              onClick={() => setAsText((t) => !t)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
            >
              {asText ? <ImageIcon size={13} /> : <FileText size={13} />}
              {asText ? 'Diagramm' : 'Als Text'}
            </button>
          )}
        </div>
        {!asText && zoomable && (
          <div className="flex items-center gap-1">
            <IconBtn onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))} label="Verkleinern"><ZoomOut size={15} /></IconBtn>
            <span className="text-xs font-mono w-12 text-center" style={{ color: 'var(--text-secondary)' }}>{Math.round(zoom * 100)}%</span>
            <IconBtn onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))} label="Vergrößern"><ZoomIn size={15} /></IconBtn>
            <IconBtn onClick={() => { setZoom(1); scrollRef.current?.scrollTo({ left: 0, top: 0 }) }} label="Zurücksetzen"><Maximize2 size={15} /></IconBtn>
          </div>
        )}
      </div>

      {asText ? (
        <div className="p-4 max-h-[560px] overflow-auto text-sm" style={{ color: 'var(--text-primary)' }}>{textView}</div>
      ) : (
        <div ref={scrollRef} className="overflow-auto" style={{ maxHeight: 640 }}>
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
    <button onClick={onClick} aria-label={label} className="p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </button>
  )
}
