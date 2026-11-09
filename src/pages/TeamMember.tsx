import { ArrowLeft, ArrowRight, Mail, Phone } from 'lucide-react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Page } from '../components/layout/Page'
import { Reveal } from '../components/motion/Reveal'
import { SplitHeading } from '../components/motion/SplitHeading'
import { ClosingCta } from '../components/sections/ClosingCta'
import { Img } from '../components/ui/Img'
import { TLink } from '../components/ui/TLink'
import { getMember, team } from '../data/team'
import { ease, gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { whenIntroDone } from '../lib/intro'
import NotFound from './NotFound'

export default function TeamMember() {
  const { slug = '' } = useParams()
  const member = getMember(slug)
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      if (!member || prefersReducedMotion()) return
      gsap.set('[data-tm-frame]', { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set('[data-tm-fade]', { autoAlpha: 0, y: 16 })
      return whenIntroDone(
        contextSafe!(() => {
          gsap
            .timeline({ defaults: { ease: ease.out }, delay: 0.25 })
            .to('[data-tm-frame]', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' })
            .from('[data-tm-frame] img', { scale: 1.3, duration: 2 }, '<')
            .to('[data-tm-fade]', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.5)
        }),
      )
    },
    { scope: ref, dependencies: [slug] },
  )

  if (!member) return <NotFound />

  const i = team.indexOf(member)
  const prev = team[(i - 1 + team.length) % team.length]
  const next = team[(i + 1) % team.length]
  const [first, ...rest] = member.bio

  return (
    <Page title={`${member.name}, ${member.title}`} description={first.slice(0, 155)}>
      <article ref={ref} data-header="light" className="on-light bg-ivory text-ink">
        <div className="container-x pb-24 pt-40 sm:pt-48 lg:pb-36">
          <nav aria-label="Breadcrumb" data-tm-fade className="mb-12">
            <ol className="eyebrow flex flex-wrap items-center gap-3 text-slate">
              <li>
                <TLink to="/who-we-are/about-us" className="u-link hover:text-ink">
                  Who We Are
                </TLink>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <TLink to="/who-we-are/our-team" className="u-link hover:text-ink">
                  Our Team
                </TLink>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-teal">
                {member.name}
              </li>
            </ol>
          </nav>

          <div className="grid-12 gap-y-14">
            <div className="col-span-12 sm:col-span-8 md:col-span-5">
              <div className="md:sticky md:top-32">
                <div data-tm-frame className="relative aspect-[4/5] overflow-hidden bg-stone">
                  <Img
                    base={member.image}
                    widths={[480, 960]}
                    sizes="(min-width: 768px) 40vw, 80vw"
                    alt={`Portrait of ${member.name}`}
                    priority
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                </div>
                <ul data-tm-fade className="mt-6 divide-y divide-ink/10 border-y hairline text-sm">
                  <li>
                    <a href={`mailto:${member.email}`} className="group flex items-center gap-4 py-3.5">
                      <Mail className="size-4 text-teal" strokeWidth={1.6} aria-hidden="true" />
                      <span className="u-link break-all">{member.email}</span>
                    </a>
                  </li>
                  {member.phone && (
                    <li>
                      <a href={`tel:+1${member.phone.replace(/\D/g, '')}`} className="group flex items-center gap-4 py-3.5">
                        <Phone className="size-4 text-teal" strokeWidth={1.6} aria-hidden="true" />
                        <span className="u-link">{member.phone}</span>
                      </a>
                    </li>
                  )}
                  {member.linkedin && (
                    <li>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 py-3.5"
                      >
                        <LinkedInGlyph />
                        <span className="u-link">LinkedIn</span>
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <p data-tm-fade className="eyebrow text-teal">
                {member.title}
              </p>
              <SplitHeading as="h1" trigger="intro" delay={0.3} className="display-xl mt-6">
                {member.name}
              </SplitHeading>

              <p data-tm-fade className="lede mt-12 text-ink/85">
                {first}
              </p>
              <Reveal variant="fade" className="mt-8 space-y-6">
                {rest.map((p) => (
                  <p key={p.slice(0, 32)} className="body-copy text-ink/75">
                    {p}
                  </p>
                ))}
              </Reveal>

              {(member.education.length > 0 || member.credentials.length > 0) && (
                <Reveal variant="rise" className="mt-16 grid gap-10 border-t hairline pt-10 sm:grid-cols-2">
                  {member.education.length > 0 && (
                    <div>
                      <h2 className="eyebrow text-slate">Education</h2>
                      <ul className="mt-5 space-y-3">
                        {member.education.map((e) => (
                          <li key={e} className="font-serif text-lg leading-snug">
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {member.credentials.length > 0 && (
                    <div>
                      <h2 className="eyebrow text-slate">Professional credentials</h2>
                      <ul className="mt-5 space-y-3">
                        {member.credentials.map((c) => (
                          <li key={c} className="font-serif text-lg leading-snug">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </article>

      <nav aria-label="More team members" data-header="light" className="on-light border-t hairline bg-paper text-ink">
        <div className="container-x grid sm:grid-cols-2">
          <TLink to={`/who-we-are/our-team/${prev.slug}`} className="group flex items-center gap-5 py-10 sm:pr-10">
            <ArrowLeft
              className="size-5 shrink-0 transition-transform group-hover:-translate-x-1"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span>
              <span className="eyebrow text-slate">Previous</span>
              <span className="mt-2 block font-serif text-2xl font-light">
                <span className="u-link">{prev.name}</span>
              </span>
            </span>
          </TLink>
          <TLink
            to={`/who-we-are/our-team/${next.slug}`}
            className="group flex items-center justify-end gap-5 border-t hairline py-10 text-right sm:border-l sm:border-t-0 sm:pl-10"
          >
            <span>
              <span className="eyebrow text-slate">Next</span>
              <span className="mt-2 block font-serif text-2xl font-light">
                <span className="u-link">{next.name}</span>
              </span>
            </span>
            <ArrowRight
              className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </TLink>
        </div>
      </nav>

      <ClosingCta />
    </Page>
  )
}

function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 text-teal" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm7 0h3.8v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75v5.7h-4v-5.05c0-1.2-.02-2.75-1.7-2.75-1.7 0-1.95 1.3-1.95 2.65v5.15H10v-11Z" />
    </svg>
  )
}
