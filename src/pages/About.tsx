import { ArrowUpRight } from 'lucide-react'
import { Page } from '../components/layout/Page'
import { Reveal } from '../components/motion/Reveal'
import { SplitHeading } from '../components/motion/SplitHeading'
import { ClosingCta } from '../components/sections/ClosingCta'
import { PageHero } from '../components/sections/PageHero'
import { ArticleCard } from '../components/ui/ArticleCard'
import { ArrowLink, Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Img } from '../components/ui/Img'
import { LogoMark } from '../components/ui/Logo'
import { TLink } from '../components/ui/TLink'
import { articles } from '../data/news'
import { site } from '../data/site'

const values = [
  { word: 'Candor', line: 'Straight answers early, including when the answer is no.' },
  { word: 'Patience', line: 'Holding periods set by the plan, not by the calendar of a fund.' },
  { word: 'Practicality', line: 'Advice from people who have run plants, books and integrations.' },
  { word: 'Shared upside', line: 'Structures that keep owners and managers invested in what comes next.' },
]

const latest = articles.filter((a) => !a.archive).slice(0, 3)

export default function About() {
  return (
    <Page
      title="About Us"
      description="Tallwater Growth Partners backs established, owner-led companies across the Great Lakes with subordinated debt, equity and practical support."
    >
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Who We Are' }, { label: 'About Us' }]}
        eyebrow="About us"
        title="Investors who have done the work."
        intro={<p>Since 1996 we have helped owner-led companies grow, change hands and build something that lasts.</p>}
        image={{
          base: '/media/hero/about',
          alt: 'Two colleagues reviewing plans together at a desk',
          position: '45% 50%',
        }}
      />

      <section data-header="light" className="on-light section-y bg-ivory text-ink">
        <div className="container-x grid-12 gap-y-12">
          <div className="col-span-12 lg:col-span-3">
            <Eyebrow index="01" className="text-teal">
              Who we are
            </Eyebrow>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <SplitHeading className="statement">
              Tallwater backs established companies across the Great Lakes with capital, counsel and the patience to let a
              good plan play out.
            </SplitHeading>
            <Reveal variant="fade" className="mt-14 grid gap-8 md:grid-cols-2">
              <p className="body-copy text-ink/75">
                Our partners have been lenders, operators, controllers and acquirers before they were investors. That mix shows up
                in the boardroom as practical advice on hiring, pricing, financing and acquisitions.
              </p>
              <p className="body-copy text-ink/75">
                We prefer structures that keep founders and managers invested in the upside, and we say no early when we are not
                the right fit. Owners tell us that honesty is the main reason they call us back.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="container-x mt-24 lg:mt-36">
          <p className="eyebrow border-b hairline pb-6 text-slate">Four principles we have kept since 1996</p>
          <Reveal as="ul" variant="stagger" className="grid sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li
                key={v.word}
                className="group border-b hairline py-10 sm:pr-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
              >
                <p className="tabular text-xs font-semibold text-teal">0{i + 1}</p>
                <p className="mt-6 font-serif text-[clamp(2rem,3vw,2.8rem)] font-light leading-none tracking-[-0.02em]">
                  {v.word}
                </p>
                <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-ink/65">{v.line}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Culture */}
      <section data-header="dark" className="grain section-y relative overflow-hidden bg-ink text-ivory">
        <div className="container-x grid-12 items-center gap-y-14">
          <Reveal variant="clip-x" className="relative col-span-12 aspect-[16/11] overflow-hidden lg:col-span-6">
            <Img
              base="/media/hero/team"
              alt="Colleagues in a working session around a laptop"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="grade-dark absolute inset-0 h-full w-full object-cover object-[70%_50%]"
            />
          </Reveal>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <Eyebrow index="02" tone="light" className="text-sky">
              Culture
            </Eyebrow>
            <SplitHeading className="display-m mt-8">Small team, open doors, long memories.</SplitHeading>
            <Reveal variant="fade">
              <p className="body-copy mt-8 text-ivory/75">
                There are no layers at Tallwater. Analysts sit in on board meetings, partners take first calls, and everyone
                knows every company in the portfolio by name. Most of our team has been here for more than a decade, and so have
                many of our investors.
              </p>
            </Reveal>
            <div className="mt-10 flex items-baseline gap-5 border-t border-ivory/15 pt-8">
              <p className="font-serif text-7xl font-light leading-none tracking-[-0.04em] text-sky">12</p>
              <p className="max-w-[14rem] text-sm leading-relaxed text-ivory/70">
                years average tenure across the Tallwater team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section data-header="light" className="on-light section-y bg-paper text-ink">
        <div className="container-x grid-12 items-end gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow index="03" className="text-teal">
              Beyond investing
            </Eyebrow>
            <SplitHeading className="display-l mt-8 max-w-[18ch]">
              We invest where we live.
            </SplitHeading>
            <Reveal variant="fade">
              <p className="body-copy mt-8 max-w-xl text-ink/75">
                Our companies employ thousands of people in towns across the region, and we take that seriously. Each year the
                Tallwater team volunteers alongside portfolio company employees, and the firm matches every charitable gift its
                people make to organizations in the communities we serve.
              </p>
            </Reveal>
            <div className="mt-8">
              <ArrowLink to="/get-in-touch" className="text-teal">
                Partner with us on a community project
              </ArrowLink>
            </div>
          </div>
          <Reveal
            variant="clip-up"
            className="relative col-span-8 col-start-3 aspect-[5/6] overflow-hidden sm:col-span-5 sm:col-start-8 lg:col-span-3 lg:col-start-10"
          >
            <Img
              base="/media/hero/harbor"
              widths={[960]}
              sizes="(min-width: 1024px) 24vw, 60vw"
              alt="A city skyline along the water at dusk"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Commitments */}
      <section data-header="dark" className="section-y relative overflow-hidden bg-teal text-ivory">
        <LogoMark accent={false} className="pointer-events-none absolute -right-24 -top-24 w-[34rem] text-ivory/[0.05]" />
        <div className="container-x grid-12 relative gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <Eyebrow index="04" tone="light" className="text-sky">
              Our commitments
            </Eyebrow>
            <SplitHeading className="display-l mt-8 max-w-[14ch]">What every owner can expect from us.</SplitHeading>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Reveal variant="fade" className="space-y-6">
              <p className="lede text-ivory/90">
                A partner at the table from the first meeting to the last, and a decision within weeks, not months.
              </p>
              <p className="body-copy text-ivory/75">
                We share our term sheet assumptions openly, we do not retrade once we have agreed a price, and we never ask a
                company to take on more debt than its plan can carry comfortably.
              </p>
              <p className="body-copy text-ivory/75">
                After we invest, we report to our investors on how the business is doing and to management on how we are doing.
                Ask any of our portfolio CEOs for a reference; we will give you their numbers.
              </p>
            </Reveal>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Button to={`/news-insights/${site.announcement.articleSlug}`} variant="sky">
                Fund II news
              </Button>
              <TLink to="/investing/portfolio-companies" className="group inline-flex items-center gap-2 text-sm font-semibold">
                <span className="u-link-static">See the portfolio</span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </TLink>
            </div>
          </div>
        </div>
      </section>

      {/* Team teaser + news */}
      <section data-header="light" className="on-light section-y bg-ivory text-ink">
        <div className="container-x grid-12 gap-y-16">
          <div className="col-span-12 lg:col-span-5">
            <Eyebrow index="05" className="text-teal">
              Our team
            </Eyebrow>
            <SplitHeading className="display-m mt-8 max-w-[16ch]">People who answer their own phones.</SplitHeading>
            <Reveal variant="fade">
              <p className="body-copy mt-8 text-ink/75">
                Three partners, an investment team and an operations group that has kept our funds running smoothly for years.
                You will know exactly who to call, and they will pick up.
              </p>
            </Reveal>
            <div className="mt-10">
              <Button to="/who-we-are/our-team" variant="ink">
                Meet our team
              </Button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <div className="flex items-end justify-between border-b hairline pb-5">
              <h2 className="eyebrow text-slate">Latest Tallwater news</h2>
              <TLink to="/news-insights" className="u-link text-sm font-semibold text-teal">
                All news
              </TLink>
            </div>
            <ul className="divide-y divide-ink/10">
              {latest.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} variant="compact" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ClosingCta />
    </Page>
  )
}
