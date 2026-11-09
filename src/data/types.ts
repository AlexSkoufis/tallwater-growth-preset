export type FundName = 'Tallwater Growth Fund II' | 'Tallwater Growth Fund I' | 'Earlier Vehicles'

export type CompanyStatus = 'Active' | 'Exited'

export interface PortfolioCompany {
  slug: string
  name: string
  fund: FundName
  status: CompanyStatus
  /** Short sector label shown in lists and filters. */
  sector: string
  description: string
  /** Square logo plate (480 × 480 WebP on white). */
  logo: string
  website?: string
  /** Optional facts shown on the company profile. */
  location?: string
  founded?: string
  featured?: boolean
}

export type TeamGroup = 'Partners' | 'Investment Team' | 'Operations'

export interface TeamMember {
  slug: string
  name: string
  title: string
  group: TeamGroup
  image: string
  email: string
  phone?: string
  linkedin?: string
  bio: string[]
  education: string[]
  credentials: string[]
}

export interface BoardMember {
  name: string
  image: string
}

export type NewsCategory = 'Firm News' | 'Transaction' | 'Insight' | 'Industry Update' | 'Portfolio Update'

export interface Article {
  slug: string
  title: string
  /** ISO date. */
  date: string
  category: NewsCategory
  /** Older material kept for reference; shown with an Archive label. */
  archive?: boolean
  excerpt: string
  /** Paragraphs. Inline links use [label](href). */
  body: string[]
  pdf?: string
  relatedCompany?: string
  featured?: boolean
}

export interface CriteriaGroup {
  id: string
  index: string
  title: string
  summary: string
  items: { label: string; note?: string }[]
}
