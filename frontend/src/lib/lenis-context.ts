import type Lenis from 'lenis'
import { createContext, useContext, type RefObject } from 'react'

export type LenisRef = RefObject<Lenis | null>

const EMPTY: LenisRef = { current: null }

export const LenisContext = createContext<LenisRef>(EMPTY)

export function useLenisRef(): LenisRef {
  return useContext(LenisContext)
}
