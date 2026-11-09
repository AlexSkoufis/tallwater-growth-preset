import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { site } from '../../data/site'
import { ease, gsap, prefersReducedMotion, SplitText, useGSAP } from '../../lib/gsap'
import { whenIntroDone } from '../../lib/intro'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'
import { TLink } from '../ui/TLink'

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const root = ref.current
      if (!root || prefersReducedMotion()) return

      const headline = root.querySelector<HTMLElement>('[data-hero-title]')!
      const split = SplitText.create(headline, { type: 'lines,words', mask: 'lines', linesClass: 'split-line' })

      // Hold everything in its pre-entrance state until the intro lifts.
      gsap.set(split.lines, { yPercent: 0 })
      gsap.set(split.words, { yPercent: 140 })
      gsap.set('[data-hero-frame]', { clipPath: 'inset(46% 49% 46% 49%)' })
      gsap.set('[data-hero-img]', { scale: 1.45 })
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 16 })
      gsap.set('[data-hero-rule]', { scaleX: 0 })

      const cancel = whenIntroDone(
        contextSafe!(() => {
          gsap
            .timeline({ defaults: { ease: ease.out } })
            .to('[data-hero-frame]', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.9, ease: 'expo.inOut' }, 0)
            .to('[data-hero-img]', { scale: 1.08, duration: 2.6, ease: 'expo.out' }, 0.2)
            .to(split.words, { yPercent: 0, duration: 1.5, stagger: 0.06, onComplete: () => split.revert() }, 0.55)
            .to('[data-hero-rule]', { scaleX: 1, duration: 1.6, ease: ease.inOut }, 0.8)
            .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 1.05)
        }),
      )

      // Scroll-driven exit: the photograph drifts and enlarges, the title lifts away faster.
      const exit = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      })
      exit
        .to('[data-hero-img]', { yPercent: 12, scale: 1.2, ease: 'none' }, 0)
        .to(headline, { yPercent: -28, ease: 'none' }, 0)
        .to('[data-hero-shade]', { opacity: 0.7, ease: 'none' }, 0)

      return () => {
        cancel()
        split.revert()
      }
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-header="dark"
      aria-labelledby="hero-title"
      className="grain relative isolate overflow-hidden bg-ink text-ivory"
    >
      <div className="guides pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="container-x relative flex min-h-[100svh] flex-col pb-8 pt-36 lg:pt-40">
        <div className="grid-12 flex-1 gap-y-10">
          {/* Lead copy */}
          <div className="col-span-12 flex flex-col justify-start md:col-span-6 lg:col-span-4">
            <p data-hero-fade className="eyebrow flex items-center gap-3 text-sky">
              <span className="inline-block size-1.5 rounded-full bg-sky" aria-hidden="true" />
              Tallwater Growth Partners
            </p>
            <p data-hero-fade className="lede mt-6 max-w-sm text-ivory/80">
              Subordinated debt and equity for established, owner-led companies across the Great Lakes, whether you are
              expanding, changing hands or resetting the balance sheet.
            </p>
            <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
              <Button to="/investing/investment-criteria" variant="sky" magnetic>
                Investment criteria
              </Button>
              <Button to="/investing/portfolio-companies" variant="ghost-light">
                Portfolio
              </Button>
            </div>
          </div>

          {/* Photograph, art directed as a cover plate */}
          <figure
            data-hero-frame
            className="relative col-span-12 aspect-[4/3] overflow-hidden md:col-span-6 md:col-start-7 md:aspect-auto md:h-[min(52vh,560px)] lg:col-span-7 lg:col-start-6"
          >
            <Img
              data-hero-img
              base="/media/hero/criteria"
              alt="Colleagues talking around a table in a bright meeting room"
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="grade-dark absolute inset-0 h-full w-full object-cover will-change-transform"
            />
            <div data-hero-shade className="absolute inset-0 bg-ink opacity-20" aria-hidden="true" />
            <figcaption
              data-hero-fade
              className="absolute bottom-4 right-4 hidden text-[0.7rem] tracking-[0.08em] text-ivory/70 md:block"
            >
              Milwaukee, Wisconsin
            </figcaption>
          </figure>
        </div>

        {/* Title */}
        <h1
          id="hero-title"
          data-hero-title
          className="relative z-10 mt-10 font-display text-[clamp(3rem,8.2vw,9.5rem)] leading-[0.94] tracking-[-0.035em] md:-mt-[5vw] lg:-mt-[6vw]"
        >
          <span className="block">Capital that stays</span>
          <span className="italic-serif block text-sky">for the long haul.</span>
        </h1>

        <div data-hero-rule className="mt-10 h-px origin-left bg-ivory/20" aria-hidden="true" />

        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p data-hero-fade className="max-w-xl text-[0.85rem] leading-relaxed text-ivory/70">
            Tallwater Growth Fund II has closed at $140 million, above its $120 million target.{' '}
            <TLink
              to={`/news-insights/${site.announcement.articleSlug}`}
              className="group inline-flex items-center gap-1 font-semibold text-ivory"
            >
              <span className="u-link-static">Read the news</span>
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </TLink>
          </p>
          <p data-hero-fade className="eyebrow hidden items-center gap-3 text-ivory/55 md:flex">
            Scroll
            <span className="relative block h-9 w-px overflow-hidden bg-ivory/15" aria-hidden="true">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(.76,0,.24,1)_infinite] bg-sky" />
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
