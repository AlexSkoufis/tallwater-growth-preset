import type { PortfolioCompany } from '../../data/types'

interface Props {
  company: PortfolioCompany
  className?: string
  imgClassName?: string
  priority?: boolean
}

/**
 * Official portfolio logos are supplied as square plates on white. Rather
 * than fight that, we present them as mounted prints: a paper mat with a
 * hairline frame, which keeps every brand legible and the grid consistent.
 */
export function CompanyPlate({ company, className = '', imgClassName = '', priority }: Props) {
  return (
    <div className={`relative overflow-hidden bg-paper ${className}`}>
      <img
        src={company.logo}
        alt={`${company.name} logo`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        width={480}
        height={480}
        className={`absolute inset-0 m-auto h-[78%] w-[78%] object-contain mix-blend-multiply ${imgClassName}`}
      />
      <span className="pointer-events-none absolute inset-3 border border-ink/[0.06]" aria-hidden="true" />
    </div>
  )
}
