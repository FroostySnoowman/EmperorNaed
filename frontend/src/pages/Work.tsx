import { useMemo, useState } from 'react'
import { useContent } from '../content/useContent'
import type { ActiveProject, ShowcaseItem } from '../content/schema'
import { cn } from '../lib/cn'
import { uniqueStrings } from '../lib/utils'
import { useLightbox } from '../lib/useLightbox'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icon'
import { Lightbox } from '../components/ui/Lightbox'
import { PageIntro } from '../components/ui/PageIntro'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'

function ActiveCard({ project }: { project: ActiveProject }) {
  return (
    <Card className="h-full" innerClassName="flex h-full flex-col p-6">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs font-medium text-crimson-400">{project.phase || 'In progress'}</span>
        <span className="text-xs text-white/40">{project.progress}% done</span>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-crimson-500" style={{ width: `${project.progress}%` }} />
      </div>

      <h3 className="mt-5 text-base font-semibold text-white">{project.name}</h3>
      {project.summary ? <p className="mt-2.5 flex-1 text-sm leading-relaxed text-white/55">{project.summary}</p> : null}

      <div className="mt-auto pt-6">
        {project.stack.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>
        ) : null}
        {project.links.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-4 border-t border-white/[0.07] pt-4">
            {project.links.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
              >
                {link.label}
                <Icon name="arrow-up-right" className="text-[13px]" />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  )
}

function ShowcaseCard({
  item,
  onOpenGallery,
}: {
  item: ShowcaseItem
  onOpenGallery: (images: string[], index: number, title: string) => void
}) {
  const images = useMemo(() => [item.cover, ...item.gallery].filter(Boolean), [item.cover, item.gallery])

  return (
    <Card className="h-full overflow-hidden" innerClassName="flex h-full flex-col">
      {images.length > 0 ? (
        <button
          type="button"
          onClick={() => onOpenGallery(images, 0, item.title)}
          className="group block w-full overflow-hidden border-b border-white/10"
          aria-label={`Open images for ${item.title}`}
        >
          <div className="aspect-[16/10] overflow-hidden bg-ink-850">
            <img
              src={item.cover || images[0]}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </button>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-white/40">
          {item.category ? <span className="text-crimson-400">{item.category}</span> : null}
          {item.year ? <span>{item.year}</span> : null}
        </div>

        <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
        {item.summary ? <p className="mt-2.5 flex-1 text-sm leading-relaxed text-white/55">{item.summary}</p> : null}

        <div className="mt-auto pt-6">
          {item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {item.links.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-4 border-t border-white/[0.07] pt-4">
              {item.links.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent"
                >
                  {link.label}
                  <Icon name="arrow-up-right" className="text-[13px]" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

export function Work() {
  const { work } = useContent()
  const lightbox = useLightbox()
  const [filter, setFilter] = useState('')

  const categories = useMemo(
    () => uniqueStrings(work.showcase.items.map((item) => item.category)).sort((a, b) => a.localeCompare(b)),
    [work.showcase.items],
  )

  const visible = useMemo(
    () => (filter ? work.showcase.items.filter((item) => item.category === filter) : work.showcase.items),
    [work.showcase.items, filter],
  )

  return (
    <div>
      <PageIntro marker={work.intro.marker} title={work.intro.title} kicker={work.intro.kicker} />

      <section className="shell mt-12">
        <SectionHeading marker={work.active.marker} title={work.active.title} kicker={work.active.kicker} />
        {work.active.items.length === 0 ? (
          <p className="mt-8 text-sm text-white/40">{work.active.emptyLabel}</p>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {work.active.items.map((project, index) => (
              <Reveal key={project.id || project.name} delay={index * 0.05}>
                <ActiveCard project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="shell mt-24">
        <SectionHeading marker={work.showcase.marker} title={work.showcase.title} kicker={work.showcase.kicker} />

        {categories.length > 1 ? (
          <div className="no-bar mt-8 flex gap-2 overflow-x-auto pb-1">
            {[work.showcase.allLabel, ...categories].map((label, index) => {
              const value = index === 0 ? '' : label
              const active = filter === value
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={active}
                  className={cn(
                    'shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm transition-colors duration-200',
                    active
                      ? 'border-crimson-500/50 bg-crimson-600/15 text-white'
                      : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white',
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        ) : null}

        {visible.length === 0 ? (
          <p className="mt-8 text-sm text-white/40">{work.showcase.emptyLabel}</p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((item, index) => (
              <Reveal key={item.id || item.title} delay={(index % 3) * 0.05}>
                <ShowcaseCard item={item} onOpenGallery={lightbox.open} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <Lightbox state={lightbox.state} onClose={lightbox.close} onIndexChange={lightbox.setIndex} />
    </div>
  )
}
