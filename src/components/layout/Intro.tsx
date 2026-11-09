import { useLayoutEffect, useRef, useState } from 'react'
import { ease, gsap, prefersReducedMotion } from '../../lib/gsap'
import { markIntroDone } from '../../lib/intro'
import { LogoMark } from '../ui/Logo'

/**
 * First-load sequence. The four pieces of the Tallwater mark travel in from
 * the corners of the screen and lock together, a short beat holds, then the
 * curtain lifts. Under two seconds; skipped entirely for reduced motion.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) {
      setGone(true)
      markIntroDone()
      return
    }

    document.documentElement.classList.add('js-intro')
    const ctx = gsap.context(() => {
      const offset = Math.min(window.innerWidth, window.innerHeight) * 0.35
      const from: Record<string, { x: number; y: number }> = {
        tl: { x: -offset, y: -offset },
        tr: { x: offset, y: -offset },
        bl: { x: -offset, y: offset },
        br: { x: offset, y: offset },
      }

      const tl = gsap.timeline({
        defaults: { ease: ease.out },
        onComplete: () => {
          setGone(true)
          document.documentElement.classList.remove('js-intro')
        },
      })

      root.querySelectorAll<SVGPathElement>('[data-petal]').forEach((p) => {
        const k = p.dataset.petal as string
        tl.from(p, { ...from[k], opacity: 0, duration: 1.3, ease: 'expo.inOut' }, 0)
      })

      tl.from('[data-intro-text] > *', { yPercent: 120, duration: 1, stagger: 0.08 }, 0.75)
        .to('[data-intro-mark]', { scale: 0.92, duration: 0.6, ease: ease.soft }, 1.35)
        .to('[data-intro-text] > *', { yPercent: -120, duration: 0.6, ease: 'power3.in', stagger: 0.04 }, 1.55)
        .call(markIntroDone, [], 1.75)
        .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.05, ease: ease.inOut }, 1.7)
    }, root)

    // No markIntroDone here: StrictMode re-runs this effect and the second run owns the sequence.
    return () => {
      ctx.revert()
      document.documentElement.classList.remove('js-intro')
    }
  }, [])

  if (gone) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="grain fixed inset-0 z-[100] grid place-items-center bg-ink text-ivory"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div className="flex flex-col items-center gap-7">
        <div data-intro-mark className="w-16 sm:w-20">
          <LogoMark className="h-auto w-full overflow-visible" />
        </div>
        <div data-intro-text className="text-mask text-center">
          <p className="eyebrow text-ivory/70">Tallwater Growth Partners</p>
        </div>
      </div>
    </div>
  )
}
