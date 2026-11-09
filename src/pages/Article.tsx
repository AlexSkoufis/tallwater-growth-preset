import { Check, Download, Link2 } from 'lucide-react'
import { Fragment, useRef, useState, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Page } from '../components/layout/Page'
import { Reveal } from '../components/motion/Reveal'
import { SplitHeading } from '../components/motion/SplitHeading'
import { ClosingCta } from '../components/sections/ClosingCta'
import { ArticleCard, ArticleMeta } from '../components/ui/ArticleCard'
import { ArticleCover } from '../components/ui/ArticleCover'
import { CompanyPlate } from '../components/ui/CompanyPlate'
import { TLink } from '../components/ui/TLink'
import { articles, formatDate, getArticle } from '../data/news'
import { getCompany } from '../data/portfolio'
import { site } from '../data/site'
import { ease, gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { whenIntroDone } from '../lib/intro'
import NotFound from './NotFound'

/** Renders [label](href) inline links inside article copy. */
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(
      <TLink key={m.index} to={m[2]} className="u-link-static font-medium text-teal">
        {m[1]}
        {/^https?:/.test(m[2]) && <span className="sr-only"> (opens in a new tab)</span>}
      </TLink>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export default function ArticlePage() {
  const { slug = '' } = useParams()
  const article = getArticle(slug)
  const ref = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useGSAP(
    (_ctx, contextSafe) => {
      if (!article || prefersReducedMotion()) return
      gsap.set('[data-ar-fade]', { autoAlpha: 0, y: 14 })
      gsap.set('[data-ar-cover]', { clipPath: 'inset(0% 0% 100% 0%)' })
      const cancel = whenIntroDone(
        contextSafe!(() => {
          gsap
            .timeline({ defaults: { ease: ease.out }, delay: 0.3 })
            .to('[data-ar-fade]', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 })
            .to('[data-ar-cover]', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0.3)
        }),
      )
      // Reading progress.
      gsap.fromTo(
        '[data-ar-progress]',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-ar-body]', start: 'top 70%', end: 'bottom 70%', scrub: true },
        },
      )
      return cancel
    },
    { scope: ref, dependencies: [slug] },
  )

  if (!article) return <NotFound />

  const company = article.relatedCompany ? getCompany(article.relatedCompany) : undefined
  const idx = articles.indexOf(article)
  const more = [...articles.slice(idx + 1), ...articles.slice(0, idx)].filter((a) => !a.archive).slice(0, 3)
  const isAnnouncement = article.slug === site.announcement.articleSlug

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Page
      title={article.title}
      description={article.excerpt}
      schema={{
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        datePublished: article.date,
        publisher: { '@type': 'Organization', name: site.name },
      }}
    >
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[71] h-0.5" aria-hidden="true">
        <div data-ar-progress className="h-full origin-left scale-x-0 bg-teal" />
      </div>

      <article ref={ref} data-header="light" className="on-light bg-ivory text-ink">
        <header className="container-x pt-40 sm:pt-48">
          <nav aria-label="Breadcrumb" data-ar-fade className="mb-10">
            <ol className="eyebrow flex flex-wrap items-center gap-3 text-slate">
              <li>
                <TLink to="/news-insights" className="u-link hover:text-ink">
                  News &amp; Insights
                </TLink>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-teal">
                {article.category}
              </li>
            </ol>
          </nav>
          <div className="mx-auto max-w-5xl">
            <div data-ar-fade>
              <ArticleMeta article={article} />
            </div>
            <SplitHeading as="h1" trigger="intro" delay={0.25} className="display-l mt-8">
              {article.title}
            </SplitHeading>
            <p data-ar-fade className="lede mt-8 max-w-3xl text-ink/75">
              {article.excerpt}
            </p>
          </div>
        </header>

        <div className="container-x mt-14">
          <div data-ar-cover className="mx-auto aspect-[21/9] max-w-6xl overflow-hidden">
            <ArticleCover article={article} size="lg" className="size-full" />
          </div>
        </div>

        <div className="container-x grid-12 gap-y-14 pb-28 pt-16 sm:pb-36 lg:pt-24">
          {/* Sidebar */}
          <aside className="order-2 col-span-12 lg:order-1 lg:col-span-3">
            <div className="space-y-8 lg:sticky lg:top-32">
              <div className="border-t hairline pt-5">
                <p className="eyebrow text-slate">Published</p>
                <p className="mt-2 font-serif text-xl">
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                </p>
              </div>
              {article.pdf && (
                <a
                  href={article.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 border-t hairline pt-5 text-sm font-semibold text-teal"
                >
                  <span className="u-link-static">Download full PDF</span>
                  <Download className="size-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              <button
                type="button"
                onClick={copyLink}
                className="flex w-full items-center justify-between gap-3 border-t hairline pt-5 text-left text-sm font-semibold"
              >
                <span className="u-link-static">{copied ? 'Link copied' : 'Copy link'}</span>
                {copied ? (
                  <Check className="size-4 text-teal" aria-hidden="true" />
                ) : (
                  <Link2 className="size-4" aria-hidden="true" />
                )}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? 'Link copied to clipboard' : ''}
              </span>
              {company && (
                <TLink to={`/investing/portfolio-companies/${company.slug}`} className="group block border-t hairline pt-5">
                  <p className="eyebrow text-slate">Portfolio company</p>
                  <div className="mt-4 flex items-center gap-4">
                    <CompanyPlate company={company} className="size-16 shrink-0" />
                    <span className="font-serif text-lg leading-tight">
                      <span className="u-link">{company.name}</span>
                    </span>
                  </div>
                </TLink>
              )}
            </div>
          </aside>

          {/* Body */}
          <div data-ar-body className="order-1 col-span-12 lg:order-2 lg:col-span-7 lg:col-start-5">
            {article.archive && (
              <p className="mb-10 border-l-2 border-sand bg-paper px-5 py-4 text-sm leading-relaxed text-ink/75">
                This piece is part of our archive. Figures and details reflect the date it was published.
              </p>
            )}
            <div className="space-y-7 text-[1.075rem] leading-[1.8] text-ink/85">
              {article.body.map((p, i) => {
                const quote = p.startsWith('“')
                return (
                  <Fragment key={i}>
                    <p
                      className={
                        i === 0
                          ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.4rem] first-letter:font-light first-letter:leading-[0.8] first-letter:text-teal'
                          : quote
                            ? 'border-l border-teal/40 pl-6 font-serif text-[1.3rem] font-light leading-[1.55] text-ink'
                            : ''
                      }
                    >
                      {renderInline(p)}
                    </p>
                  </Fragment>
                )
              })}
            </div>

            {isAnnouncement && (
              <Reveal variant="rise" className="mt-14 grid gap-6 bg-teal p-8 text-ivory sm:grid-cols-2 sm:p-10">
                <div>
                  <p className="eyebrow text-sky">Own a growing company?</p>
                  <p className="mt-4 font-serif text-2xl font-light leading-snug">See whether your business fits Fund II.</p>
                  <TLink to="/investing/investment-criteria" className="mt-6 inline-flex text-sm font-semibold">
                    <span className="u-link-static">View investment criteria</span>
                  </TLink>
                </div>
                <div>
                  <p className="eyebrow text-sky">Bringing us a deal?</p>
                  <p className="mt-4 font-serif text-2xl font-light leading-snug">Independent sponsors are always welcome.</p>
                  <TLink to="/get-in-touch" className="mt-6 inline-flex text-sm font-semibold">
                    <span className="u-link-static">Start a conversation</span>
                  </TLink>
                </div>
              </Reveal>
            )}

            <p className="mt-14 border-t hairline pt-6 text-xs leading-relaxed text-slate">
              Published by {site.name} on {formatDate(article.date)}.
            </p>
          </div>
        </div>
      </article>

      <section
        data-header="light"
        aria-labelledby="more-news"
        className="on-light border-t hairline bg-paper py-20 text-ink sm:py-28"
      >
        <div className="container-x">
          <div className="flex items-end justify-between border-b hairline pb-6">
            <h2 id="more-news" className="display-m">
              Keep reading
            </h2>
            <TLink to="/news-insights" className="u-link text-sm font-semibold text-teal">
              All news
            </TLink>
          </div>
          <ul className="mt-12 grid gap-12 md:grid-cols-3">
            {more.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
    </Page>
  )
}
