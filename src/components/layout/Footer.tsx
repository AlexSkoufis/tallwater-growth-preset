import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { site } from '../../data/site'
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap'
import { LogoMark, Wordmark } from '../ui/Logo'
import { TLink } from '../ui/TLink'

const columns = [
  {
    title: 'Investing',
    links: [
      { label: 'Growth Capital', to: '/investing' },
      { label: 'Investment Criteria', to: '/investing/investment-criteria' },
      { label: 'Portfolio Companies', to: '/investing/portfolio-companies' },
    ],
  },
  {
    title: 'Who We Are',
    links: [
      { label: 'About Us', to: '/who-we-are/about-us' },
      { label: 'Our Team', to: '/who-we-are/our-team' },
      { label: 'News & Insights', to: '/news-insights' },
      { label: 'Contact', to: '/get-in-touch' },
    ],
  },
]

export function Footer() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-footer-mark]', {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
      })
    },
    { scope: ref },
  )

  return (
    <footer ref={ref} data-header="dark" className="grain relative overflow-hidden bg-ink text-ivory">
      <div className="container-x relative pt-24 sm:pt-32">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <LogoMark className="mb-8 h-10 w-auto" />
            <p className="display-s max-w-md text-ivory/90">
              Patient growth capital for established, owner-led companies across the Great Lakes.
            </p>
            <a
              href={site.overviewPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky"
            >
              <span className="u-link-static">Download the Tallwater fund overview</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="col-span-6 sm:col-span-4 lg:col-span-2">
              <h2 className="eyebrow mb-6 text-ivory/45">{col.title}</h2>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <TLink to={l.to} className="u-link text-[0.95rem] text-ivory/85 hover:text-ivory">
                      {l.label}
                    </TLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-12 sm:col-span-4 lg:col-span-3">
            <h2 className="eyebrow mb-6 text-ivory/45">Milwaukee</h2>
            <address className="space-y-4 text-[0.95rem] not-italic leading-relaxed text-ivory/85">
              <p>
                {site.contact.street}
                <br />
                {site.contact.city}
              </p>
              <p className="flex flex-col gap-1.5">
                <a className="u-link w-fit" href={site.contact.phoneHref}>
                  {site.contact.phone}
                </a>
                <a className="u-link w-fit break-all" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              </p>
              <a
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-sky"
                href={site.contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="u-link-static">Get directions</span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </address>
          </div>
        </div>

        <div className="mt-20 grid gap-4 border-t border-ivory/12 py-8 text-sm text-ivory/65 md:grid-cols-[1fr_auto] md:items-center">
          <p className="max-w-2xl leading-relaxed">
            Tallwater Growth Partners invests subordinated debt and equity in lower middle market companies. Nothing on this
            site is an offer to sell or a solicitation to buy any security.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <TLink to={`/news-insights/${site.announcement.articleSlug}`} className="u-link-static text-ivory">
              Fund II news
            </TLink>
            <TLink to="/get-in-touch" className="u-link-static text-ivory">
              Contact us
            </TLink>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative h-[clamp(5rem,17vw,17rem)] overflow-hidden" aria-hidden="true">
        <div data-footer-mark className="container-x absolute inset-x-0 top-0 text-ivory/[0.06]">
          <Wordmark className="h-auto w-full" />
        </div>
      </div>

      <div className="relative border-t border-ivory/12 bg-ink">
        <div className="container-x flex flex-col gap-4 py-7 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Tallwater Growth Partners. All rights reserved.</p>
          <p className="md:text-center">Past performance is not indicative of future results.</p>
          <TLink to="/get-in-touch" className="group inline-flex items-center gap-2 font-semibold text-ivory">
            <span className="u-link-static">Start a conversation</span>
            <ArrowUpRight
              className="size-3.5 text-sky transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </TLink>
        </div>
      </div>
    </footer>
  )
}
