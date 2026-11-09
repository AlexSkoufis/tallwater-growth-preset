import { useEffect, useLayoutEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useTransition } from '../../lib/transition'
import { Footer } from './Footer'

interface Props {
  title: string
  description: string
  children: ReactNode
  /** Optional JSON-LD, only where the data is factual and valid. */
  schema?: Record<string, unknown>
}

const SITE_TITLE = 'Tallwater Growth Partners'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/**
 * Every route renders inside Page. It owns per-page metadata and tells the
 * transition system that the new route has mounted, which settles scroll
 * and lifts the curtain.
 */
export function Page({ title, description, children, schema }: Props) {
  const { pageReady } = useTransition()
  const { pathname } = useLocation()

  useEffect(() => {
    const full = title === SITE_TITLE ? `${SITE_TITLE} | Growth Capital for the Great Lakes` : `${title} | ${SITE_TITLE}`
    document.title = full
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', window.location.origin + pathname)

    // Canonical points at the current deployment.
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = window.location.origin + pathname

    let ld = document.getElementById('ld-json') as HTMLScriptElement | null
    if (schema) {
      if (!ld) {
        ld = document.createElement('script')
        ld.type = 'application/ld+json'
        ld.id = 'ld-json'
        document.head.appendChild(ld)
      }
      ld.textContent = JSON.stringify(schema)
    } else ld?.remove()
  }, [title, description, pathname, schema])

  useLayoutEffect(() => {
    pageReady()
    // pageReady is stable per location; run once per mounted page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  )
}
