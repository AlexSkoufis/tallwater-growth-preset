import type { CriteriaGroup } from './types'

/** Investment criteria for Tallwater Growth Fund II (demo content). */
export const criteria: CriteriaGroup[] = [
  {
    id: 'target-profile',
    index: '01',
    title: 'Company Profile',
    summary:
      'Established, profitable businesses with durable customer relationships, a capable leadership bench and room to grow.',
    items: [
      { label: '$2 million+ EBITDA' },
      { label: 'Healthy, defensible margins' },
      { label: 'Repeat or recurring revenue' },
      { label: 'Clear path to growth' },
      { label: 'Headquartered in the Great Lakes states' },
    ],
  },
  {
    id: 'transaction-types',
    index: '02',
    title: 'Situations We Back',
    summary:
      'From a first acquisition to a founder’s retirement, we fund the moments when a company’s ownership or ambitions change.',
    items: [
      { label: 'Organic and acquisitive growth' },
      { label: 'Ownership transitions' },
      { label: 'Recapitalizations' },
      { label: 'Management buyouts' },
      { label: 'Independent sponsor transactions' },
    ],
  },
  {
    id: 'capital-delivered',
    index: '03',
    title: 'Capital We Provide',
    summary: 'Subordinated debt, equity or both, sized and structured around the plan rather than a template.',
    items: [
      { label: '$3 million to $10 million per company' },
      { label: 'Subordinated debt and equity' },
      { label: 'Minority or control positions' },
      { label: 'Patient, flexible terms' },
    ],
  },
]

/** The three situations the fund is built for. */
export const solutions = [
  {
    id: 'growth',
    index: '01',
    title: 'Growth',
    kicker: 'Build the next chapter',
    body: 'Funding for a new plant, a new region or the acquisition that doubles your reach, paired with partners who have helped companies scale before.',
    image: '/media/hero/investing',
  },
  {
    id: 'succession',
    index: '02',
    title: 'Succession',
    kicker: 'Hand over with confidence',
    body: 'A way for founders to take chips off the table or step back, while the team that grew the business keeps running it and keeps its character.',
    image: '/media/hero/about',
  },
  {
    id: 'recapitalization',
    index: '03',
    title: 'Recapitalization',
    kicker: 'Reset the balance sheet',
    body: 'A capital structure rebuilt around your objectives, with subordinated debt and equity in whatever proportion the plan calls for.',
    image: '/media/hero/team',
  },
] as const
