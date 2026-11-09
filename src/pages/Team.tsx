import { useRef } from 'react'
import { Page } from '../components/layout/Page'
import { SplitHeading } from '../components/motion/SplitHeading'
import { ClosingCta } from '../components/sections/ClosingCta'
import { PageHero } from '../components/sections/PageHero'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Portrait } from '../components/ui/Portrait'
import { board, team } from '../data/team'
import type { TeamGroup } from '../data/types'
import { gsap, useGSAP } from '../lib/gsap'

const groups: { group: TeamGroup; title: string; note: string }[] = [
  { group: 'Partners', title: 'Partners', note: 'Leading Tallwater and every investment it makes.' },
  { group: 'Investment Team', title: 'Investment team', note: 'Sourcing, diligence, execution and portfolio management.' },
  { group: 'Operations', title: 'Operations', note: 'Finance, compliance, fund accounting and administration.' },
]

export default function Team() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-portrait-frame]').forEach((frame) => {
          gsap
            .timeline({ scrollTrigger: { trigger: frame, start: 'top 90%', once: true } })
            .fromTo(
              frame,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' },
            )
            .from(frame.querySelector('img'), { scale: 1.25, duration: 1.8 }, '<')
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <Page
      title="Our Team"
      description="Meet the Tallwater Growth Partners team: partners, investment professionals, operations and our board."
    >
      <PageHero
        tone="light"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Who We Are', to: '/who-we-are/about-us' }, { label: 'Our Team' }]}
        eyebrow="Our team"
        title="Who you will work with."
        intro={
          <p>
            Partners lead every investment personally, supported by an investment team and an operations group that has kept
            our funds running smoothly for years.
          </p>
        }
        image={{ base: '/media/hero/team', alt: 'Colleagues in a working session around a laptop', position: '70% 40%' }}
      />

      <div ref={ref}>
        {groups.map(({ group, title, note }, gi) => {
          const members = team.filter((m) => m.group === group)
          const isPartners = group === 'Partners'
          return (
            <section
              key={group}
              data-header="light"
              aria-labelledby={`group-${gi}`}
              className={`on-light text-ink ${gi % 2 === 0 ? 'bg-ivory' : 'bg-paper'} py-20 sm:py-28`}
            >
              <div className="container-x">
                <div className="mb-14 flex flex-col justify-between gap-4 border-b hairline pb-6 sm:flex-row sm:items-end">
                  <div>
                    <Eyebrow index={`0${gi + 1}`} className="text-teal">
                      {`${members.length} ${members.length === 1 ? 'person' : 'people'}`}
                    </Eyebrow>
                    <SplitHeading id={`group-${gi}`} className="display-m mt-5">
                      {title}
                    </SplitHeading>
                  </div>
                  <p className="max-w-xs text-sm text-slate">{note}</p>
                </div>
                <ul
                  className={`grid gap-x-[clamp(0.75rem,1.6vw,1.75rem)] gap-y-14 ${
                    isPartners ? 'sm:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  }`}
                >
                  {members.map((m) => (
                    <li key={m.slug}>
                      <Portrait
                        member={m}
                        sizes={isPartners ? '(min-width: 640px) 32vw, 90vw' : '(min-width: 1024px) 24vw, 45vw'}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )
        })}

        <section data-header="dark" aria-labelledby="board-title" className="grain section-y bg-ink text-ivory">
          <div className="container-x">
            <div className="grid-12 items-end gap-y-8">
              <div className="col-span-12 lg:col-span-6">
                <Eyebrow index="04" tone="light" className="text-sky">
                  Governance
                </Eyebrow>
                <SplitHeading id="board-title" className="display-l mt-8">
                  Our board.
                </SplitHeading>
              </div>
            </div>
            <ul className="mt-16 grid grid-cols-2 gap-x-[clamp(0.75rem,1.6vw,1.75rem)] gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
              {board.map((b) => (
                <li key={b.name}>
                  <div data-portrait-frame className="relative aspect-[4/5] overflow-hidden bg-ink-2">
                    <img
                      src={b.image}
                      alt={`Portrait of ${b.name}`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-top grayscale-[35%]"
                    />
                  </div>
                  <p className="mt-4 font-serif text-xl font-light">{b.name}</p>
                  <p className="mt-1 text-sm text-ivory/55">Board Member</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <ClosingCta />
    </Page>
  )
}
