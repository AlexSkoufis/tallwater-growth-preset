import { ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Page } from '../components/layout/Page'
import { PageHero } from '../components/sections/PageHero'
import { ClosingCta } from '../components/sections/ClosingCta'
import { CompanyPlate } from '../components/ui/CompanyPlate'
import { TLink } from '../components/ui/TLink'
import { fundShort, funds, hostname, portfolio } from '../data/portfolio'
import type { CompanyStatus, FundName, PortfolioCompany } from '../data/types'
import { Flip, gsap, prefersReducedMotion } from '../lib/gsap'
import { useSmoothScroll } from '../lib/smooth-scroll'

type StatusFilter = 'All' | CompanyStatus
type FundFilter = 'All' | FundName

const count = (fn: (c: PortfolioCompany) => boolean) => portfolio.filter(fn).length

export default function Portfolio() {
  const [status, setStatus] = useState<StatusFilter>('All')
  const [fund, setFund] = useState<FundFilter>('All')
  const [selected, setSelected] = useState<PortfolioCompany | null>(null)
  const gridRef = useRef<HTMLUListElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)

  const visible = useMemo(
    () =>
      new Set(
        portfolio
          .filter((c) => (status === 'All' || c.status === status) && (fund === 'All' || c.fund === fund))
          .map((c) => c.slug),
      ),
    [status, fund],
  )

  // Capture layout before the filter changes, then let Flip animate the reflow.
  const applyFilter = (fn: () => void) => {
    if (gridRef.current && !prefersReducedMotion()) {
      flipState.current = Flip.getState(gridRef.current.querySelectorAll('[data-card]'))
    }
    fn()
  }

  useLayoutEffect(() => {
    const state = flipState.current
    if (!state || !gridRef.current) return
    flipState.current = null
    Flip.from(state, {
      duration: 0.8,
      ease: 'power3.inOut',
      absolute: true,
      stagger: 0.015,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.7, delay: 0.2 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.4 }),
    })
  }, [visible])

  const shown = visible.size

  return (
    <Page
      title="Portfolio Companies"
      description="The companies Tallwater Growth Partners has backed across Tallwater Growth Funds I and II and earlier vehicles."
    >
      <PageHero
        tone="light"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Investing', to: '/investing' }, { label: 'Portfolio Companies' }]}
        eyebrow="Portfolio"
        title="Portfolio companies."
        intro={
          <p>
            Every company we have backed across Tallwater Growth Funds I and II, along with realized investments from our earlier
            vehicles.
          </p>
        }
      >
        <dl className="mt-16 grid grid-cols-2 gap-6 border-t hairline pt-8 sm:grid-cols-4">
          {[
            { label: 'Fund II companies', value: count((c) => c.fund === 'Tallwater Growth Fund II') },
            { label: 'Fund I companies', value: count((c) => c.fund === 'Tallwater Growth Fund I') },
            { label: 'Earlier vehicles', value: count((c) => c.fund === 'Earlier Vehicles') },
            { label: 'Active today', value: count((c) => c.status === 'Active') },
          ].map((s) => (
            <div key={s.label}>
              <dt className="eyebrow text-slate">{s.label}</dt>
              <dd className="mt-3 font-serif text-5xl font-light tracking-[-0.03em] tabular">{s.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section data-header="light" aria-label="Portfolio" className="on-light bg-ivory pb-28 text-ink sm:pb-40">
        <div className="container-x">
          {/* Filters */}
          <div className="z-30 -mx-[var(--gutter)] mb-12 lg:sticky lg:top-20 border-y hairline bg-ivory/90 px-[var(--gutter)] py-4 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <FilterGroup
                label="Status"
                options={['All', 'Active', 'Exited'] as StatusFilter[]}
                value={status}
                onChange={(v) => applyFilter(() => setStatus(v))}
              />
              <FilterGroup
                label="Fund"
                options={['All', ...funds] as FundFilter[]}
                value={fund}
                format={(v) => (v === 'All' ? 'All' : fundShort[v as FundName])}
                onChange={(v) => applyFilter(() => setFund(v))}
              />
              <p className="eyebrow text-slate" aria-live="polite">
                Showing <span className="tabular text-ink">{shown}</span> of {portfolio.length}
              </p>
            </div>
          </div>

          <ul
            ref={gridRef}
            className="grid grid-cols-2 gap-x-[clamp(0.75rem,1.6vw,1.75rem)] gap-y-12 md:grid-cols-3 xl:grid-cols-4"
          >
            {portfolio.map((c) => (
              <li key={c.slug} data-card data-flip-id={`card-${c.slug}`} className={visible.has(c.slug) ? '' : 'hidden'}>
                <button
                  type="button"
                  onClick={() => setSelected(c)}
                  data-cursor="Open"
                  className="group block w-full text-left"
                  aria-haspopup="dialog"
                >
                  <div data-flip-id={`plate-${c.slug}`} className="aspect-square overflow-hidden">
                    <CompanyPlate
                      company={c}
                      className="size-full"
                      imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-serif text-[clamp(1.1rem,1.6vw,1.45rem)] font-light leading-tight tracking-[-0.01em]">
                        <span className="u-link">{c.name}</span>
                      </h2>
                      <p className="mt-1 text-xs text-slate sm:text-sm">{c.sector}</p>
                    </div>
                  </div>
                  <p className="mt-3 flex flex-wrap gap-2">
                    <Tag tone={c.status === 'Active' ? 'teal' : 'muted'}>{c.status}</Tag>
                    <Tag tone="muted">{fundShort[c.fund]}</Tag>
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {shown === 0 && <p className="py-20 text-center text-slate">No companies match these filters.</p>}
        </div>
      </section>

      <CompanyDialog company={selected} onClose={() => setSelected(null)} />
      <ClosingCta />
    </Page>
  )
}

function Tag({ children, tone }: { children: string; tone: 'teal' | 'muted' }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2.5 text-[0.68rem] font-semibold tracking-[0.04em] ${
        tone === 'teal' ? 'bg-teal text-ivory' : 'border border-ink/15 text-ink/70'
      }`}
    >
      {children}
    </span>
  )
}

interface FilterProps<T extends string> {
  label: string
  options: T[]
  value: T
  onChange: (v: T) => void
  format?: (v: T) => string
}

function FilterGroup<T extends string>({ label, options, value, onChange, format }: FilterProps<T>) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="eyebrow float-left mr-3 text-slate">{label}</legend>
      {options.map((o) => (
        <label key={o} className="cursor-pointer">
          <input
            type="radio"
            name={label}
            value={o}
            checked={value === o}
            onChange={() => onChange(o)}
            className="peer sr-only"
          />
          <span className="inline-flex h-9 items-center rounded-full border border-ink/15 px-4 text-sm transition-colors duration-300 hover:border-ink/40 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal">
            {format ? format(o) : o}
          </span>
        </label>
      ))}
    </fieldset>
  )
}

/**
 * Detail panel. The clicked logo plate travels into the panel with Flip, so
 * the transition reads as the card opening rather than a modal appearing.
 */
function CompanyDialog({ company, onClose }: { company: PortfolioCompany | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const smooth = useSmoothScroll()
  const [shown, setShown] = useState<PortfolioCompany | null>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (!company) return
    returnFocus.current = document.activeElement as HTMLElement
    const source = document.querySelector<HTMLElement>(`[data-flip-id="plate-${company.slug}"]`)
    const state = source && !prefersReducedMotion() ? Flip.getState(source) : null
    setShown(company)
    requestAnimationFrame(() => {
      const root = ref.current
      if (!root) return
      const target = root.querySelector<HTMLElement>('[data-dialog-plate]')
      gsap.fromTo(root.querySelector('[data-dialog-scrim]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
      gsap.fromTo(
        root.querySelectorAll('[data-dialog-fade]'),
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05, delay: 0.25, ease: 'expo.out' },
      )
      if (state && target) {
        Flip.from(state, { targets: target, duration: 0.85, ease: 'expo.inOut', scale: true, absolute: true })
      }
      root.querySelector<HTMLElement>('[data-dialog-close]')?.focus()
    })
    smooth.stop()
    document.documentElement.style.overflow = 'hidden'
  }, [company, smooth])

  const close = () => {
    const root = ref.current
    if (!root || !shown) return
    const finish = () => {
      setShown(null)
      onClose()
      smooth.start()
      document.documentElement.style.overflow = ''
      returnFocus.current?.focus?.()
    }
    if (prefersReducedMotion()) return finish()
    gsap
      .timeline({ onComplete: finish })
      .to(root.querySelectorAll('[data-dialog-fade]'), { autoAlpha: 0, y: 10, duration: 0.3, stagger: 0.02 })
      .to(root.querySelector('[data-dialog-panel]'), { autoAlpha: 0, scale: 0.98, duration: 0.35 }, 0.1)
      .to(root.querySelector('[data-dialog-scrim]'), { autoAlpha: 0, duration: 0.35 }, 0.15)
  }

  useEffect(() => {
    if (!shown) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('a[href], button')
        const first = f[0]
        const last = f[f.length - 1]
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
  })

  if (!shown) return null

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-dialog-title"
    >
      <div data-dialog-scrim className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={close} aria-hidden="true" />
      <div
        data-dialog-panel
        data-lenis-prevent
        className="relative max-h-[92svh] w-full max-w-5xl overflow-y-auto bg-paper text-ink shadow-[0_60px_120px_-40px_rgb(0_0_0/0.6)] sm:mx-6"
      >
        <button
          type="button"
          data-dialog-close
          onClick={close}
          className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-ink text-ivory transition-colors hover:bg-teal"
        >
          <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only">Close</span>
        </button>
        <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div data-dialog-plate data-flip-id={`plate-${shown.slug}`} className="aspect-square md:aspect-auto md:min-h-[30rem]">
            <CompanyPlate company={shown} className="size-full" priority />
          </div>
          <div className="flex flex-col p-7 sm:p-10">
            <p data-dialog-fade className="eyebrow text-teal">
              {shown.sector}
            </p>
            <h2 id="company-dialog-title" data-dialog-fade className="display-m mt-4 pr-10">
              {shown.name}
            </h2>
            <p data-dialog-fade className="body-copy mt-6 text-ink/75">
              {shown.description}
            </p>
            <dl data-dialog-fade className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t hairline pt-6 text-sm">
              <div>
                <dt className="eyebrow text-slate">Fund</dt>
                <dd className="mt-1">{shown.fund}</dd>
              </div>
              <div>
                <dt className="eyebrow text-slate">Status</dt>
                <dd className="mt-1">{shown.status}</dd>
              </div>
              {shown.location && (
                <div>
                  <dt className="eyebrow text-slate">Location</dt>
                  <dd className="mt-1">{shown.location}</dd>
                </div>
              )}
              {shown.founded && (
                <div>
                  <dt className="eyebrow text-slate">Founded</dt>
                  <dd className="mt-1">{shown.founded}</dd>
                </div>
              )}
            </dl>
            <div data-dialog-fade className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-4 pt-10">
              <TLink
                to={`/investing/portfolio-companies/${shown.slug}`}
                onClick={() => {
                  smooth.start()
                  document.documentElement.style.overflow = ''
                }}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-teal"
              >
                <span className="u-link-static">Full company profile</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </TLink>
              {shown.website && (
                <a
                  href={shown.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-semibold"
                >
                  <span className="u-link-static">{hostname(shown.website)}</span>
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
