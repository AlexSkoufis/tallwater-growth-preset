import { FeaturedPortfolio } from '../components/home/FeaturedPortfolio'
import { Solutions } from '../components/home/Solutions'
import { Page } from '../components/layout/Page'
import { Reveal } from '../components/motion/Reveal'
import { SplitHeading } from '../components/motion/SplitHeading'
import { ClosingCta } from '../components/sections/ClosingCta'
import { PageHero } from '../components/sections/PageHero'
import { ArrowLink, Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'
import { criteria } from '../data/criteria'
import { site } from '../data/site'

export default function Investing() {
  return (
    <Page
      title="Growth Capital Investing"
      description="Tallwater Growth Partners invests $3 million to $10 million of subordinated debt and equity in established Great Lakes companies."
    >
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Investing' }]}
        eyebrow="Tallwater Growth Capital"
        title="Growth capital for the companies that keep the Great Lakes working."
        intro={
          <p>
            Subordinated debt and equity, from $3 million to $10 million, for owner-led companies that are ready for their next
            chapter.
          </p>
        }
        aside={
          <div className="mt-8">
            <Button to={site.overviewPdf} variant="ghost-light" external>
              Download fund overview
            </Button>
          </div>
        }
        image={{ base: '/media/hero/investing', alt: 'A team gathered around a table in a bright office', position: '50% 35%' }}
      />

      {/* Partnership statement */}
      <section data-header="light" className="on-light section-y bg-ivory text-ink">
        <div className="container-x grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <Eyebrow index="01" className="text-teal">
              Partnership
            </Eyebrow>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <SplitHeading className="statement">
              We are not the largest check you will be offered. We aim to be the partner you are still glad you chose five years
              later.
            </SplitHeading>
            <Reveal variant="fade" className="mt-12 grid gap-8 md:grid-cols-2">
              <p className="body-copy text-ink/70">
                Our capital sits between senior debt and common equity, which means less dilution for owners than a traditional
                equity deal and more flexibility than a bank loan.
              </p>
              <p className="body-copy text-ink/70">
                We size every investment around what the company can carry comfortably, and we build in room for the plan to
                take longer than anyone expects.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Solutions index="02" />

      {/* Criteria at a glance */}
      <section data-header="light" className="on-light section-y bg-paper text-ink">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Eyebrow index="03" className="text-teal">
                Criteria at a glance
              </Eyebrow>
              <SplitHeading className="display-l mt-8 max-w-[16ch]">What we look for, in short.</SplitHeading>
            </div>
            <ArrowLink to="/investing/investment-criteria" className="text-teal">
              Full investment criteria
            </ArrowLink>
          </div>

          <Reveal variant="stagger" className="mt-16 grid border-t hairline md:grid-cols-3">
            {criteria.map((c) => (
              <div
                key={c.id}
                className="border-b hairline py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
              >
                <p className="eyebrow flex gap-3 text-slate">
                  <span className="text-teal">{c.index}</span>
                  {c.title}
                </p>
                <ul className="mt-8 space-y-3">
                  {c.items.map((it) => (
                    <li key={it.label} className="font-serif text-[1.45rem] font-light leading-snug tracking-[-0.01em]">
                      {it.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Fund II */}
      <section data-header="dark" className="grain section-y relative bg-teal text-ivory">
        <div className="container-x grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-6">
            <Eyebrow index="04" tone="light" className="text-sky">
              Tallwater Growth Fund II
            </Eyebrow>
            <p className="mt-10 font-serif text-[clamp(4.5rem,13vw,12rem)] font-light leading-[0.85] tracking-[-0.05em]">$140M</p>
            <p className="body-copy mt-8 max-w-md text-ivory/75">
              Final close announced March 2025, above the $120 million target, with commitments from returning Fund I
              investors, family offices and regional business owners.
            </p>
          </div>
          <div className="col-span-12 flex flex-col justify-end lg:col-span-5 lg:col-start-8">
            <Reveal variant="rise" as="figure">
              <blockquote className="display-s text-ivory">
                “Our investors have backed a simple idea for almost thirty years: that the region’s family-owned businesses deserve a
                patient, practical partner.”
              </blockquote>
              <figcaption className="mt-6 text-sm text-ivory/65">Margaret Holloway, Managing Partner</figcaption>
            </Reveal>
            <div className="mt-10">
              <ArrowLink to={`/news-insights/${site.announcement.articleSlug}`} className="text-sky">
                Read the announcement
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <FeaturedPortfolio index="05" />
      <ClosingCta />
    </Page>
  )
}
