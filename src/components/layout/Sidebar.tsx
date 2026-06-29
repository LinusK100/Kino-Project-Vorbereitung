import { NavLink } from 'react-router-dom'
import { Film } from 'lucide-react'
import { NAV } from './nav'

interface SidebarProps { onClose?: () => void }

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-color)' }}
    >
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#01696f' }}>
            <Film size={18} color="white" />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>CineTicket</div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Systemanalyse & Entwurf</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {NAV.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                    style={({ isActive }) => ({
                      color: isActive ? item.accent : 'var(--text-secondary)',
                      background: isActive ? `${item.accent}14` : 'transparent',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={17} style={{ color: isActive ? item.accent : 'currentColor' }} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t text-[11px]" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Kino-Projekt · v5.1</p>
        <p>Universitätsprojekt · 2026</p>
      </div>
    </aside>
  )
}
