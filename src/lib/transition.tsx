import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { LogoMark } from '../components/ui/Logo'
import { ease, gsap, prefersReducedMotion, ScrollTrigger } from './gsap'
import { useSmoothScroll } from './smooth-scroll'

interface TransitionApi {
  go: (to: string) => void
  /** Called by every page once it has mounted, to settle scroll and reveal. */
  pageReady: () => void
}

const TransitionContext = createContext<TransitionApi | null>(null)

/**
 * Route transitions: a two-layer curtain (brand teal, then ink) rises over
 * the outgoing page, the route changes underneath, and the curtain lifts
 * away once the incoming page reports that it has mounted.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const navType = useNavigationType()
  const smooth = useSmoothScroll()

  const overlayRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const pendingReveal = useRef(false)
  const positions = useRef(new Map<string, number>())
  const currentKey = useRef(location.key)

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // Remember scroll offsets per history entry, for back/forward restoration.
  useEffect(() => {
    currentKey.current = location.key
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => positions.current.set(currentKey.current, window.scrollY))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [location.key])

  const go = useCallback(
    (to: string) => {
      const target = new URL(to, window.location.origin)
      const samePath = target.pathname === location.pathname

      if (samePath && target.hash) {
        smooth.scrollTo(target.hash, { offset: -90 })
        navigate(to, { replace: true })
        return
      }
      if (samePath && !target.search) {
        smooth.scrollTo(0)
        return
      }
      if (busy.current) return

      const overlay = overlayRef.current
      if (!overlay || prefersReducedMotion()) {
        navigate(to)
        return
      }

      busy.current = true
      pendingReveal.current = true
      smooth.stop()

      const [back, front] = overlay.querySelectorAll<HTMLElement>('[data-layer]')
      const mark = overlay.querySelector<HTMLElement>('[data-mark]')

      gsap
        .timeline({
          onComplete: () => {
            navigate(to)
          },
        })
        .set(overlay, { visibility: 'visible' })
        .fromTo(back, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: ease.inOut })
        .fromTo(front, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: ease.inOut }, 0.08)
        .fromTo(mark, { autoAlpha: 0, scale: 0.8, rotate: -45 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.6 }, 0.45)
    },
    [location.pathname, navigate, smooth],
  )

  const pageReady = useCallback(() => {
    const isPop = navType === 'POP'
    const saved = positions.current.get(location.key)

    // Settle scroll position before the curtain lifts.
    if (location.hash) {
      requestAnimationFrame(() => smooth.scrollTo(location.hash, { immediate: true, offset: -90 }))
    } else if (isPop && saved != null) {
      requestAnimationFrame(() => requestAnimationFrame(() => smooth.scrollTo(saved, { immediate: true })))
    } else {
      smooth.scrollTo(0, { immediate: true })
    }

    requestAnimationFrame(() => ScrollTrigger.refresh())
    window.dispatchEvent(new CustomEvent('page:ready'))

    const overlay = overlayRef.current
    if (!pendingReveal.current || !overlay) {
      busy.current = false
      smooth.start()
      return
    }
    pendingReveal.current = false

    const [back, front] = overlay.querySelectorAll<HTMLElement>('[data-layer]')
    const mark = overlay.querySelector<HTMLElement>('[data-mark]')

    gsap
      .timeline({
        delay: 0.05,
        onComplete: () => {
          gsap.set(overlay, { visibility: 'hidden' })
          busy.current = false
        },
      })
      .call(() => smooth.start())
      .to(mark, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: ease.soft })
      .to(front, { yPercent: -100, duration: 0.85, ease: ease.inOut }, 0.1)
      .to(back, { yPercent: -100, duration: 0.85, ease: ease.inOut }, 0.18)
  }, [location.hash, location.key, navType, smooth])

  const api = useMemo(() => ({ go, pageReady }), [go, pageReady])

  return (
    <TransitionContext.Provider value={api}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90]"
        style={{ visibility: 'hidden' }}
      >
        <div data-layer className="absolute inset-0 bg-teal" />
        <div data-layer className="absolute inset-0 grid place-items-center bg-ink">
          <div data-mark className="w-12 text-ivory opacity-0">
            <LogoMark />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('useTransition must be used inside TransitionProvider')
  return ctx
}
