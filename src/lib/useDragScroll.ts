import { useRef, useState } from 'react'

// Ziehen-zum-Scrollen für breite Flächen (z. B. Story Map).
// Klicks bleiben erhalten: erst ab ~5 px Bewegung gilt die Geste als Ziehen,
// der unmittelbar folgende Klick wird dann einmalig unterdrückt.
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const drag = useRef<{ x: number; y: number; sl: number; st: number; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || !ref.current) return
    drag.current = { x: e.clientX, y: e.clientY, sl: ref.current.scrollLeft, st: ref.current.scrollTop, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    const el = ref.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.moved && Math.hypot(dx, dy) > 5) {
      d.moved = true
      setDragging(true)
      el.setPointerCapture(e.pointerId)
    }
    if (d.moved) {
      el.scrollLeft = d.sl - dx
      el.scrollTop = d.st - dy
    }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current
    drag.current = null
    setDragging(false)
    if (d?.moved) {
      window.addEventListener('click', (ev) => { ev.stopPropagation(); ev.preventDefault() }, { capture: true, once: true })
      ref.current?.releasePointerCapture?.(e.pointerId)
    }
  }

  return {
    ref,
    dragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  }
}
