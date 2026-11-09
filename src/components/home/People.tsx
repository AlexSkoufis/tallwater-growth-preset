import { useRef } from 'react'
import { partners, team } from '../../data/team'
import { gsap, useGSAP } from '../../lib/gsap'
import { SplitHeading } from '../motion/SplitHeading'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { Portrait } from '../ui/Portrait'

const others = team.filter((m) => m.group !== 'Partners')

export function People() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-partner]').forEach((el, i) => {
          const frame = el.querySelector('[data-portrait-frame]')
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
            .fromTo(
              frame,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', delay: i * 0.12 },
            )
            .from(frame!.querySelector('img'), { scale: 1.3, duration: 1.9 }, '<')
        })
        // Partners drift at slightly different rates for depth.
        gsap.utils.toArray<HTMLElement>('[data-partner]').forEach((el, i) => {
          gsap.to(el, {
            y: [0, -60, -20][i] ?? 0,
            ease: 'none',
            scrollTrigger: { trigger: '[data-partners]', start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })

      // Desktop: the wider team travels horizontally while the section is pinned.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const wrap = ref.current!.querySelector<HTMLElement>('[data-track-wrap]')!
        const track = wrap.querySelector<HTMLElement>('[data-track]')!
        const distance = () => track.scrollWidth - wrap.clientWidth
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'center center',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set('[data-track-progress]', { scaleX: self.progress }),
          },
        })
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-header="light"
      aria-labelledby="people-title"
      className="on-light relative overflow-hidden bg-ivory text-ink"
    >
      <div className="container-x pt-28 sm:pt-40">
        <div className="grid-12 items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow index="05" className="text-teal">
              Our people
            </Eyebrow>
            <SplitHeading id="people-title" className="display-xl mt-8 max-w-[12ch]">
              Who you will work with.
            </SplitHeading>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="body-copy text-ink/70">
              Partners lead every investment personally, from the first call to the day we exit. No hand-offs to a junior
              team once the papers are signed.
            </p>
          </div>
        </div>

        <ul data-partners className="mt-20 grid gap-x-[clamp(0.75rem,1.6vw,1.75rem)] gap-y-14 sm:grid-cols-3 lg:mt-28">
          {partners.map((m, i) => (
            <li key={m.slug} data-partner className={i === 1 ? 'sm:mt-24' : i === 2 ? 'sm:mt-10' : ''}>
              <Portrait member={m} sizes="(min-width: 640px) 32vw, 90vw" />
            </li>
          ))}
        </ul>
      </div>

      <div
        data-track-wrap
        className="relative mt-24 pb-28 sm:pb-36 lg:mt-36 motion-safe:lg:flex motion-safe:lg:h-[100svh] motion-safe:lg:flex-col motion-safe:lg:justify-center motion-safe:lg:pb-0"
      >
        <div className="container-x mb-10 flex items-end justify-between gap-6">
          <h3 className="eyebrow text-slate">Investment and operations team</h3>
          <div className="hidden w-48 items-center gap-4 lg:flex" aria-hidden="true">
            <span className="h-px flex-1 bg-ink/15">
              <span data-track-progress className="block h-px origin-left scale-x-0 bg-teal" />
            </span>
          </div>
        </div>

        <ul
          data-track
          className="no-scrollbar flex snap-x snap-mandatory gap-[clamp(0.75rem,1.6vw,1.75rem)] overflow-x-auto px-[var(--gutter)] motion-safe:lg:snap-none motion-safe:lg:overflow-visible"
        >
          {others.map((m) => (
            <li key={m.slug} className="w-[72vw] shrink-0 snap-start sm:w-[40vw] lg:w-[21vw] lg:max-w-[22rem]">
              <Portrait member={m} sizes="(min-width: 1024px) 22vw, 70vw" showGroup />
            </li>
          ))}
          <li className="flex w-[72vw] shrink-0 snap-start flex-col justify-end border-l hairline pl-8 sm:w-[40vw] lg:w-[24vw]">
            <p className="display-s max-w-[14ch]">Meet the full team, and our board.</p>
            <div className="mt-8">
              <Button to="/who-we-are/our-team" variant="ink">
                Our team
              </Button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}
