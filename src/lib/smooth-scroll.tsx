import Lenis from 'lenis'
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap'

interface SmoothScrollApi {
  scrollTo: (target: number | string | HTMLElement, opts?: { immediate?: boolean; offset?: number }) => void
  stop: () => void
  start: () => void
}

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null)

/**
 * Lenis drives the scroll position; GSAP's ticker drives Lenis, and every
 * Lenis scroll event updates ScrollTrigger. One clock, no drift between
 * smooth scrolling and pinned or scrubbed animations.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices keep native momentum scrolling.
      syncTouch: false,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const api = useMemo<SmoothScrollApi>(
    () => ({
      scrollTo(target, opts = {}) {
        const lenis = lenisRef.current
        if (lenis) {
          lenis.scrollTo(target, { immediate: opts.immediate, offset: opts.offset ?? 0, force: true })
          return
        }
        const behavior: ScrollBehavior = opts.immediate || prefersReducedMotion() ? 'auto' : 'smooth'
        if (typeof target === 'number') window.scrollTo({ top: target, behavior })
        else {
          const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0), behavior })
        }
      },
      stop() {
        lenisRef.current?.stop()
      },
      start() {
        lenisRef.current?.start()
      },
    }),
    [],
  )

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>
}

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext)
  if (!ctx) throw new Error('useSmoothScroll must be used inside SmoothScrollProvider')
  return ctx
}
