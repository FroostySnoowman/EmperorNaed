export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-ink-950" />

      <div className="absolute -left-[18%] -top-[22%] h-[62vmax] w-[62vmax] animate-aurora-a rounded-full bg-[radial-gradient(circle_at_center,rgba(222,15,63,0.22),rgba(222,15,63,0.06)_38%,transparent_72%)] will-change-transform" />
      <div className="absolute -right-[22%] top-[28%] h-[54vmax] w-[54vmax] animate-aurora-b rounded-full bg-[radial-gradient(circle_at_center,rgba(155,10,49,0.18),rgba(155,10,49,0.05)_40%,transparent_74%)] will-change-transform" />

      <div className="absolute inset-0 bg-hatch opacity-70" />
      <div className="absolute inset-0 bg-grain opacity-[0.04]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_35%,rgba(6,5,9,0.75)_100%)]" />
    </div>
  )
}
