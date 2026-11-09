import { useEffect, useRef } from 'react'
import { site } from '../../data/site'
import { ease, gsap, prefersReducedMotion } from '../../lib/gsap'
import { useSmoothScroll } from '../../lib/smooth-scroll'
import { LogoMark } from '../ui/Logo'
import { TLink } from '../ui/TLink'

const links = [
  { label: 'Growth Capital', to: '/investing' },
  { label: 'Investment Criteria', to: '/investing/investment-criteria' },
  { label: 'Portfolio', to: '/investing/portfolio-companies' },
  { label: 'About Us', to: '/who-we-are/about-us' },
  { label: 'Our Team', to: '/who-we-are/our-team' },
  { label: 'News & Insights', to: '/news-insights' },
  { label: 'Contact', to: '/get-in-touch' },
]

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const smooth = useSmoothScroll()
  const returnFocus = useRef<HTMLElement | null>(null)

  // Build the timeline once; play forward to open, reverse to close.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion()
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: ease.out } })
        .set(root, { visibility: 'visible' })
        .fromTo(
          root,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: reduced ? 0.01 : 0.9, ease: ease.inOut },
        )
        .from('[data-mm-mark]', { rotate: -90, scale: 0.6, autoAlpha: 0, duration: reduced ? 0.01 : 1.2 }, reduced ? 0 : 0.35)
        .from('[data-mm-link]', { yPercent: 140, duration: reduced ? 0.01 : 1, stagger: reduced ? 0 : 0.055 }, reduced ? 0 : 0.4)
        .from('[data-mm-meta]', { autoAlpha: 0, y: 12, duration: reduced ? 0.01 : 0.9, stagger: 0.06 }, reduced ? 0 : 0.7)
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const t = tl.current
    if (!root || !t) return

    if (open) {
      returnFocus.current = document.activeElement as HTMLElement
      smooth.stop()
      document.documentElement.style.overflow = 'hidden'
      t.timeScale(1).play()
      requestAnimationFrame(() => root.querySelector<HTMLElement>('a, button')?.focus())
    } else if (t.progress() > 0) {
      t.timeScale(1.6).reverse()
      t.eventCallback('onReverseComplete', () => {
        gsap.set(root, { visibility: 'hidden' })
      })
      document.documentElement.style.overflow = ''
      smooth.start()
      returnFocus.current?.focus?.()
    }
  }, [open, smooth])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && rootRef.current) {
        const focusables = rootRef.current.querySelectorAll<HTMLElement>('a[href], button')
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      ref={rootRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className="grain fixed inset-0 z-[65] flex flex-col overflow-y-auto bg-ink text-ivory lg:hidden"
      style={{ visibility: 'hidden' }}
      data-lenis-prevent
    >
      <div className="container-x flex min-h-full flex-1 flex-col pb-10 pt-28">
        <div data-mm-mark className="pointer-events-none absolute -right-16 top-24 w-64 text-ivory/[0.04]" aria-hidden="true">
          <LogoMark accent={false} />
        </div>

        <nav aria-label="Mobile">
          <ul className="flex flex-col">
            {links.map((l, i) => (
              <li key={l.to} className="border-b border-ivory/10">
                <span className="text-mask block">
                  <span data-mm-link className="block">
                    <TLink
                      to={l.to}
                      onClick={onClose}
                      tabIndex={open ? 0 : -1}
                      className="flex items-baseline justify-between gap-4 py-3.5 font-serif text-[clamp(1.9rem,8vw,3.2rem)] font-light leading-none tracking-[-0.02em] transition-colors hover:text-sky"
                    >
                      {l.label}
                      <span className="tabular font-sans text-[0.7rem] font-semibold tracking-[0.2em] text-ivory/40">
                        0{i + 1}
                      </span>
                    </TLink>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto grid gap-8 pt-12 text-sm sm:grid-cols-2">
          <div data-mm-meta>
            <p className="eyebrow mb-3 text-ivory/45">Milwaukee</p>
            <p className="text-ivory/80">
              {site.contact.street}
              <br />
              {site.contact.city}
            </p>
          </div>
          <div data-mm-meta>
            <p className="eyebrow mb-3 text-ivory/45">Contact</p>
            <p className="flex flex-col gap-1 text-ivory/80">
              <a tabIndex={open ? 0 : -1} className="u-link w-fit" href={site.contact.phoneHref}>
                {site.contact.phone}
              </a>
              <a tabIndex={open ? 0 : -1} className="u-link w-fit" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </p>
          </div>
          <p data-mm-meta className="text-xs leading-relaxed text-ivory/50 sm:col-span-2">
            Subordinated debt and equity for established, owner-led companies across the Great Lakes.
          </p>
        </div>
      </div>
    </div>
  )
}
