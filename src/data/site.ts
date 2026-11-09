/**
 * Firm details. Everything here is fictional demo content: replace it with
 * your own name, address and links. `overviewPdf` can point at any PDF you
 * host; the placeholder file lives in public/media/docs.
 */
export const site = {
  name: 'Tallwater Growth Partners',
  fund: 'Tallwater Growth Capital',
  overviewPdf: '/media/docs/tallwater-overview.pdf',
  contact: {
    email: 'hello@tallwater.example',
    phone: '414.555.0142',
    phoneHref: 'tel:+14145550142',
    street: '220 Harbor View Drive, Suite 400',
    city: 'Milwaukee, WI 53202',
    mapUrl: 'https://www.openstreetmap.org/#map=15/43.0389/-87.9065',
  },
  announcement: {
    articleSlug: 'tallwater-growth-fund-ii-final-close',
  },
} as const

export interface NavItem {
  label: string
  to: string
  description?: string
  children?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    label: 'Investing',
    to: '/investing',
    children: [
      { label: 'Growth Capital', to: '/investing', description: 'Flexible capital for expansion, ownership change and recaps.' },
      {
        label: 'Investment Criteria',
        to: '/investing/investment-criteria',
        description: 'Who we back, the deals we do and the checks we write.',
      },
      {
        label: 'Portfolio Companies',
        to: '/investing/portfolio-companies',
        description: 'Every business we have backed, current and realised.',
      },
    ],
  },
  {
    label: 'Who We Are',
    to: '/who-we-are/about-us',
    children: [
      { label: 'About Us', to: '/who-we-are/about-us', description: 'Our story, our principles and our home port.' },
      { label: 'Our Team', to: '/who-we-are/our-team', description: 'Partners, investors, operators and our board.' },
    ],
  },
  { label: 'News & Insights', to: '/news-insights' },
  { label: 'Contact', to: '/get-in-touch' },
]
