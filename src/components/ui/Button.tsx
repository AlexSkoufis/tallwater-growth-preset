import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Magnetic } from '../motion/Magnetic'
import { TLink } from './TLink'

type Variant = 'sky' | 'ink' | 'ghost-light' | 'ghost-dark'

const variants: Record<Variant, string> = {
  sky: 'bg-sky text-ink hover:bg-sky-soft',
  ink: 'bg-ink text-ivory hover:bg-teal',
  'ghost-light': 'border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink',
  'ghost-dark': 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ivory',
}

interface Props {
  to: string
  children: ReactNode
  variant?: Variant
  magnetic?: boolean
  external?: boolean
  className?: string
  size?: 'md' | 'lg'
}

/**
 * Pill CTA with a rolling label: on hover the text slides up and an
 * identical copy rises into place, a quiet nod to a ticker board.
 */
export function Button({ to, children, variant = 'sky', magnetic = false, external, className = '', size = 'md' }: Props) {
  const Icon = external || /^https?:/.test(to) ? ArrowUpRight : ArrowRight
  const pad = size === 'lg' ? 'h-16 pl-8 pr-3 text-[0.95rem]' : 'h-13 pl-6 pr-2.5 text-sm'
  const iconBox = size === 'lg' ? 'size-11' : 'size-9'

  const link = (
    <TLink
      to={to}
      className={`group relative inline-flex items-center gap-5 rounded-full font-semibold tracking-[0.01em] transition-colors duration-500 ${pad} ${variants[variant]} ${className}`}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      <span
        className={`grid ${iconBox} place-items-center rounded-full bg-current/10 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-[-45deg]`}
        aria-hidden="true"
      >
        <Icon className="size-4" strokeWidth={1.6} />
      </span>
    </TLink>
  )

  return magnetic ? <Magnetic>{link}</Magnetic> : link
}

/** Text link with arrow and drawn underline, for secondary actions. */
export function ArrowLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  const external = /^https?:/.test(to)
  const Icon = external ? ArrowUpRight : ArrowRight
  return (
    <TLink to={to} className={`group inline-flex items-center gap-2.5 text-sm font-semibold tracking-[0.01em] ${className}`}>
      <span className="u-link-static">{children}</span>
      <Icon
        className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:-translate-y-px"
        strokeWidth={1.6}
        aria-hidden="true"
      />
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </TLink>
  )
}
