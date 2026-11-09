import { formatDate } from '../../data/news'
import type { Article } from '../../data/types'
import { ArticleCover } from './ArticleCover'
import { TLink } from './TLink'

interface Props {
  article: Article
  variant?: 'lead' | 'standard' | 'row' | 'compact'
  tone?: 'light' | 'dark'
  className?: string
}

export function ArticleMeta({ article, tone = 'light' }: { article: Article; tone?: 'light' | 'dark' }) {
  return (
    <p className={`eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 ${tone === 'dark' ? 'text-ivory/55' : 'text-slate'}`}>
      <span className={tone === 'dark' ? 'text-sky' : 'text-teal'}>{article.category}</span>
      <span aria-hidden="true">/</span>
      <time dateTime={article.date}>{formatDate(article.date)}</time>
      {article.archive && (
        <>
          <span aria-hidden="true">/</span>
          <span>Archive</span>
        </>
      )}
    </p>
  )
}

export function ArticleCard({ article, variant = 'standard', tone = 'light', className = '' }: Props) {
  const to = `/news-insights/${article.slug}`

  if (variant === 'row' || variant === 'compact') {
    const compact = variant === 'compact'
    return (
      <article className={className}>
        <TLink
          to={to}
          className={`group grid ${
            compact
              ? 'grid-cols-[6.5rem_1fr] gap-5 py-7'
              : 'gap-5 py-8 sm:grid-cols-[10rem_1fr] sm:gap-10 lg:grid-cols-[12rem_1fr_14rem]'
          }`}
        >
          <div className="aspect-[4/3] overflow-hidden">
            <ArticleCover
              article={article}
              className="size-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
            />
          </div>
          <div>
            <ArticleMeta article={article} tone={tone} />
            <h3
              className={`mt-3 font-serif font-light leading-[1.15] tracking-[-0.015em] ${
                compact ? 'text-[1.2rem]' : 'text-[clamp(1.35rem,2.2vw,2rem)]'
              }`}
            >
              <span className="u-link">{article.title}</span>
            </h3>
          </div>
          {!compact && (
            <p className={`hidden text-sm leading-relaxed lg:block lg:pt-6 ${tone === 'dark' ? 'text-ivory/60' : 'text-ink/60'}`}>
              {article.excerpt}
            </p>
          )}
        </TLink>
      </article>
    )
  }

  const lead = variant === 'lead'
  return (
    <article className={className}>
      <TLink to={to} data-cursor="Read" className="group block">
        <div className={`overflow-hidden ${lead ? 'aspect-[16/11]' : 'aspect-[4/3]'}`}>
          <ArticleCover
            article={article}
            size={lead ? 'lg' : 'md'}
            className="size-full transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
        </div>
        <div className="mt-6">
          <ArticleMeta article={article} tone={tone} />
          <h3
            className={`mt-4 font-serif font-light tracking-[-0.018em] ${
              lead ? 'text-[clamp(1.9rem,3.4vw,3.4rem)] leading-[1.06]' : 'text-[clamp(1.35rem,1.8vw,1.75rem)] leading-[1.15]'
            }`}
          >
            <span className="u-link">{article.title}</span>
          </h3>
          {lead && (
            <p className={`body-copy mt-5 max-w-xl ${tone === 'dark' ? 'text-ivory/65' : 'text-ink/65'}`}>{article.excerpt}</p>
          )}
        </div>
      </TLink>
    </article>
  )
}
