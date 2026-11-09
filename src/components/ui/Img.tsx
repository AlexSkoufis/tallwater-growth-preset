import type { ImgHTMLAttributes } from 'react'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  /** Asset path without the width suffix, for example `/media/hero/about`. */
  base: string
  widths?: number[]
  alt: string
  priority?: boolean
}

/** Responsive WebP image backed by the optimisation script's width variants. */
export function Img({ base, widths = [960, 1920], sizes = '100vw', alt, priority, ...rest }: Props) {
  const srcSet = widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ')
  return (
    <img
      src={`${base}-${widths[widths.length - 1]}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      {...rest}
    />
  )
}
