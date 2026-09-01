import type { ContentIssue } from '../../content/ContentContext'

export function ContentErrorScreen({ issues }: { issues: ContentIssue[] }) {
  const files = [...new Set(issues.map((issue) => issue.file))]
  return (
    <div className="min-h-[100svh] bg-ink py-24">
      <div className="page max-w-3xl">
        <p className="kicker">Content error</p>
        <h1 className="mt-6 text-huge font-semibold text-white">
          {files.length === 1 ? 'A content file' : 'Some content files'} could not be read
        </h1>
        <p className="copy-lg mt-6">
          Fix the {files.length === 1 ? 'entry' : 'entries'} below in <span className="text-accent">public/content/</span>{' '}
          and refresh. Nothing needs rebuilding.
        </p>
        <ul className="mt-12 space-y-6">
          {issues.map((issue, index) => (
            <li key={`${issue.file}-${issue.path}-${index}`} className="bg-raised p-6">
              <p className="text-[15px] font-semibold text-white">
                {issue.file}
                {issue.path ? <span className="text-accent"> · {issue.path}</span> : null}
              </p>
              <p className="copy mt-2 text-[14px]">{issue.message}</p>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => window.location.reload()} className="btn btn-fill mt-12">
          Reload
        </button>
      </div>
    </div>
  )
}
