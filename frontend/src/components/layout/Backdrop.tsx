export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-ink-950" aria-hidden>
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(189,31,60,0.10),transparent_70%)]" />
    </div>
  )
}
