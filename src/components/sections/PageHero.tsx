import { useRef, type ReactNode } from 'react'
import { ease, gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap'
import { whenIntroDone } from '../../lib/intro'
import { SplitHeading } from '../motion/SplitHeading'
import { Img } from '../ui/Img'
import { TLink } from '../ui/TLink'

interface Crumb {
  label: string
  to?: string
}

interface Props {
  title: ReactNode
  eyebrow?: string
  intro?: ReactNode
  crumbs?: Crumb[]
  tone?: 'dark' | 'light'
  image?: { base: string; alt: string; position?: string }
  aside?: ReactNode
  children?: ReactNode
}

/**
 * Inner-page opener. Title lines rise on load; an optional photograph
 * band opens from a centred slit and then parallaxes as the page scrolls.
 */
export function PageHero({ title, eyebrow, intro, crumbs, tone = 'dark', image, aside, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const dark = tone === 'dark'

  useGSAP(
    (_ctx, contextSafe) => {
      if (prefersReducedMotion()) return
      gsap.set('[data-ph-fade]', { autoAlpha: 0, y: 14 })
      if (image) {
        gsap.set('[data-ph-band]', { clipPath: 'inset(0% 50% 0% 50%)' })
        gsap.set('[data-ph-band] img', { scale: 1.3 })
      }
      const cancel = whenIntroDone(
        contextSafe!(() => {
          const tl = gsap.timeline({ defaults: { ease: ease.out }, delay: 0.25 })
          tl.to('[data-ph-fade]', { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.3)
          if (image) {
            tl.to('[data-ph-band]', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' }, 0.2).to(
              '[data-ph-band] img',
              { scale: 1.1, duration: 2.4 },
              0.3,
            )
          }
        }),
      )
      if (image) {
        gsap.to('[data-ph-band] img', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: '[data-ph-band]', start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
      return cancel
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-header={tone}
      className={`relative ${dark ? 'grain bg-ink text-ivory' : 'on-light bg-ivory text-ink'}`}
    >
      <div className={`container-x pt-40 sm:pt-48 ${image ? 'pb-14 sm:pb-20' : 'pb-20 sm:pb-28'}`}>
        {crumbs && (
          <nav aria-label="Breadcrumb" data-ph-fade className="mb-10">
            <ol className={`eyebrow flex flex-wrap items-center gap-3 ${dark ? 'text-ivory/50' : 'text-slate'}`}>
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-3">
                  {c.to ? (
                    <TLink to={c.to} className={`u-link ${dark ? 'hover:text-ivory' : 'hover:text-ink'}`}>
                      {c.label}
                    </TLink>
                  ) : (
                    <span aria-current="page" className={dark ? 'text-sky' : 'text-teal'}>
                      {c.label}
                    </span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="grid-12 items-end gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            {eyebrow && (
              <p data-ph-fade className={`eyebrow mb-8 ${dark ? 'text-sky' : 'text-teal'}`}>
                {eyebrow}
              </p>
            )}
            <SplitHeading as="h1" trigger="intro" delay={0.2} className="display-xl max-w-[16ch]">
              {title}
            </SplitHeading>
          </div>
          {(intro || aside) && (
            <div data-ph-fade className="col-span-12 lg:col-span-4 lg:pb-2">
              {intro && <div className={`lede ${dark ? 'text-ivory/75' : 'text-ink/70'}`}>{intro}</div>}
              {aside}
            </div>
          )}
        </div>
        {children}
      </div>

      {image && (
        <div className="container-x pb-6">
          <div data-ph-band className="relative h-[42vh] overflow-hidden sm:h-[56vh]">
            <Img
              base={image.base}
              alt={image.alt}
              priority
              sizes="100vw"
              className={`absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover ${dark ? 'grade-dark' : ''}`}
              style={{ objectPosition: image.position ?? '50% 50%' }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
