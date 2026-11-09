import { useRef } from 'react'
import { site } from '../../data/site'
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap'
import { SplitHeading } from '../motion/SplitHeading'
import { ArrowLink, Button } from '../ui/Button'

const audiences = [
  { title: 'Founders and owners', text: 'Planning an expansion, a partial sale or the day you hand over the keys.' },
  { title: 'Leadership teams', text: 'Ready to buy into the business you run, or to fund the plan you have been building.' },
  { title: 'Independent sponsors', text: 'Holding a deal or a thesis and looking for a flexible, hands-on capital partner.' },
]

/**
 * Closing invitation. Soft overlapping discs of light on dark.
 */
export function ClosingCta({ title = 'Ready when you are.' }: { title?: string }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '[data-orb="a"]',
        { xPercent: -10, yPercent: 10 },
        {
          xPercent: 12,
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.fromTo(
        '[data-orb="b"]',
        { xPercent: 10, yPercent: -6 },
        {
          xPercent: -14,
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.from('[data-aud]', {
        autoAlpha: 0,
        y: 20,
        stagger: 0.08,
        duration: 1.1,
        scrollTrigger: { trigger: '[data-auds]', start: 'top 90%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-header="dark"
      aria-labelledby="cta-title"
      className="grain relative isolate overflow-hidden bg-ink text-ivory"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          data-orb="a"
          className="absolute -left-[20%] top-[10%] size-[80vw] max-w-[1100px] rounded-full opacity-60 blur-3xl"
          style={{ background: 'radial-gradient(circle at 40% 40%, rgb(23 73 94 / 0.95), transparent 65%)' }}
        />
        <div
          data-orb="b"
          className="absolute -right-[15%] -top-[20%] size-[60vw] max-w-[900px] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle at 60% 50%, rgb(128 211 244 / 0.35), transparent 60%)' }}
        />
      </div>

      <div className="container-x section-y">
        <p className="eyebrow text-sky">Start a conversation</p>
        <SplitHeading id="cta-title" className="display-xxl mt-10 max-w-[11ch]" stagger={0.12}>
          {title}
        </SplitHeading>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-6">
          <Button to="/get-in-touch" variant="sky" size="lg" magnetic>
            Talk to a partner
          </Button>
          <ArrowLink to={site.overviewPdf} className="text-ivory/85">
            Download the fund overview
          </ArrowLink>
        </div>

        <ul data-auds className="mt-24 grid gap-10 border-t border-ivory/15 pt-10 md:grid-cols-3">
          {audiences.map((a) => (
            <li key={a.title} data-aud>
              <h3 className="font-serif text-2xl font-light">{a.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/65">{a.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
