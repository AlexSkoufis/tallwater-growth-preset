import { createElement, useRef, type ReactNode } from 'react'
import { ease, gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap'

type Variant = 'fade' | 'rise' | 'clip-up' | 'clip-x' | 'stagger'

interface Props {
  as?: 'div' | 'section' | 'figure' | 'ul' | 'ol' | 'p' | 'span' | 'article' | 'aside'
  variant?: Variant
  className?: string
  children: ReactNode
  delay?: number
  start?: string
}

/**
 * Scroll-entrance primitives. Deliberately small in number and varied in
 * character: a clip wipe for imagery, a quiet fade for supporting text, a
 * short stagger for lists. Headings use SplitHeading instead.
 */
export function Reveal({ as = 'div', variant = 'fade', className, children, delay = 0, start = 'top 86%' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const st = { trigger: el, start, once: true }

      switch (variant) {
        case 'fade':
          gsap.from(el, { autoAlpha: 0, duration: 1.4, ease: ease.soft, delay, scrollTrigger: st })
          break
        case 'rise':
          gsap.from(el, { autoAlpha: 0, y: 28, duration: 1.3, delay, scrollTrigger: st })
          break
        case 'clip-up':
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: ease.inOut, delay, scrollTrigger: st },
          )
          break
        case 'clip-x':
          gsap.fromTo(
            el,
            { clipPath: 'inset(0% 100% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: ease.inOut, delay, scrollTrigger: st },
          )
          break
        case 'stagger':
          gsap.from(el.children, {
            autoAlpha: 0,
            y: 18,
            duration: 1,
            stagger: 0.07,
            delay,
            scrollTrigger: st,
          })
          break
      }
    },
    { scope: ref },
  )

  return createElement(as, { ref, className }, children)
}
