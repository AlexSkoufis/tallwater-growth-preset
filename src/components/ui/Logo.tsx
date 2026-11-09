interface MarkProps {
  className?: string
  /** Render the right half of the crossbar in the sky accent. */
  accent?: boolean
}

/**
 * The Tallwater mark: a tall "T" standing over a wave. It is built from four
 * pieces tagged `data-petal` (tl, tr, bl, br) so the intro can fly each one
 * in from a corner of the screen and lock them together.
 */
export function LogoMark({ className, accent = true }: MarkProps) {
  return (
    <svg viewBox="0 0 34 35" className={className} fill="none" aria-hidden="true" focusable="false">
      <path data-petal="tl" d="M0 0H16V5.5H3.2Z" fill="currentColor" />
      <path data-petal="tr" d="M18 0H34L30.8 5.5H18Z" fill={accent ? 'var(--color-sky)' : 'currentColor'} />
      <path data-petal="bl" d="M14.5 7.5H19.5V22L17 25L14.5 22Z" fill="currentColor" />
      <path
        data-petal="br"
        d="M0 28.6C5.7 25.4 11.3 25.4 17 28.6C22.7 31.8 28.3 31.8 34 28.6V32.4C28.3 35.6 22.7 35.6 17 32.4C11.3 29.2 5.7 29.2 0 32.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** "TALLWATER Growth" wordmark, set in the site serif so it scales cleanly. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 45" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <text
        x="0"
        y="23"
        textLength="150"
        lengthAdjust="spacingAndGlyphs"
        style={{ font: '600 28px "Source Serif 4 Variable", Georgia, serif', letterSpacing: '0.04em' }}
      >
        TALLWATER
      </text>
      <text
        x="150"
        y="41.5"
        textAnchor="end"
        style={{ font: 'italic 300 16px "Source Serif 4 Variable", Georgia, serif' }}
      >
        Growth Partners
      </text>
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <LogoMark className="h-[30px] w-auto shrink-0" />
      <Wordmark className="h-[30px] w-auto" />
    </span>
  )
}
