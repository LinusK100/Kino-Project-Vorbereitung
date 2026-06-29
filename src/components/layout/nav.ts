import {
  LayoutDashboard, Users, ListChecks, Map, Boxes, Workflow, CircleDot,
  GitCompareArrows, Sparkles, BookMarked, Smartphone,
} from 'lucide-react'

export interface NavItem { path: string; label: string; icon: React.ElementType; accent: string }
export interface NavGroup { title: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  {
    title: 'Start',
    items: [{ path: '/', label: 'Dashboard', icon: LayoutDashboard, accent: '#01696f' }],
  },
  {
    title: 'Anforderungen',
    items: [
      { path: '/personas', label: 'Personas', icon: Users, accent: '#006494' },
      { path: '/user-stories', label: 'User Stories', icon: ListChecks, accent: '#006494' },
      { path: '/story-map', label: 'Story Map', icon: Map, accent: '#006494' },
    ],
  },
  {
    title: 'Modellierung',
    items: [
      { path: '/klassendiagramm', label: 'Klassendiagramm', icon: Boxes, accent: '#7a39bb' },
      { path: '/sequenzdiagramme', label: 'Sequenzdiagramme', icon: Workflow, accent: '#7a39bb' },
      { path: '/zustandsdiagramme', label: 'Zustandsdiagramme', icon: CircleDot, accent: '#7a39bb' },
    ],
  },
  {
    title: 'Synthese',
    items: [
      { path: '/traceability', label: 'Traceability', icon: GitCompareArrows, accent: '#437a22' },
      { path: '/innovation', label: 'Innovation', icon: Sparkles, accent: '#437a22' },
      { path: '/glossar', label: 'Glossar', icon: BookMarked, accent: '#437a22' },
    ],
  },
  {
    title: 'Produkt',
    items: [{ path: '/prototyp', label: 'Prototyp', icon: Smartphone, accent: '#964219' }],
  },
]
