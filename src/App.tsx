import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { AppShell } from '@/components/layout/AppShell'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { PresentationHost } from '@/components/presentation/PresentationHost'
import { useAppStore } from '@/store/appStore'
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
const MethodikPage = lazy(() => import('@/pages/MethodikPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const PraesentationDruckPage = lazy(() => import('@/pages/PraesentationDruckPage'))

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
  // Während der Präsentation navigiert der Hintergrund in schneller Folge unter
  // dem opaken Overlay. Mit mode="wait" darf die neue Seite erst einhängen, wenn
  // die Exit-Animation der alten fertig ist — wird die unter dem Overlay
  // ausgebremst oder abgebrochen, bleibt die alte Seite dauerhaft stehen.
  // Deshalb: solange die Präsentation läuft, Routen ohne Übergangsanimation.
  // Der Wechsel des Wrappers baut den Routen-Baum beim Öffnen/Schließen zudem
  // frisch auf, sodass beim Beenden garantiert die aktuelle Seite steht.
  const presAktiv = useAppStore((s) => s.pres !== null)
  const inhalt = (
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
        <Route path="/arbeitsweise" element={<MethodikPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  )
  return (
    <Suspense fallback={<Skeleton />}>
      {presAktiv ? inhalt : <AnimatePresence mode="wait">{inhalt}</AnimatePresence>}
    </Suspense>
  )
}

function AppContent() {
  useTheme()
  return (
    <BrowserRouter basename="/Kino-Project-Vorbereitung">
      <Routes>
        {/* Druck-Ansicht ohne AppShell — Quelle des PDF-Exports */}
        <Route
          path="/praesentation/druck"
          element={<Suspense fallback={null}><PraesentationDruckPage /></Suspense>}
        />
        <Route
          path="*"
          element={
            <>
              <AppShell>
                <AnimatedRoutes />
              </AppShell>
              {/* Präsentation als globales Overlay: überlebt die Hintergrund-
                  Navigation zwischen den Abschnitten (Gesamt-Präsentation). */}
              <PresentationHost />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return <AppContent />
}
