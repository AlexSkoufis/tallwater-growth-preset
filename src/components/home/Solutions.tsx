import { useRef } from 'react'
import { solutions } from '../../data/criteria'
import { ease, gsap, useGSAP } from '../../lib/gsap'
import { SplitHeading } from '../motion/SplitHeading'
import { Reveal } from '../motion/Reveal'
import { ArrowLink } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { Img } from '../ui/Img'

const stageColors = ['#0c1f28', '#0f3442', '#112a35']

export function Solutions({ index = '02' }: { index?: string }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const stage = ref.current!.querySelector<HTMLElement>('[data-stage]')!
        const scenes = gsap.utils.toArray<HTMLElement>('[data-scene]', stage)
        const n = scenes.length

        scenes.forEach((scene, i) => {
          if (i === 0) return
          gsap.set(scene.querySelector('[data-frame]'), { clipPath: 'inset(100% 0% 0% 0%)' })
          gsap.set(scene.querySelector('[data-img]'), { scale: 1.3 })
          gsap.set(scene.querySelectorAll('[data-line]'), { yPercent: 140 })
        })

        const tl = gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${(n - 1) * window.innerHeight * 1.1}`,
            pin: true,
            scrub: 0.9,
            snap: { snapTo: 1 / (n - 1), duration: { min: 0.3, max: 0.8 }, ease: 'power2.inOut', delay: 0.05 },
            invalidateOnRefresh: true,
          },
        })

        for (let i = 1; i < n; i++) {
          const prev = scenes[i - 1]
          const next = scenes[i]
          const at = i - 1
          tl.to(prev.querySelectorAll('[data-line]'), { yPercent: -140, duration: 0.4, stagger: 0.04 }, at)
            .to(prev.querySelector('[data-img]'), { scale: 1.18, duration: 0.8 }, at)
            .to(next.querySelector('[data-frame]'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8 }, at + 0.05)
            .to(next.querySelector('[data-img]'), { scale: 1.06, duration: 0.95, ease: ease.out }, at + 0.05)
            .to(next.querySelectorAll('[data-line]'), { yPercent: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }, at + 0.4)
            .to('[data-digits]', { yPercent: -(100 / n) * i, duration: 0.7 }, at + 0.15)
            .to('[data-progress]', { scaleX: (i + 1) / n, duration: 0.7 }, at + 0.15)
            .to(stage, { backgroundColor: stageColors[i % stageColors.length], duration: 0.8 }, at)
        }
      })

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-frame]').forEach((frame) => {
          gsap.fromTo(
            frame,
            { clipPath: 'inset(18% 10% 18% 10%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 40%', scrub: true },
            },
          )
        })
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} data-header="dark" aria-labelledby="solutions-title" className="relative bg-ink text-ivory">
      <div className="container-x pb-16 pt-28 lg:pb-24 lg:pt-40">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <Eyebrow index={index} tone="light" className="text-sky">
              Capital investing
            </Eyebrow>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <SplitHeading id="solutions-title" className="display-l max-w-[18ch]">
              One fund, built for three kinds of moment.
            </SplitHeading>
            <Reveal variant="fade" className="mt-10 grid gap-8 md:grid-cols-2">
              <p className="body-copy text-ivory/75">
                Tallwater invests $3 million to $10 million in established companies across the Great Lakes states. We combine
                subordinated debt and equity in whatever mix the plan needs, and we are comfortable as a minority or a control
                partner.
              </p>
              <p className="body-copy text-ivory/75">
                What we will not do is force a company into a template. Every structure starts with a conversation about what the
                owners and the team want to achieve, and works backward from there.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Pinned stage on desktop; a vertical sequence on smaller screens */}
      <div data-stage className="relative bg-ink motion-safe:lg:h-[100svh] motion-safe:lg:overflow-hidden">
        <div className="container-x relative h-full">
          {/* Desktop chrome: rolling index and progress */}
          <div
            className="pointer-events-none absolute inset-x-[var(--gutter)] top-28 z-20 hidden items-center gap-6 motion-safe:lg:flex"
            aria-hidden="true"
          >
            <div className="h-[1.25em] overflow-hidden pt-[0.1em] font-serif text-6xl font-light leading-none tracking-[-0.03em] text-sky">
              <div data-digits className="flex flex-col">
                {solutions.map((s) => (
                  <span key={s.id} className="block h-[1.25em] tabular">
                    {s.index}
                  </span>
                ))}
              </div>
            </div>
            <div className="h-px flex-1 bg-ivory/15">
              <div data-progress className="h-px origin-left bg-sky" style={{ transform: `scaleX(${1 / solutions.length})` }} />
            </div>
            <span className="eyebrow tabular text-ivory/50">0{solutions.length}</span>
          </div>

          {solutions.map((s, i) => (
            <article
              key={s.id}
              data-scene
              aria-labelledby={`sol-${s.id}`}
              className="grid-12 relative gap-y-8 py-10 motion-safe:lg:absolute motion-safe:lg:inset-x-[var(--gutter)] motion-safe:lg:inset-y-0 motion-safe:lg:items-end motion-safe:lg:py-0 motion-safe:lg:pb-[9vh] motion-safe:lg:pt-48"
              style={{ zIndex: i + 1 }}
            >
              <div className="col-span-12 motion-safe:lg:order-2 motion-safe:lg:col-span-7 motion-safe:lg:col-start-6 motion-safe:lg:h-full">
                <div
                  data-frame
                  className="relative aspect-[4/3] overflow-hidden motion-safe:lg:aspect-auto motion-safe:lg:h-full"
                >
                  <Img
                    data-img
                    base={s.image}
                    alt=""
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="grade-dark absolute inset-0 h-full w-full object-cover will-change-transform"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="col-span-12 flex flex-col justify-end motion-safe:lg:order-1 motion-safe:lg:col-span-5 motion-safe:lg:pr-8">
                <p className="eyebrow mb-5 flex items-center gap-3 text-sky motion-safe:lg:hidden">
                  <span className="tabular">{s.index}</span>
                  <span className="h-px w-8 bg-sky/40" aria-hidden="true" />
                </p>
                <div className="text-mask">
                  <p data-line className="eyebrow text-ivory/60">
                    {s.kicker}
                  </p>
                </div>
                {/* Spacing lives on outer wrappers; masks size their glyph room from the title's own font size. */}
                <div className="mt-4">
                  <div className="text-mask font-display text-[clamp(2.6rem,4.5vw,5.5rem)] leading-[0.98] tracking-[-0.03em]">
                    <h3 id={`sol-${s.id}`} data-line>
                      {s.title}
                    </h3>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-mask">
                    <p data-line className="body-copy max-w-md text-ivory/75">
                      {s.body}
                    </p>
                  </div>
                </div>
                {i === solutions.length - 1 && (
                  <div className="mt-8">
                    <div className="text-mask">
                      <div data-line>
                        <ArrowLink to="/investing" className="text-sky">
                          How we invest
                        </ArrowLink>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
