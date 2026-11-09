interface Props {
  index?: string
  children: string
  className?: string
  tone?: 'light' | 'dark'
}

/** Section label: an index number, a hairline, and a small caps title. */
export function Eyebrow({ index, children, className = '', tone = 'dark' }: Props) {
  const muted = tone === 'light' ? 'text-ivory/55' : 'text-slate'
  const rule = tone === 'light' ? 'bg-ivory/25' : 'bg-ink/20'
  return (
    <p className={`eyebrow flex items-center gap-4 ${className}`}>
      {index && <span className={`tabular ${muted}`}>{index}</span>}
      {index && <span className={`h-px w-10 ${rule}`} aria-hidden="true" />}
      <span>{children}</span>
    </p>
  )
}
