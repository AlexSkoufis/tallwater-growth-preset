import { Page } from '../components/layout/Page'
import { Reveal } from '../components/motion/Reveal'
import { SplitHeading } from '../components/motion/SplitHeading'
import { ClosingCta } from '../components/sections/ClosingCta'
import { CriteriaExplorer } from '../components/sections/CriteriaExplorer'
import { PageHero } from '../components/sections/PageHero'
import { Eyebrow } from '../components/ui/Eyebrow'

const partners = [
  {
    title: 'Who we partner with',
    text: 'Owners, leadership teams and independent sponsors with a record of performance, a plan they believe in and the people to deliver it.',
  },
  {
    title: 'What we bring',
    text: 'Capital shaped to the plan, plus introductions, board experience and a team that has been through growth, acquisitions and handovers many times.',
  },
  {
    title: 'How we work',
    text: 'A partner on every deal from first call to exit, quick and candid answers, and monthly check-ins that focus on what management needs from us.',
  },
]

export default function Criteria() {
  return (
    <Page
      title="Investment Criteria"
      description="Tallwater Growth Fund II investment criteria: company profile, the situations we back and the capital we provide."
    >
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Investing', to: '/investing' }, { label: 'Investment Criteria' }]}
        eyebrow="Investment criteria"
        title="Clear criteria. Flexible structures."
        intro={
          <p>
            We back profitable, established companies with strong teams and a credible plan for the next five years.
          </p>
        }
        image={{
          base: '/media/hero/criteria',
          alt: 'Colleagues talking around a table in a bright meeting room',
          position: '50% 60%',
        }}
      />

      <CriteriaExplorer index="01" title="The guidelines behind every investment." />

      <section data-header="dark" className="grain section-y bg-ink text-ivory">
        <div className="container-x">
          <Eyebrow index="02" tone="light" className="text-sky">
            Partnership approach
          </Eyebrow>
          <SplitHeading className="display-l mt-8 max-w-[18ch]">How a partnership with Tallwater works.</SplitHeading>
          <Reveal variant="stagger" as="ol" className="mt-16 grid gap-px bg-ivory/12 md:grid-cols-3">
            {partners.map((p, i) => (
              <li key={p.title} className="bg-ink py-10 md:px-8 md:first:pl-0">
                <p className="tabular text-xs font-semibold text-sky">0{i + 1}</p>
                <h3 className="mt-6 font-serif text-3xl font-light">{p.title}</h3>
                <p className="body-copy mt-5 text-ivory/70">{p.text}</p>
              </li>
            ))}
          </Reveal>

          <Reveal variant="rise" as="figure" className="mt-24 max-w-4xl border-l border-sky/50 pl-8 lg:mt-32">
            <blockquote className="statement">
              “The best deals we have done started as a conversation with no deal in it. Call us early. We would rather help you
              think than wait for a finished book.”
            </blockquote>
            <figcaption className="mt-8 text-sm text-ivory/60">
              Daniel Okafor, Partner at Tallwater Growth Partners
            </figcaption>
          </Reveal>
        </div>
      </section>

      <ClosingCta title="Is your company a fit? Let’s talk." />
    </Page>
  )
}
