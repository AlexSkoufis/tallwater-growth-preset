import { getCompany } from '../../data/portfolio'
import type { Article } from '../../data/types'
import { LogoMark } from './Logo'

const tones = {
  'Firm News': 'bg-ink text-ivory',
  'Portfolio Update': 'bg-teal text-ivory',
  Transaction: 'bg-stone text-ink',
  Insight: 'bg-sand text-ink',
  'Industry Update': 'bg-sand text-ink',
} as const

/**
 * Typographic covers. The source articles carry no photography, so instead
 * of inventing imagery each cover is composed from facts: the category, the
 * publication year, and the portfolio company's own logo when one applies.
 */
export function ArticleCover({ article, className = '' }: { article: Article; className?: string; size?: 'md' | 'lg' }) {
  const company = article.relatedCompany ? getCompany(article.relatedCompany) : undefined
  const year = article.date.slice(0, 4)
  const tone = tones[article.category]

  return (
    <div className={`@container relative isolate overflow-hidden ${tone} ${className}`} aria-hidden="true">
      {company ? (
        <div className="absolute inset-0 grid place-items-center p-[12%]">
          <div className="relative aspect-square h-full max-h-full bg-white shadow-[0_30px_60px_-35px_rgb(12_31_40/0.5)]">
            <img
              src={company.logo}
              alt=""
              loading="lazy"
              className="absolute inset-0 m-auto h-[80%] w-[80%] object-contain mix-blend-multiply"
            />
          </div>
        </div>
      ) : (
        <>
          <LogoMark
            accent={false}
            className={`absolute -right-[12%] -top-[18%] w-[70%] opacity-[0.07] transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:rotate-45`}
          />
          {/* Sized to the cover itself, so the year fits every thumbnail size. */}
          <span className="absolute bottom-[8%] left-[7%] font-serif text-[28cqw] font-light leading-none tracking-[-0.04em]">
            {year}
          </span>
        </>
      )}
      <span className="eyebrow absolute left-[7%] top-[9%] opacity-70 @max-[12rem]:hidden">{article.category}</span>
    </div>
  )
}
