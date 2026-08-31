import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

export function useCanHover(): boolean {
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const sync = () => setCanHover(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return canHover
}
