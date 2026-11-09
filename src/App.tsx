import { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Cursor } from './components/layout/Cursor'
import { Header } from './components/layout/Header'
import { Intro } from './components/layout/Intro'
import Home from './pages/Home'
import { SmoothScrollProvider } from './lib/smooth-scroll'
import { TransitionProvider } from './lib/transition'

const Investing = lazy(() => import('./pages/Investing'))
const Criteria = lazy(() => import('./pages/Criteria'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const PortfolioDetail = lazy(() => import('./pages/PortfolioDetail'))
const About = lazy(() => import('./pages/About'))
const Team = lazy(() => import('./pages/Team'))
const TeamMember = lazy(() => import('./pages/TeamMember'))
const News = lazy(() => import('./pages/News'))
const ArticlePage = lazy(() => import('./pages/Article'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Shell() {
  const { pathname } = useLocation()
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Intro />
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-ink" aria-hidden="true" />}>
        {/* Keyed by path so each route mounts fresh and reports ready to the transition system. */}
        <div key={pathname}>
          <Outlet />
        </div>
      </Suspense>
      <Cursor />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <TransitionProvider>
          <Routes>
            <Route element={<Shell />}>
              <Route index element={<Home />} />
              <Route path="investing" element={<Investing />} />
              <Route path="investing/investment-criteria" element={<Criteria />} />
              <Route path="investing/portfolio-companies" element={<Portfolio />} />
              <Route path="investing/portfolio-companies/:slug" element={<PortfolioDetail />} />
              <Route path="who-we-are/about-us" element={<About />} />
              <Route path="who-we-are/our-team" element={<Team />} />
              <Route path="who-we-are/our-team/:slug" element={<TeamMember />} />
              <Route path="news-insights" element={<News />} />
              <Route path="news-insights/:slug" element={<ArticlePage />} />
              <Route path="get-in-touch" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </TransitionProvider>
      </SmoothScrollProvider>
    </BrowserRouter>
  )
}
