import { createElement, useRef, type ReactNode } from 'react'
import { ease, gsap, prefersReducedMotion, SplitText, useGSAP } from '../../lib/gsap'
import { whenIntroDone } from '../../lib/intro'

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'blockquote'

interface Props {
  as?: Tag
  className?: string
  children: ReactNode
  /** `scroll` reveals when the heading enters the viewport; `intro` waits for the first-load curtain. */
  trigger?: 'scroll' | 'intro'
  delay?: number
  stagger?: number
  id?: string
}

/**
 * Line-by-line masked reveal. SplitText re-splits on resize (autoSplit) so
 * line breaks always match the current layout, and the text stays real,
 * selectable, accessible text throughout.
 */
export function SplitHeading({ as = 'h2', className, children, trigger = 'scroll', delay = 0, stagger = 0.09, id }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return

      gsap.set(el, { autoAlpha: 1 })
      let started = trigger === 'scroll'
      let split: SplitText | null = null

      const run = () => {
        split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 140,
              duration: 1.25,
              ease: ease.out,
              stagger,
              delay,
              // Unwrap once revealed so nothing stays clipped and the text is plain again.
              onComplete: () => self.revert(),
              scrollTrigger: trigger === 'scroll' ? { trigger: el, start: 'top 88%', once: true } : undefined,
            })
          },
        })
      }

      if (started) run()
      else {
        gsap.set(el, { autoAlpha: 0 })
        const cancel = whenIntroDone(
          contextSafe!(() => {
            started = true
            gsap.set(el, { autoAlpha: 1 })
            run()
          }),
        )
        return () => {
          cancel()
          split?.revert()
        }
      }

      return () => split?.revert()
    },
    { scope: ref, dependencies: [] },
  )

  return createElement(as, { ref, className, id }, children)
}
