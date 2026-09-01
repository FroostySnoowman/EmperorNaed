import { ActionLink } from '../components/ui/ActionLink'

export function NotFound() {
  return (
    <div className="page flex min-h-[64svh] flex-col justify-center py-24">
      <p className="kicker">Error 404</p>
      <h1 className="mt-6 text-mega font-semibold text-white">Not here.</h1>
      <p className="copy-lg mt-8 max-w-read">
        That page does not exist. It may have been renamed, or moved somewhere else.
      </p>
      <div className="mt-12 flex flex-wrap gap-4">
        <ActionLink to="/" variant="fill">
          Back home
        </ActionLink>
        <ActionLink to="/work" variant="outline">
          See my work
        </ActionLink>
      </div>
    </div>
  )
}
