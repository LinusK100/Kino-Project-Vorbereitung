import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, ListChecks, Map, Smartphone, Film
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Übersicht', icon: LayoutDashboard },
  { path: '/personas', label: 'Personas', icon: Users },
  { path: '/user-stories', label: 'User Stories', icon: ListChecks },
  { path: '/story-map', label: 'Story Map', icon: Map },
  { path: '/prototype', label: 'Prototyp', icon: Smartphone },
]

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className="flex flex-col h-full"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-color)' }}
    >
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#01696f' }}
          >
            <Film size={16} color="white" />
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>CineTicket</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>System</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                color: isActive ? '#01696f' : 'var(--text-secondary)',
                background: isActive ? 'rgba(1, 105, 111, 0.08)' : 'transparent',
              }}
              aria-label={item.label}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
        <p>Kino-Projekt 2025</p>
        <p>Projektdokumentation</p>
      </div>
    </aside>
  )
}
