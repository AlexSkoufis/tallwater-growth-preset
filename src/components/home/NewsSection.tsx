import { articles } from '../../data/news'
import { SplitHeading } from '../motion/SplitHeading'
import { Reveal } from '../motion/Reveal'
import { ArticleCard } from '../ui/ArticleCard'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'

// Current investing news leads; archived advisory material stays on the News page.
const current = articles.filter((a) => !a.archive)
const [lead, ...rest] = current
const side = rest.slice(0, 3)

export function NewsSection() {
  return (
    <section data-header="light" aria-labelledby="news-title" className="on-light bg-paper text-ink">
      <div className="container-x section-y">
        <div className="flex flex-col justify-between gap-8 border-b hairline pb-10 md:flex-row md:items-end">
          <div>
            <Eyebrow index="07" className="text-teal">
              News &amp; insights
            </Eyebrow>
            <SplitHeading id="news-title" className="display-l mt-8">
              Latest from Tallwater.
            </SplitHeading>
          </div>
          <Button to="/news-insights" variant="ghost-dark">
            All news &amp; insights
          </Button>
        </div>

        <div className="grid-12 mt-14 gap-y-14">
          <Reveal variant="rise" className="col-span-12 lg:col-span-7">
            <ArticleCard article={lead} variant="lead" />
          </Reveal>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <ul className="divide-y divide-ink/10 border-t hairline lg:border-t-0">
              {side.map((a) => (
                <li key={a.slug}>
                  <Reveal variant="fade">
                    <ArticleCard article={a} variant="compact" />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
