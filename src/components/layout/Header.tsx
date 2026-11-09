import { ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { navigation, type NavItem } from '../../data/site'
import { ease, gsap, prefersReducedMotion } from '../../lib/gsap'
import { whenIntroDone } from '../../lib/intro'
import { Logo } from '../ui/Logo'
import { TLink } from '../ui/TLink'
import { MobileMenu } from './MobileMenu'

type Tone = 'dark' | 'light'

/** Reads which `[data-header]` section currently sits beneath the bar. */
function sampleTone(y = 44): Tone {
  const sections = document.querySelectorAll<HTMLElement>('[data-header]')
  let tone: Tone = 'light'
  sections.forEach((s) => {
    const r = s.getBoundingClientRect()
    if (r.top <= y && r.bottom > y) tone = (s.dataset.header as Tone) ?? 'light'
  })
  return tone
}

export function Header() {
  const { pathname } = useLocation()
  const [tone, setTone] = useState<Tone>('dark')
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const lastY = useRef(0)

  const update = useCallback(() => {
    const y = window.scrollY
    setScrolled(y > 24)
    setHidden(y > 320 && y > lastY.current + 2)
    if (y < lastY.current - 2) setHidden(false)
    lastY.current = y
    setTone(sampleTone())
  }, [])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    const onReady = () => requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('page:ready', onReady)
    update()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('page:ready', onReady)
    }
  }, [update])

  useEffect(() => {
    setOpenDropdown(null)
    setMenuOpen(false)
  }, [pathname])

  // Navigation settles in after the intro curtain.
  useEffect(() => {
    const bar = barRef.current
    if (!bar || prefersReducedMotion()) return
    gsap.set(bar, { yPercent: -100, autoAlpha: 0 })
    return whenIntroDone(() => {
      gsap.to(bar, { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: ease.out, delay: 0.55 })
    })
  }, [])

  const onDark = tone === 'dark' && !menuOpen
  const text = menuOpen ? 'text-ivory' : onDark ? 'text-ivory' : 'text-ink'
  const surface = menuOpen
    ? 'bg-transparent'
    : scrolled
      ? onDark
        ? 'bg-ink/70 backdrop-blur-xl border-b border-ivory/10'
        : 'bg-ivory/80 backdrop-blur-xl border-b border-ink/10'
      : 'bg-transparent border-b border-transparent'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-transform duration-700 ease-[var(--ease-out-expo)] ${
          hidden && !menuOpen && !openDropdown ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div ref={barRef}>
          <div className={`transition-colors duration-500 ${surface} ${text}`}>
            <nav aria-label="Primary" className="container-x flex h-20 items-center justify-between gap-6">
              <TLink to="/" className="relative z-10 -m-2 p-2" aria-label="Tallwater Growth Partners, home">
                <Logo />
              </TLink>

              <ul className="hidden items-center gap-1 lg:flex">
                {navigation.map((item) => (
                  <DesktopItem
                    key={item.label}
                    item={item}
                    pathname={pathname}
                    open={openDropdown === item.label}
                    onOpenChange={(o) => setOpenDropdown(o ? item.label : null)}
                    onDark={onDark}
                  />
                ))}
              </ul>

              <div className="flex items-center gap-3">
                <TLink
                  to="/get-in-touch"
                  className={`hidden h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors duration-500 xl:inline-flex ${
                    onDark ? 'bg-sky text-ink hover:bg-sky-soft' : 'bg-ink text-ivory hover:bg-teal'
                  }`}
                >
                  Start a conversation
                </TLink>
                <MenuToggle open={menuOpen} onToggle={() => setMenuOpen((o) => !o)} />
              </div>
            </nav>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      className="relative z-10 -mr-2 inline-flex h-11 items-center gap-3 px-2 text-sm font-semibold lg:hidden"
    >
      <span className="relative block h-3 w-6" aria-hidden="true">
        <span
          className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${
            open ? 'translate-y-[5.5px] rotate-45' : ''
          }`}
        />
        <span
          className={`absolute bottom-0 left-0 h-px bg-current transition-all duration-500 ease-[var(--ease-out-expo)] ${
            open ? 'w-full -translate-y-[5.5px] -rotate-45' : 'w-2/3'
          }`}
        />
      </span>
      <span>{open ? 'Close' : 'Menu'}</span>
    </button>
  )
}

interface DesktopItemProps {
  item: NavItem
  pathname: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onDark: boolean
}

function DesktopItem({ item, pathname, open, onOpenChange, onDark }: DesktopItemProps) {
  const id = useId()
  const btnRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<number>(0)
  const active =
    pathname === item.to || item.children?.some((c) => pathname.startsWith(c.to)) || pathname.startsWith(item.to + '/')

  const base = 'relative inline-flex h-11 items-center gap-1.5 px-4 text-[0.9rem] font-medium tracking-[0.005em]'
  const indicator = (
    <span
      aria-hidden="true"
      className={`absolute bottom-1.5 left-4 right-4 h-px origin-left bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${
        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}
    />
  )

  if (!item.children) {
    return (
      <li>
        <TLink to={item.to} className={`group ${base}`} aria-current={pathname === item.to ? 'page' : undefined}>
          {item.label}
          {indicator}
        </TLink>
      </li>
    )
  }

  const enter = () => {
    window.clearTimeout(closeTimer.current)
    onOpenChange(true)
  }
  const leave = () => {
    closeTimer.current = window.setTimeout(() => onOpenChange(false), 140)
  }

  return (
    <li
      className="relative"
      onPointerEnter={(e) => e.pointerType === 'mouse' && enter()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && leave()}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          onOpenChange(false)
          btnRef.current?.focus()
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onOpenChange(false)
      }}
    >
      <button
        ref={btnRef}
        type="button"
        className={`group ${base}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => onOpenChange(!open)}
      >
        {item.label}
        <ChevronDown
          className={`size-3.5 transition-transform duration-500 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
          aria-hidden="true"
        />
        {indicator}
      </button>

      <div
        id={id}
        className={`absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3 transition-all duration-500 ease-[var(--ease-out-expo)] ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <ul
          className={`overflow-hidden rounded-[3px] border p-2 shadow-[0_30px_60px_-30px_rgb(12_31_40/0.45)] ${
            onDark ? 'border-ivory/10 bg-ink-2 text-ivory' : 'border-ink/10 bg-paper text-ink'
          }`}
        >
          {item.children.map((child, i) => (
            <li key={child.to + child.label}>
              <TLink
                to={child.to}
                className={`group/item flex gap-4 rounded-[2px] px-4 py-3.5 transition-colors duration-300 ${
                  onDark ? 'hover:bg-ivory/[0.06]' : 'hover:bg-ink/[0.04]'
                }`}
                aria-current={pathname === child.to ? 'page' : undefined}
              >
                <span className={`tabular pt-1 text-[0.68rem] font-semibold ${onDark ? 'text-sky' : 'text-teal'}`}>0{i + 1}</span>
                <span>
                  <span className="block font-serif text-[1.2rem] leading-tight">{child.label}</span>
                  {child.description && (
                    <span className={`mt-1 block text-[0.8rem] leading-snug ${onDark ? 'text-ivory/60' : 'text-slate'}`}>
                      {child.description}
                    </span>
                  )}
                </span>
              </TLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
