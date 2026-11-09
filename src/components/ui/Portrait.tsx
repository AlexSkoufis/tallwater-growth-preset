import type { TeamMember } from '../../data/types'
import { Img } from './Img'
import { TLink } from './TLink'

interface Props {
  member: TeamMember
  className?: string
  aspect?: string
  sizes?: string
  showGroup?: boolean
}

/** Portrait card: masked photograph, quiet zoom on hover, name and title set editorially. */
export function Portrait({
  member,
  className = '',
  aspect = 'aspect-[4/5]',
  sizes = '(min-width: 1024px) 30vw, 80vw',
  showGroup,
}: Props) {
  return (
    <TLink to={`/who-we-are/our-team/${member.slug}`} data-cursor="Profile" className={`group block ${className}`}>
      <div data-portrait-frame className={`relative overflow-hidden bg-stone ${aspect}`}>
        <Img
          base={member.image}
          widths={[480, 960]}
          sizes={sizes}
          alt={`Portrait of ${member.name}`}
          className="absolute inset-0 h-full w-full object-cover object-top saturate-[0.85] transition-[transform,filter] duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.045] group-hover:saturate-100"
        />
        <span
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/25 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-serif text-[1.55rem] font-light leading-tight tracking-[-0.015em]">
            <span className="u-link">{member.name}</span>
          </h3>
          <p className="mt-1 text-sm text-slate">{member.title}</p>
        </div>
        {showGroup && <p className="eyebrow shrink-0 text-[0.62rem] text-slate/80">{member.group}</p>}
      </div>
    </TLink>
  )
}
