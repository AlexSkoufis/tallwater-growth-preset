import { useRef } from 'react'
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '../../lib/gsap'
import { Reveal } from '../motion/Reveal'
import { ArrowLink } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { Img } from '../ui/Img'

/** The firm's principles. Shared with the About page. */
const values = ['Candor', 'Patience', 'Practicality', 'Shared upside']

export function Philosophy() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root || prefersReducedMotion()) return

      // Words illuminate as the statement travels up the viewport.
      const statement = root.querySelector<HTMLElement>('[data-statement]')!
      const split = SplitText.create(statement, { type: 'words' })
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 42%', scrub: 0.6 },
        },
      )

      // Two-layer parallax: the photograph and its frame move at different rates.
      gsap.fromTo(
        '[data-ph-img]',
        { yPercent: -9 },
        {
          yPercent: 9,
          ease: 'none',
          scrollTrigger: { trigger: '[data-ph-frame]', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.fromTo(
        '[data-ph-frame]',
        { y: 80 },
        {
          y: -80,
          ease: 'none',
          scrollTrigger: { trigger: '[data-ph-frame]', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )

      gsap.from('[data-value]', {
        yPercent: 140,
        duration: 1.2,
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-values]', start: 'top 85%', once: true },
      })

      return () => split.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} data-header="light" aria-labelledby="philosophy-title" className="on-light section-y relative bg-ivory">
      <div className="container-x">
        <div className="grid-12 gap-y-12">
          <div className="col-span-12 lg:col-span-3">
            <Eyebrow index="01" className="text-teal">
              Our philosophy
            </Eyebrow>
            <h2 id="philosophy-title" className="sr-only">
              Our investment philosophy
            </h2>
          </div>

          <p data-statement className="statement col-span-12 text-ink lg:col-span-9">
            We invest in people first, then in plans, and we stay long enough to see both through.
          </p>
        </div>

        <div className="grid-12 mt-20 gap-y-14 lg:mt-32">
          <div data-ph-frame className="relative col-span-12 sm:col-span-8 lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Img
                data-ph-img
                base="/media/hero/about"
                alt="Two colleagues reviewing plans together at a desk"
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover object-[38%_50%]"
              />
            </div>
            <p className="mt-4 text-xs tracking-[0.04em] text-slate">Headquartered in Milwaukee, Wisconsin</p>
          </div>

          <div className="col-span-12 flex flex-col justify-end gap-8 lg:col-span-5 lg:col-start-8">
            <Reveal variant="rise">
              <p className="lede text-ink">
                Founders, management teams and independent sponsors come to us when their company is ready for its next
                chapter, and they want a partner who will help write it rather than dictate it.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={0.15}>
              <p className="body-copy text-ink/75">
                Our partners have run plants, closed books and integrated acquisitions, as well as invested. That means
                practical help when it matters: a board seat that adds rather than audits, introductions to the right lenders
                and hires, and the patience to let a good plan play out.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={0.25}>
              <ArrowLink to="/who-we-are/about-us" className="text-teal">
                More about who we are
              </ArrowLink>
            </Reveal>
          </div>
        </div>

        <div className="mt-24 border-t hairline pt-8 lg:mt-36">
          <p className="eyebrow mb-8 text-slate">Four principles we have kept since 1996</p>
          <ul data-values className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v} className="border-b hairline pb-5 sm:border-b-0">
                <span className="text-mask block">
                  <span data-value className="flex items-baseline gap-4">
                    <span className="tabular text-xs font-semibold text-teal">0{i + 1}</span>
                    <span className="display-s">{v}</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
