import { createContext } from 'react'
import type { Content } from './schema'

export type ContentIssue = {
  file: string
  path: string
  message: string
}

export type ContentState =
  | { status: 'loading'; content: null; issues: [] }
  | { status: 'ready'; content: Content; issues: [] }
  | { status: 'error'; content: null; issues: ContentIssue[] }

export const ContentContext = createContext<ContentState>({
  status: 'loading',
  content: null,
  issues: [],
})
