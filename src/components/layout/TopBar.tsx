import { Sun, Moon, Menu } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      className="h-14 flex items-center justify-between px-4 border-b"
      style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Menü öffnen"
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Dark Mode aktivieren' : 'Light Mode aktivieren'}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </Button>
    </header>
  )
}
