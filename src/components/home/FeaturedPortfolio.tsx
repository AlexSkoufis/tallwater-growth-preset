import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { featuredCompanies, fundShort, growthFundCompanies, hostname } from '../../data/portfolio'
import type { PortfolioCompany } from '../../data/types'
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap'
import { SplitHeading } from '../motion/SplitHeading'
import { Button } from '../ui/Button'
import { CompanyPlate } from '../ui/CompanyPlate'
import { Eyebrow } from '../ui/Eyebrow'
import { TLink } from '../ui/TLink'

const active = growthFundCompanies.filter((c) => c.status === 'Active')
const indexList = active.filter((c) => !featuredCompanies.includes(c))
const fund2Count = growthFundCompanies.filter((c) => c.fund === 'Tallwater Growth Fund II').length

export function FeaturedPortfolio({ index = '04' }: { index?: string }) {
  const ref = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current!
      if (prefersReducedMotion()) return

      // Featured plates: a mask wipe, then the logo settles.
      gsap.utils.toArray<HTMLElement>('[data-feature]').forEach((card, i) => {
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: 'top 85%', once: true } })
          .fromTo(
            card.querySelector('[data-feature-frame]'),
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', delay: i * 0.08 },
          )
          .from(card.querySelector('[data-feature-frame] img'), { scale: 1.25, duration: 1.8 }, '<0.2')
          .from(card.querySelectorAll('[data-feature-meta]'), { autoAlpha: 0, y: 14, stagger: 0.06, duration: 1 }, '<0.4')
      })

      gsap.from('[data-index-row]', {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        stagger: 0.05,
        scrollTrigger: { trigger: '[data-index]', start: 'top 80%', once: true },
      })

      // Cursor-following preview for the index (precise pointers only).
      const preview = previewRef.current
      if (!preview || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
      const xTo = gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3.out' })
      const yTo = gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3.out' })
      const rTo = gsap.quickTo(preview, 'rotate', { duration: 0.9, ease: 'power3.out' })
      const imgs = gsap.utils.toArray<HTMLElement>('[data-preview-item]', preview)
      let lastX = 0

      const onMove = (e: PointerEvent) => {
        xTo(e.clientX)
        yTo(e.clientY)
        rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6))
        lastX = e.clientX
      }
      const show = (i: number) => {
        gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' })
        imgs.forEach((img, k) => gsap.to(img, { autoAlpha: k === i ? 1 : 0, duration: 0.35 }))
      }
      const hide = () => gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: 'power3.out' })

      const list = root.querySelector<HTMLElement>('[data-index]')!
      const rows = gsap.utils.toArray<HTMLElement>('[data-index-row]')
      const enters = rows.map((row, i) => {
        const fn = () => show(i)
        row.addEventListener('pointerenter', fn)
        return fn
      })
      list.addEventListener('pointermove', onMove)
      list.addEventListener('pointerleave', hide)
      return () => {
        rows.forEach((row, i) => row.removeEventListener('pointerenter', enters[i]))
        list.removeEventListener('pointermove', onMove)
        list.removeEventListener('pointerleave', hide)
      }
    },
    { scope: ref },
  )

  const [lead, ...rest] = featuredCompanies

  return (
    <section ref={ref} data-header="dark" aria-labelledby="portfolio-title" className="grain relative bg-ink text-ivory">
      <div className="container-x section-y">
        <div className="grid-12 items-end gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <Eyebrow index={index} tone="light" className="text-sky">
              Featured portfolio
            </Eyebrow>
            <SplitHeading id="portfolio-title" className="display-xl mt-8 max-w-[14ch]">
              Companies we are proud to back.
            </SplitHeading>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:pb-3">
            <p className="body-copy max-w-sm text-ivory/70">
              {growthFundCompanies.length} companies across Tallwater Growth Funds I and II, {fund2Count} of them in Fund II. Every
              one still led by the people who know it best.
            </p>
            <div className="mt-8">
              <Button to="/investing/portfolio-companies" variant="ghost-light">
                All portfolio companies
              </Button>
            </div>
          </div>
        </div>

        {/* Featured: asymmetric editorial layout */}
        <div className="grid-12 mt-20 gap-y-16 lg:mt-28">
          <FeatureCard company={lead} className="col-span-12 lg:sticky lg:top-28 lg:col-span-7 lg:self-start" large />
          <div className="col-span-12 flex flex-col gap-16 sm:flex-row lg:col-span-4 lg:col-start-9 lg:flex-col lg:pt-40">
            {rest.map((c) => (
              <FeatureCard key={c.slug} company={c} className="sm:flex-1" />
            ))}
          </div>
        </div>

        {/* Index of active holdings */}
        <div className="mt-28 lg:mt-40">
          <div className="flex items-end justify-between gap-6 border-b border-ivory/15 pb-5">
            <h3 className="eyebrow text-ivory/55">Active holdings</h3>
            <p className="eyebrow hidden text-ivory/40 sm:block">Sector</p>
          </div>
          <ul data-index>
            {indexList.map((c, i) => (
              <li key={c.slug} data-index-row className="border-b border-ivory/10">
                <TLink
                  to={`/investing/portfolio-companies/${c.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 py-5 sm:grid-cols-[3rem_1fr_auto] sm:py-6"
                >
                  <CompanyPlate company={c} className="size-14 sm:hidden" />
                  <span className="tabular hidden text-xs font-semibold text-ivory/40 sm:block">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-serif text-[clamp(1.4rem,3.2vw,3rem)] font-light leading-[1.05] tracking-[-0.02em] transition-[color,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-sky">
                      {c.name}
                    </span>
                    <span className="mt-1 block text-xs text-ivory/50 sm:hidden">{c.sector}</span>
                  </span>
                  <span className="hidden text-right text-sm text-ivory/60 sm:block">
                    {c.sector}
                    <span className="ml-3 text-ivory/35">{fundShort[c.fund]}</span>
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating preview (desktop) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 -ml-[7.5rem] -mt-[7.5rem] hidden size-60 scale-[0.85] opacity-0 lg:block"
        style={{ visibility: 'hidden' }}
      >
        {indexList.map((c) => (
          <div key={c.slug} data-preview-item className="absolute inset-0 opacity-0">
            <CompanyPlate company={c} className="size-full shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]" />
          </div>
        ))}
      </div>
    </section>
  )
}

function FeatureCard({ company, className = '', large }: { company: PortfolioCompany; className?: string; large?: boolean }) {
  return (
    <article data-feature className={className}>
      <TLink to={`/investing/portfolio-companies/${company.slug}`} data-cursor="View" className="group block">
        <div data-feature-frame className={`overflow-hidden ${large ? 'aspect-[5/4]' : 'aspect-[4/3]'}`}>
          <CompanyPlate
            company={company}
            className="size-full"
            imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
          />
        </div>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <p data-feature-meta className="eyebrow text-sky">
              {company.sector}
            </p>
            <h3
              data-feature-meta
              className={`mt-3 font-serif font-light tracking-[-0.02em] ${large ? 'text-4xl sm:text-5xl' : 'text-3xl'}`}
            >
              {company.name}
            </h3>
          </div>
          <span
            data-feature-meta
            className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-ivory/20 transition-colors duration-500 group-hover:border-sky group-hover:bg-sky group-hover:text-ink"
            aria-hidden="true"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <p data-feature-meta className={`body-copy mt-4 text-ivory/65 ${large ? 'max-w-xl' : ''}`}>
          {company.description}
        </p>
      </TLink>
      {company.website && (
        <a
          data-feature-meta
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="u-link-static mt-5 inline-block text-sm font-semibold text-ivory/85"
        >
          {hostname(company.website)}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </article>
  )
}
