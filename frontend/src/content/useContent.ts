import { useContext } from 'react'
import { ContentContext } from './ContentContext'
import type { Content } from './schema'

export function useContent(): Content {
  const state = useContext(ContentContext)
  if (state.status !== 'ready') throw new Error('useContent() used outside a ready ContentProvider.')
  return state.content
}
