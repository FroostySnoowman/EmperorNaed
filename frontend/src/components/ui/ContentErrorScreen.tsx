import type { ContentIssue } from '../../content/ContentContext'
import { Icon } from './Icon'
import { Sigil } from './Sigil'

export function ContentErrorScreen({ issues }: { issues: ContentIssue[] }) {
  const files = [...new Set(issues.map((issue) => issue.file))]

  return (
    <div className="min-h-[100svh] bg-ink-950 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <Sigil monogram="EN" className="h-11 w-11" />
          <div>
            <p className="marker">Content error</p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              A content file needs attention
            </h1>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-white/55">
          The site could not start because {files.length === 1 ? 'a content file' : 'some content files'} could not be
          read. Fix the {files.length === 1 ? 'entry' : 'entries'} below in{' '}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-crimson-200">public/</code>{' '}
          and refresh — no rebuild needed.
        </p>

        <ul className="mt-8 space-y-3">
          {issues.map((issue, index) => (
            <li key={`${issue.file}-${issue.path}-${index}`} className="plate p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Icon name="close" className="text-[14px] text-crimson-400" />
                <span className="font-mono text-[12.5px] font-medium text-white/90">{issue.file}</span>
                {issue.path ? (
                  <span className="chip chip-accent font-mono text-[11px]">{issue.path}</span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{issue.message}</p>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn btn-primary btn-sheen mt-8"
        >
          <span className="relative z-[1]">Reload</span>
        </button>
      </div>
    </div>
  )
}
