import { ActionLink } from '../components/ui/ActionLink'

export function NotFound() {
  return (
    <div className="shell flex min-h-[60svh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/55">
        That page isn't here. It might have been renamed, or moved somewhere else.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ActionLink to="/" variant="primary">
          Back home
        </ActionLink>
        <ActionLink to="/work" variant="ghost">
          See my work
        </ActionLink>
      </div>
    </div>
  )
}
