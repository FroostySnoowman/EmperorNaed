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
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex flex-col bg-ink-950/[0.98]"
          role="dialog"
          aria-modal="true"
          aria-label={state.title}
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-8">
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-white/90">{state.title}</p>
              <p className="mt-0.5 font-mono text-[11px] text-white/40">
                {state.index + 1} / {count}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-crimson-500/40 hover:text-white"
              aria-label="Close viewer"
            >
              <Icon name="close" className="text-[17px]" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.img
                key={state.images[state.index]}
                src={state.images[state.index]}
                alt={`${state.title} ${state.index + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, ease: EASE }}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) onIndexChange((state.index + 1) % count)
                  if (info.offset.x > 80) onIndexChange((state.index - 1 + count) % count)
                }}
                className="max-h-full max-w-full cursor-grab rounded-xl border border-white/10 object-contain shadow-crest active:cursor-grabbing"
              />
            </AnimatePresence>

            {count > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => onIndexChange((state.index - 1 + count) % count)}
                  className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-ink-900/90 text-white/75 transition hover:border-crimson-500/45 hover:text-white sm:flex"
                  aria-label="Previous image"
                >
                  <Icon name="arrow-right" className="rotate-180 text-[17px]" />
                </button>
                <button
                  type="button"
                  onClick={() => onIndexChange((state.index + 1) % count)}
                  className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-ink-900/90 text-white/75 transition hover:border-crimson-500/45 hover:text-white sm:flex"
                  aria-label="Next image"
                >
                  <Icon name="arrow-right" className="text-[17px]" />
                </button>
              </>
            ) : null}
          </div>

          {count > 1 ? (
            <div className="no-bar flex gap-2 overflow-x-auto border-t border-white/[0.07] px-5 py-4 sm:px-8">
              {state.images.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  onClick={() => onIndexChange(index)}
                  className={cn(
                    'h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition',
                    index === state.index
                      ? 'border-crimson-500 opacity-100'
                      : 'border-white/10 opacity-50 hover:opacity-90',
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
