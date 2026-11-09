import { Page } from '../components/layout/Page'
import { SplitHeading } from '../components/motion/SplitHeading'
import { Button } from '../components/ui/Button'
import { LogoMark } from '../components/ui/Logo'

export default function NotFound() {
  return (
    <Page title="Page not found" description="The page you are looking for could not be found.">
      <section data-header="dark" className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink text-ivory">
        <LogoMark
          accent={false}
          className="pointer-events-none absolute -right-20 top-1/2 w-[38rem] -translate-y-1/2 text-ivory/[0.04]"
        />
        <div className="container-x relative py-40">
          <p className="eyebrow text-sky">404</p>
          <SplitHeading as="h1" trigger="intro" className="display-xl mt-8 max-w-[14ch]">
            This page has moved on.
          </SplitHeading>
          <p className="lede mt-8 max-w-md text-ivory/70">
            The page you were looking for does not exist, or it has been moved. Try the home page or browse the portfolio.
          </p>
          <div className="mt-12 flex flex-wrap gap-3">
            <Button to="/" variant="sky">
              Return home
            </Button>
            <Button to="/investing/portfolio-companies" variant="ghost-light">
              View the portfolio
            </Button>
          </div>
        </div>
      </section>
    </Page>
  )
}
