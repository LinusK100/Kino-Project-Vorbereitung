import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { AppShell } from '@/components/layout/AppShell'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { useTheme } from '@/hooks/useTheme'
import '@/styles/globals.css'

const OverviewPage = lazy(() => import('@/pages/OverviewPage'))
const PersonasPage = lazy(() => import('@/pages/PersonasPage'))
const UserStoriesPage = lazy(() => import('@/pages/UserStoriesPage'))
const StoryMapPage = lazy(() => import('@/pages/StoryMapPage'))
const ClassDiagramPage = lazy(() => import('@/pages/ClassDiagramPage'))
const SequencePage = lazy(() => import('@/pages/SequencePage'))
const StatePage = lazy(() => import('@/pages/StatePage'))
const InnovationPage = lazy(() => import('@/pages/InnovationPage'))
const PrototypePage = lazy(() => import('@/pages/PrototypePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 rounded-2xl" style={{ background: 'var(--border-color)' }} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl" style={{ background: 'var(--border-color)' }} />
        ))}
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <Suspense fallback={<Skeleton />}>
      <AnimatePresence mode="wait">
        <ErrorBoundary key={location.pathname}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/personas" element={<PersonasPage />} />
          <Route path="/user-stories" element={<UserStoriesPage />} />
          <Route path="/story-map" element={<StoryMapPage />} />
          <Route path="/klassendiagramm" element={<ClassDiagramPage />} />
          <Route path="/sequenzdiagramme" element={<SequencePage />} />
          <Route path="/zustandsdiagramme" element={<StatePage />} />
          <Route path="/innovation" element={<InnovationPage />} />
          <Route path="/prototyp" element={<PrototypePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </ErrorBoundary>
      </AnimatePresence>
    </Suspense>
  )
}

function AppContent() {
  useTheme()
  return (
    <BrowserRouter basename="/Kino-Project-Vorbereitung">
      <AppShell>
        <AnimatedRoutes />
      </AppShell>
    </BrowserRouter>
  )
}

export default function App() {
  return <AppContent />
}
