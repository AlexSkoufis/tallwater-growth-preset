import { ArrowUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { criteria } from '../../data/criteria'
import { site } from '../../data/site'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { useSmoothScroll } from '../../lib/smooth-scroll'
import { SplitHeading } from '../motion/SplitHeading'
import { Eyebrow } from '../ui/Eyebrow'

interface Props {
  index?: string
  headingLevel?: 'h2' | 'h1'
  title?: string
}

/**
 * Split screen: a sticky index on the left tracks which criteria group is in
 * view on the right. Native `position: sticky` keeps it robust under Lenis;
 * GSAP only handles the active state and the row entrances.
 */
export function CriteriaExplorer({
  index = '03',
  headingLevel = 'h2',
  title = 'Clear criteria, so you know where you stand.',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const smooth = useSmoothScroll()

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-crit-panel]')
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
        if (prefersReducedMotion()) return
        gsap.from(panel.querySelectorAll('[data-crit-row]'), {
          yPercent: 140,
          duration: 1.1,
          stagger: 0.07,
          scrollTrigger: { trigger: panel, start: 'top 75%', once: true },
        })
        gsap.from(panel.querySelectorAll('[data-crit-rule]'), {
          scaleX: 0,
          duration: 1.4,
          stagger: 0.07,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: panel, start: 'top 75%', once: true },
        })
      })

      if (!prefersReducedMotion()) {
        gsap.to('[data-crit-bar]', {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-crit-panels]', start: 'top 55%', end: 'bottom 55%', scrub: true },
        })
      }
    },
    { scope: ref },
  )

  return (
    <section ref={ref} data-header="light" aria-labelledby="criteria-title" className="on-light relative bg-paper text-ink">
      <div className="container-x section-y">
        <div className="grid-12 gap-y-12">
          {/* Sticky index */}
          <div className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Eyebrow index={index} className="text-teal">
                Investment criteria
              </Eyebrow>
              <SplitHeading as={headingLevel} id="criteria-title" className="display-l mt-8 max-w-[15ch]">
                {title}
              </SplitHeading>
              <p className="body-copy mt-8 max-w-md text-ink/70">
                We would rather tell you early whether we are a fit. These are the guidelines Tallwater Growth Fund II invests
                against, and we are always happy to talk about the exceptions.
              </p>

              <nav aria-label="Criteria" className="relative mt-12 hidden lg:block">
                <span className="absolute left-0 top-0 h-full w-px bg-ink/10" aria-hidden="true" />
                <span
                  data-crit-bar
                  className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-teal motion-reduce:scale-y-100"
                  aria-hidden="true"
                />
                <ul>
                  {criteria.map((c, i) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => smooth.scrollTo(`#crit-${c.id}`, { offset: -120 })}
                        aria-current={active === i ? 'true' : undefined}
                        className={`group flex w-full items-baseline gap-5 py-3 pl-7 text-left transition-colors duration-500 ${
                          active === i ? 'text-ink' : 'text-ink/40 hover:text-ink/70'
                        }`}
                      >
                        <span className="tabular text-xs font-semibold">{c.index}</span>
                        <span
                          className={`font-serif text-2xl font-light tracking-[-0.01em] transition-transform duration-700 ease-[var(--ease-out-expo)] ${
                            active === i ? 'translate-x-2' : ''
                          }`}
                        >
                          {c.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <a
                href={site.overviewPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-12 inline-flex items-center gap-2 text-sm font-semibold text-teal"
              >
                <span className="u-link-static">Download the fund overview</span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </div>
          </div>

          {/* Panels */}
          <div data-crit-panels className="col-span-12 lg:col-span-6 lg:col-start-7">
            {criteria.map((c) => (
              <article
                key={c.id}
                id={`crit-${c.id}`}
                data-crit-panel
                aria-labelledby={`crit-title-${c.id}`}
                className="flex flex-col justify-center border-t hairline py-14 first:border-t-0 first:pt-0 lg:min-h-[78vh] lg:py-20 lg:first:pt-20"
              >
                <p className="eyebrow flex items-center gap-4 text-slate">
                  <span className="tabular text-teal">{c.index}</span>
                  <span>{c.title}</span>
                </p>
                <h3 id={`crit-title-${c.id}`} className="display-m mt-6 max-w-[22ch] text-ink">
                  {c.summary}
                </h3>
                <ul className="mt-10">
                  {c.items.map((item) => (
                    <li key={item.label} className="relative">
                      <span data-crit-rule className="absolute inset-x-0 top-0 h-px origin-left bg-ink/12" aria-hidden="true" />
                      <span className="text-mask block">
                        <span data-crit-row className="flex items-baseline justify-between gap-6 py-5">
                          <span className="font-serif text-[clamp(1.45rem,2.4vw,2.2rem)] font-light leading-tight tracking-[-0.015em]">
                            {item.label}
                          </span>
                          <span className="size-1.5 shrink-0 rounded-full bg-teal/60" aria-hidden="true" />
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
