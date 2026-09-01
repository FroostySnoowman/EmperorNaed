import { useCallback, useState } from 'react'

export type LightboxState = { images: string[]; index: number; title: string }

export function useLightbox() {
  const [state, setState] = useState<LightboxState | null>(null)

  const open = useCallback((images: string[], index: number, title = 'Image') => {
    const cleaned = images.map((url) => url.trim()).filter(Boolean)
    if (cleaned.length === 0) return
    const safeIndex = Math.min(Math.max(index, 0), cleaned.length - 1)
    setState({ images: cleaned, index: safeIndex, title })
  }, [])

  const close = useCallback(() => setState(null), [])

  const setIndex = useCallback((next: number) => {
    setState((current) => (current ? { ...current, index: next } : current))
  }, [])

  return { state, open, close, setIndex }
}
