import { useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap'

/**
 * Pulls its child gently toward the pointer. Only active for precise
 * pointers; touch devices and reduced-motion users get a static element.
 */
export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

      const inner = el.firstElementChild as HTMLElement | null
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      const ixTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' }) : null
      const iyTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' }) : null

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        xTo(dx * strength)
        yTo(dy * strength)
        ixTo?.(dx * strength * 0.35)
        iyTo?.(dy * strength * 0.35)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
        ixTo?.(0)
        iyTo?.(0)
      }

      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className ?? ''}`}>
      {children}
    </span>
  )
}
