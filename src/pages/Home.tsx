import { Experience } from '../components/home/Experience'
import { FeaturedPortfolio } from '../components/home/FeaturedPortfolio'
import { Hero } from '../components/home/Hero'
import { NewsSection } from '../components/home/NewsSection'
import { People } from '../components/home/People'
import { Philosophy } from '../components/home/Philosophy'
import { Solutions } from '../components/home/Solutions'
import { Page } from '../components/layout/Page'
import { ClosingCta } from '../components/sections/ClosingCta'
import { CriteriaExplorer } from '../components/sections/CriteriaExplorer'
import { site } from '../data/site'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  email: site.contact.email,
  telephone: '+1-414-555-0142',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '220 Harbor View Drive, Suite 400',
    addressLocality: 'Milwaukee',
    addressRegion: 'WI',
    postalCode: '53202',
    addressCountry: 'US',
  },
}

export default function Home() {
  return (
    <Page
      title="Tallwater Growth Partners"
      description="Tallwater Growth Partners invests subordinated debt and equity in established, owner-led companies across the Great Lakes to fund growth, succession and recapitalizations."
      schema={schema}
    >
      <Hero />
      <Philosophy />
      <Solutions />
      <CriteriaExplorer index="03" />
      <FeaturedPortfolio />
      <People />
      <Experience />
      <NewsSection />
      <ClosingCta />
    </Page>
  )
}
