import { MotionConfig } from 'framer-motion'
import { lazy, useContext, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ContentContext } from './content/ContentContext'
import { ContentProvider } from './content/ContentProvider'
import { RootLayout } from './components/layout/RootLayout'
import { ContentErrorScreen } from './components/ui/ContentErrorScreen'
import { Home } from './pages/Home'

const Timeline = lazy(() => import('./pages/Timeline').then((m) => ({ default: m.Timeline })))
const Active = lazy(() => import('./pages/Active').then((m) => ({ default: m.Active })))
const Work = lazy(() => import('./pages/Work').then((m) => ({ default: m.Work })))
const Gallery = lazy(() => import('./pages/Gallery').then((m) => ({ default: m.Gallery })))
const Skills = lazy(() => import('./pages/Skills').then((m) => ({ default: m.Skills })))
const Reviews = lazy(() => import('./pages/Reviews').then((m) => ({ default: m.Reviews })))
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

function ContentGate({ children }: { children: ReactNode }) {
  const state = useContext(ContentContext)
  if (state.status === 'loading') return null
  if (state.status === 'error') return <ContentErrorScreen issues={state.issues} />
  return <>{children}</>
}

export default function App() {
  return (
    <ContentProvider>
      <ContentGate>
        <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/active" element={<Active />} />
              <Route path="/work" element={<Work />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </MotionConfig>
      </ContentGate>
    </ContentProvider>
  )
}
