import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { NAV } from './nav'
import { TopBar } from './TopBar'

const titleByPath: Record<string, string> = Object.fromEntries(
  NAV.flatMap((g) => g.items.map((i) => [i.path, i.label])),
)

interface AppShellProps { children: React.ReactNode }

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = titleByPath[location.pathname] ?? 'CineTicket'

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:w-60 md:flex-shrink-0 flex-col">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute left-0 top-0 h-full w-60" onClick={(e) => e.stopPropagation()}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
