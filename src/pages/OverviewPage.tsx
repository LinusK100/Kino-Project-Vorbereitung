import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Users, ListChecks, Map, Smartphone, ArrowRight, Layers } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { WhiteboardCard } from '@/components/shared/WhiteboardCard'
import { pageVariants, containerVariants, cardVariants } from '@/lib/transitions'
import personas from '@/data/personas.json'
import userStories from '@/data/userStories.json'
import storyMapData from '@/data/storyMap.json'

const kpis = [
  { label: 'Personas', value: personas.length, icon: Users, color: '#01696f', path: '/personas' },
  { label: 'User Stories', value: userStories.length, icon: ListChecks, color: '#006494', path: '/user-stories' },
  { label: 'Releases', value: storyMapData.releases.length, icon: Layers, color: '#437a22', path: '/story-map' },
  { label: 'Aktivitäten', value: storyMapData.activities.length, icon: Map, color: '#7a39bb', path: '/story-map' },
]

const quickLinks = [
  { path: '/personas', label: 'Personas', icon: Users, desc: '6 Nutzerprofile' },
  { path: '/user-stories', label: 'User Stories', icon: ListChecks, desc: '30 Anforderungen' },
  { path: '/story-map', label: 'Story Map', icon: Map, desc: '5 Aktivitäten' },
  { path: '/prototype', label: 'Prototyp', icon: Smartphone, desc: '5 Screens' },
]

export default function OverviewPage() {
  const releaseColors = ['#437a22', '#d19900', '#a13544']

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Hero */}
      <div className="mb-8 rounded-2xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #01696f 0%, #006494 100%)' }}>
        <div className="relative z-10">
          <p className="text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Projektdokumentation</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            CineTicket System
          </h1>
          <p className="text-sm md:text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Vollständige Projektdokumentation für das Kino-Ticketsystem mit Personas, User Stories, Story Map und interaktivem Prototyp.
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 hidden md:block">
          <Smartphone size={120} color="white" />
        </div>
      </div>

      <PageHeader title="Projektübersicht" description="Dashboard mit allen wichtigen Kennzahlen" />

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <motion.div key={kpi.label} variants={cardVariants}>
              <Link to={kpi.path} className="block">
                <WhiteboardCard className="hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${kpi.color}15` }}
                    >
                      <Icon size={18} style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{ color: kpi.color }}>
                    {kpi.value}
                  </div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {kpi.label}
                  </div>
                </WhiteboardCard>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Release Timeline */}
      <WhiteboardCard className="mb-8">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Release Timeline</h3>
        <div className="flex gap-2 mb-3">
          {storyMapData.releases.map((release, i) => (
            <div key={release.id} className="flex-1">
              <div
                className="h-2 rounded-full mb-2"
                style={{ background: releaseColors[i] }}
              />
              <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                {release.name}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {userStories.filter(s => s.release === release.id).length} Stories
              </div>
            </div>
          ))}
        </div>
        <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'var(--border-color)' }}>
          {storyMapData.releases.map((release, i) => {
            const count = userStories.filter(s => s.release === release.id).length
            const pct = (count / userStories.length) * 100
            return (
              <div
                key={release.id}
                style={{ width: `${pct}%`, background: releaseColors[i] }}
              />
            )
          })}
        </div>
      </WhiteboardCard>

      {/* Quick Links */}
      <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Schnellzugriff</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.path} to={link.path}>
              <WhiteboardCard className="hover:shadow-md transition-all duration-200 hover:border-[#01696f] group">
                <Icon size={22} style={{ color: '#01696f' }} className="mb-3" />
                <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{link.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{link.desc}</div>
                <ArrowRight size={14} className="mt-3 group-hover:translate-x-1 transition-transform" style={{ color: '#01696f' }} />
              </WhiteboardCard>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
