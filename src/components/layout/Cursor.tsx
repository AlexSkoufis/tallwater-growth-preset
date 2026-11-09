import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

/**
 * Contextual cursor for precise pointers. Invisible by default; it only
 * appears as a labelled disc over elements that opt in with
 * `data-cursor="Label"`, so it adds meaning rather than decoration.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion(),
  )

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })
    let current: string | null = null

    let px = -1
    let py = -1

    const sync = (target: Element | null) => {
      const next = target?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? null
      if (next !== current) {
        current = next
        setLabel(next ?? '')
        gsap.to(el, { scale: next ? 1 : 0, autoAlpha: next ? 1 : 0, duration: 0.45, ease: 'expo.out' })
      }
    }
    const move = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      xTo(px)
      yTo(py)
      sync(e.target as Element | null)
    }
    // Content moves under a still pointer while scrolling; re-read what is beneath it.
    const onScroll = () => px >= 0 && sync(document.elementFromPoint(px, py))
    const hide = () => {
      current = null
      gsap.to(el, { scale: 0, autoAlpha: 0, duration: 0.3 })
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('pointerleave', hide)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95] -ml-11 -mt-11 grid size-22 scale-0 place-items-center rounded-full bg-sky text-ink opacity-0"
    >
      <span className="eyebrow text-[0.62rem]">{label}</span>
    </div>
  )
}
