import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTransition } from '../../lib/transition'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  children: ReactNode
}

/** Off-site links and static files (PDFs and anything under /media) skip the router. */
const isExternal = (to: string) => /^(https?:|mailto:|tel:)/.test(to) || /^\/media\/|\.pdf$/i.test(to)

/**
 * One link component for the whole site. Internal routes play the page
 * transition; external destinations open safely in a new tab.
 */
export function TLink({ to, children, onClick, ...rest }: Props) {
  const { go } = useTransition()

  if (isExternal(to)) {
    const newTab = to.startsWith('http') || /\.pdf$/i.test(to)
    return (
      <a href={to} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={onClick} {...rest}>
        {children}
      </a>
    )
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    go(to)
  }

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
