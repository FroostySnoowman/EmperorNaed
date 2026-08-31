import Lenis from 'lenis'
import { useEffect, useRef, type ReactNode } from 'react'
import { LenisContext } from '../../lib/lenis-context'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = instance

    let frame = 0
    const loop = (time: number) => {
      instance.raf(time)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      lenisRef.current = null
    }
  }, [])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}
