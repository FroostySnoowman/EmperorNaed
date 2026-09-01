import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { cn } from '../../lib/cn'
import { EASE } from '../../lib/motion'
import type { LightboxState } from '../../lib/useLightbox'
import { Icon } from './Icon'

export function Lightbox({
  state,
  onClose,
  onIndexChange,
}: {
  state: LightboxState | null
  onClose: () => void
  onIndexChange: (index: number) => void
}) {
  const count = state?.images.length ?? 0

  useEffect(() => {
    if (!state) return
    const step = (delta: number) => onIndexChange((state.index + delta + count) % count)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [state, count, onClose, onIndexChange])

  return (
    <AnimatePresence>
      {state ? (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex flex-col bg-ink-950/97"
          role="dialog"
          aria-modal="true"
          aria-label={state.title}
        >
          <div className="page flex items-center justify-between gap-6 border-b border-ink-700 py-4">
            <div className="min-w-0">
              <p className="truncate font-sans text-sm font-medium text-paper">{state.title}</p>
              <p className="label mt-1">
                {state.index + 1} / {count}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="inline-flex h-10 w-10 items-center justify-center border border-ink-600 text-paper-dim transition-colors hover:border-paper hover:text-paper"
            >
              <Icon name="close" className="text-[17px]" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center p-5 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.img
                key={state.images[state.index]}
                src={state.images[state.index]}
                alt={`${state.title} ${state.index + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="max-h-full max-w-full border border-ink-700 object-contain"
              />
            </AnimatePresence>

            {count > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => onIndexChange((state.index - 1 + count) % count)}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-ink-600 bg-ink-950/80 text-paper-dim transition-colors hover:border-paper hover:text-paper sm:flex"
                >
                  <Icon name="chevron-left" className="text-[17px]" />
                </button>
                <button
                  type="button"
                  onClick={() => onIndexChange((state.index + 1) % count)}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-ink-600 bg-ink-950/80 text-paper-dim transition-colors hover:border-paper hover:text-paper sm:flex"
                >
                  <Icon name="chevron-right" className="text-[17px]" />
                </button>
              </>
            ) : null}
          </div>

          {count > 1 ? (
            <div className="page no-bar flex gap-2 overflow-x-auto border-t border-ink-700 py-4">
              {state.images.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  onClick={() => onIndexChange(index)}
                  aria-label={`View image ${index + 1}`}
                  className={cn(
                    'h-14 w-20 shrink-0 overflow-hidden border transition-opacity',
                    index === state.index ? 'border-signal opacity-100' : 'border-ink-600 opacity-50 hover:opacity-90',
                  )}
                >
                  <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
