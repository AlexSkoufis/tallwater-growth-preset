import { useMemo, useState } from 'react'
import { Page } from '../components/layout/Page'
import { Reveal } from '../components/motion/Reveal'
import { PageHero } from '../components/sections/PageHero'
import { ClosingCta } from '../components/sections/ClosingCta'
import { ArticleCard } from '../components/ui/ArticleCard'
import { ArrowLink } from '../components/ui/Button'
import { articles } from '../data/news'
import type { NewsCategory } from '../data/types'

type Filter = 'All' | NewsCategory

const filters: Filter[] = ['All', 'Firm News', 'Portfolio Update', 'Transaction', 'Insight', 'Industry Update']
const featured = articles.filter((a) => a.featured)

export default function News() {
  const [filter, setFilter] = useState<Filter>('All')
  const list = useMemo(() => articles.filter((a) => filter === 'All' || a.category === filter), [filter])

  return (
    <Page
      title="News & Insights"
      description="Tallwater Growth Partners news, portfolio company updates, transactions and insights."
    >
      <PageHero
        tone="light"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'News & Insights' }]}
        eyebrow="News & insights"
        title="News, deals and field notes."
        intro={<p>What is new at Tallwater and across our portfolio, plus what we are learning along the way.</p>}
      />

      {/* Featured pair */}
      <section data-header="light" aria-label="Featured" className="on-light bg-ivory pb-24 text-ink">
        <div className="container-x grid-12 gap-y-14 border-t hairline pt-14">
          <Reveal variant="rise" className="col-span-12 lg:col-span-7">
            <ArticleCard article={featured[0]} variant="lead" />
          </Reveal>
          <Reveal variant="rise" delay={0.12} className="col-span-12 sm:col-span-8 lg:col-span-4 lg:col-start-9 lg:pt-32">
            <ArticleCard article={featured[1]} variant="standard" />
          </Reveal>
        </div>
      </section>

      {/* Index */}
      <section data-header="light" aria-labelledby="all-news" className="on-light bg-paper pb-28 pt-20 text-ink sm:pb-36">
        <div className="container-x">
          <div className="flex flex-col gap-6 border-b hairline pb-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="all-news" className="display-m">
              All news &amp; insights
            </h2>
            <div
              role="group"
              aria-label="Filter by category"
              className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:px-0"
            >
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`h-9 shrink-0 rounded-full border px-4 text-sm transition-colors duration-300 ${
                    filter === f ? 'border-ink bg-ink text-ivory' : 'border-ink/15 hover:border-ink/40'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <ul className="divide-y divide-ink/10" aria-live="polite">
            {list.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} variant="row" />
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-8 border-t hairline pt-10 text-sm text-ink/70 md:grid-cols-2">
            <p className="max-w-xl leading-relaxed">
              Want the next update in your inbox? We send a short note to founders, sponsors and investors each quarter. Ask to
              be added when you get in touch.
            </p>
            <div className="flex flex-col gap-3 md:items-end">
              <ArrowLink to="/get-in-touch" className="text-teal">
                Join the quarterly update
              </ArrowLink>
              <ArrowLink to="/investing/portfolio-companies" className="text-teal">
                Browse the portfolio
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <ClosingCta />
    </Page>
  )
}
