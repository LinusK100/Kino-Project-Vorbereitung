import { useEffect } from 'react'
import { useAppStore } from '@/store/appStore'

export function useTheme() {
  const { theme, toggleTheme } = useAppStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return { theme, toggleTheme }
}
