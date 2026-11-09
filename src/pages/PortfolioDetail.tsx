import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Page } from '../components/layout/Page'
import { Reveal } from '../components/motion/Reveal'
import { SplitHeading } from '../components/motion/SplitHeading'
import { ClosingCta } from '../components/sections/ClosingCta'
import { ArticleCard } from '../components/ui/ArticleCard'
import { CompanyPlate } from '../components/ui/CompanyPlate'
import { TLink } from '../components/ui/TLink'
import { fundShort, getCompany, hostname, portfolio } from '../data/portfolio'
import { articlesForCompany } from '../data/news'
import { ease, gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { whenIntroDone } from '../lib/intro'
import NotFound from './NotFound'

export default function PortfolioDetail() {
  const { slug = '' } = useParams()
  const company = getCompany(slug)
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      if (!company || prefersReducedMotion()) return
      gsap.set('[data-pd-plate]', { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set('[data-pd-fade]', { autoAlpha: 0, y: 16 })
      return whenIntroDone(
        contextSafe!(() => {
          gsap
            .timeline({ defaults: { ease: ease.out }, delay: 0.3 })
            .to('[data-pd-plate]', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
            .from('[data-pd-plate] img', { scale: 1.3, duration: 1.8 }, '<0.1')
            .to('[data-pd-fade]', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.5)
        }),
      )
    },
    { scope: ref, dependencies: [slug] },
  )

  if (!company) return <NotFound />

  const i = portfolio.indexOf(company)
  const prev = portfolio[(i - 1 + portfolio.length) % portfolio.length]
  const next = portfolio[(i + 1) % portfolio.length]
  const news = articlesForCompany(company.slug)

  const facts = [
    { label: 'Fund', value: company.fund },
    { label: 'Status', value: company.status },
    { label: 'Sector', value: company.sector },
    company.location && { label: 'Location', value: company.location },
    company.founded && { label: 'Founded', value: company.founded },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <Page title={company.name} description={company.description.slice(0, 155)}>
      <section ref={ref} data-header="light" className="on-light bg-ivory text-ink">
        <div className="container-x pb-24 pt-40 sm:pt-48 lg:pb-36">
          <nav aria-label="Breadcrumb" data-pd-fade className="mb-12">
            <ol className="eyebrow flex flex-wrap items-center gap-3 text-slate">
              <li>
                <TLink to="/investing" className="u-link hover:text-ink">
                  Investing
                </TLink>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <TLink to="/investing/portfolio-companies" className="u-link hover:text-ink">
                  Portfolio
                </TLink>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-teal">
                {company.name}
              </li>
            </ol>
          </nav>

          <div className="grid-12 gap-y-14">
            <div className="col-span-12 md:col-span-5">
              <div className="md:sticky md:top-32">
                <div data-pd-plate className="aspect-square overflow-hidden">
                  <CompanyPlate company={company} className="size-full" priority />
                </div>
                {company.website && (
                  <a
                    data-pd-fade
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 flex items-center justify-between border-b hairline pb-4 text-sm font-semibold"
                  >
                    <span>Visit {hostname(company.website)}</span>
                    <ArrowUpRight
                      className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <p data-pd-fade className="eyebrow text-teal">
                {company.sector}
              </p>
              <SplitHeading as="h1" trigger="intro" delay={0.3} className="display-xl mt-6">
                {company.name}
              </SplitHeading>
              <p data-pd-fade className="lede mt-10 text-ink/80">
                {company.description}
              </p>

              <dl data-pd-fade className="mt-14 border-t hairline">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="grid grid-cols-[8rem_1fr] gap-6 border-b hairline py-4 text-sm sm:grid-cols-[10rem_1fr]"
                  >
                    <dt className="eyebrow pt-0.5 text-slate">{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>

              {news.length > 0 && (
                <Reveal variant="rise" className="mt-20">
                  <h2 className="eyebrow text-slate">Related news</h2>
                  <ul className="mt-4 divide-y divide-ink/10 border-t hairline">
                    {news.map((a) => (
                      <li key={a.slug}>
                        <ArticleCard article={a} variant="compact" />
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="More portfolio companies" data-header="light" className="on-light border-t hairline bg-paper text-ink">
        <div className="container-x grid sm:grid-cols-2">
          {[
            { c: prev, dir: 'Previous', Icon: ArrowLeft },
            { c: next, dir: 'Next', Icon: ArrowRight },
          ].map(({ c, dir, Icon }) => (
            <TLink
              key={dir}
              to={`/investing/portfolio-companies/${c.slug}`}
              className={`group flex items-center gap-6 py-10 sm:py-14 ${dir === 'Next' ? 'border-t hairline sm:justify-end sm:border-l sm:border-t-0 sm:pl-10 sm:text-right' : 'sm:pr-10'}`}
            >
              {dir === 'Previous' && <CompanyPlate company={c} className="size-20 shrink-0 sm:size-24" />}
              <span className={dir === 'Next' ? 'sm:order-first' : ''}>
                <span className="eyebrow flex items-center gap-2 text-slate sm:[justify-content:inherit]">
                  {dir === 'Previous' && <Icon className="size-3.5" aria-hidden="true" />}
                  {dir} company
                  {dir === 'Next' && <Icon className="size-3.5" aria-hidden="true" />}
                </span>
                <span className="mt-3 block font-serif text-2xl font-light tracking-[-0.015em] sm:text-3xl">
                  <span className="u-link">{c.name}</span>
                </span>
                <span className="mt-1 block text-sm text-slate">
                  {c.sector}, {fundShort[c.fund]}
                </span>
              </span>
              {dir === 'Next' && <CompanyPlate company={c} className="size-20 shrink-0 sm:size-24" />}
            </TLink>
          ))}
        </div>
      </nav>

      <ClosingCta />
    </Page>
  )
}
