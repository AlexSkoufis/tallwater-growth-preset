import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap'
import { SplitHeading } from '../motion/SplitHeading'
import { Reveal } from '../motion/Reveal'
import { Eyebrow } from '../ui/Eyebrow'
import { Img } from '../ui/Img'

/** Demo figures and milestones: replace them with your own. */
const figures = [
  { prefix: '', value: 30, suffix: '', label: 'Years backing owner-led companies across the Great Lakes' },
  { prefix: '$', value: 140, suffix: 'M', label: 'Final close of Tallwater Growth Fund II, above its $120 million target' },
  { prefix: '', value: 60, suffix: '+', label: 'Investments led or co-led by our partners since 1996' },
  { prefix: '', value: 9, suffix: '', label: 'Add-on acquisitions completed by portfolio companies in the last three years' },
]

const milestones = [
  { year: '1996', text: 'Margaret Holloway founds Tallwater in Milwaukee to provide patient capital to family-owned companies.' },
  { year: '2009', text: 'Daniel Okafor joins the firm and the first independent sponsor partnerships begin.' },
  { year: '2018', text: 'Tallwater Growth Fund I is raised and goes on to back eleven companies across five states.' },
  { year: '2024', text: 'Tallwater Growth Fund II launches with commitments from returning and new limited partners.' },
  { year: '2025', text: 'Fund II closes at $140 million, above target, and completes its seventh investment.' },
]

export function Experience() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: 2.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v))
          },
        })
      })

      gsap.from('[data-figure-rule]', {
        scaleX: 0,
        duration: 1.6,
        ease: 'power3.inOut',
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-figures]', start: 'top 85%', once: true },
      })

      gsap.fromTo(
        '[data-line-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-timeline]', start: 'top 65%', end: 'bottom 65%', scrub: true },
        },
      )

      gsap.utils.toArray<HTMLElement>('[data-milestone]').forEach((m) => {
        gsap
          .timeline({ scrollTrigger: { trigger: m, start: 'top 65%', toggleActions: 'play none none reverse' } })
          .to(m.querySelector('[data-dot]'), { backgroundColor: '#80d3f4', scale: 1.6, duration: 0.5 }, 0)
          .fromTo(m.querySelector('[data-year]'), { color: 'rgb(244 240 234 / 0.35)' }, { color: '#80d3f4', duration: 0.5 }, 0)
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} data-header="dark" aria-labelledby="experience-title" className="grain relative bg-teal text-ivory">
      <div className="container-x section-y">
        <Eyebrow index="06" tone="light" className="text-sky">
          Experience
        </Eyebrow>
        <SplitHeading id="experience-title" className="display-l mt-8 max-w-[20ch]">
          We have sat where you sit. That changes how we invest.
        </SplitHeading>

        <dl data-figures className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {figures.map((f) => (
            <div key={f.label} className="relative pt-7">
              <span data-figure-rule className="absolute inset-x-0 top-0 h-px origin-left bg-ivory/25" aria-hidden="true" />
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <p className="font-serif text-[clamp(3.5rem,6.5vw,6.5rem)] font-light leading-none tracking-[-0.04em] tabular">
                  {f.prefix}
                  <span data-count={f.value}>{f.value}</span>
                  {f.suffix}
                </p>
                <p className="mt-4 max-w-[17rem] text-sm leading-relaxed text-ivory/70" aria-hidden="true">
                  {f.label}
                </p>
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid-12 mt-28 gap-y-14 lg:mt-40">
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <h3 className="display-m max-w-[12ch]">Three decades, one approach.</h3>
              <p className="body-copy mt-6 max-w-sm text-ivory/70">
                The funds have grown and the team has changed, but the way we work with owners has not. A few of the
                moments along the way.
              </p>
            </div>
          </div>

          <ol data-timeline className="relative col-span-12 lg:col-span-7 lg:col-start-6">
            <span className="absolute bottom-2 left-[5px] top-2 w-px bg-ivory/15" aria-hidden="true" />
            <span
              data-line-fill
              className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-sky motion-reduce:hidden"
              aria-hidden="true"
            />
            {milestones.map((m) => (
              <li
                key={m.year}
                data-milestone
                className="relative grid gap-3 pb-14 pl-12 last:pb-0 sm:grid-cols-[8rem_1fr] sm:gap-8"
              >
                <span
                  data-dot
                  className="absolute left-0 top-3 size-[11px] rounded-full border border-ivory/40 bg-teal"
                  aria-hidden="true"
                />
                <p data-year className="font-serif text-4xl font-light leading-none tracking-[-0.02em] text-ivory/35 tabular">
                  {m.year}
                </p>
                <p className="body-copy max-w-lg text-ivory/85">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid-12 mt-28 items-end gap-y-10 border-t border-ivory/15 pt-14 lg:mt-40">
          <Reveal variant="clip-up" className="relative col-span-8 aspect-[5/6] overflow-hidden sm:col-span-5 lg:col-span-3">
            <Img
              base="/media/hero/harbor"
              widths={[960]}
              sizes="(min-width: 1024px) 22vw, 60vw"
              alt="A city skyline along the water at dusk"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </Reveal>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <p className="eyebrow text-sky">Beyond investing</p>
            <p className="display-s mt-6 max-w-2xl">
              Based in Milwaukee, we invest where we live, and we show up for the places our companies call home.
            </p>
            <p className="body-copy mt-6 max-w-xl text-ivory/70">
              Every year our team volunteers alongside portfolio company employees, and the firm matches charitable gifts made
              by everyone at Tallwater to organizations across the region.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
