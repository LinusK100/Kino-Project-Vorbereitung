import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useTheme } from '@/hooks/useTheme'
import '@/styles/globals.css'

const OverviewPage = lazy(() => import('@/pages/OverviewPage'))
const PersonasPage = lazy(() => import('@/pages/PersonasPage'))
const UserStoriesPage = lazy(() => import('@/pages/UserStoriesPage'))
const StoryMapPage = lazy(() => import('@/pages/StoryMapPage'))
const PrototypePage = lazy(() => import('@/pages/PrototypePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 rounded-xl w-64" style={{ background: 'var(--border-color)' }} />
      <div className="h-4 rounded w-80" style={{ background: 'var(--border-color)' }} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 rounded-xl" style={{ background: 'var(--border-color)' }} />
        ))}
      </div>
    </div>
  )
}

function AppContent() {
  useTheme()

  return (
    <BrowserRouter basename="/Kino-Project-Vorbereitung">
      <AppShell>
        <Suspense fallback={<Skeleton />}>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/personas" element={<PersonasPage />} />
            <Route path="/user-stories" element={<UserStoriesPage />} />
            <Route path="/story-map" element={<StoryMapPage />} />
            <Route path="/prototype" element={<PrototypePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  )
}

export default function App() {
  return <AppContent />
}
