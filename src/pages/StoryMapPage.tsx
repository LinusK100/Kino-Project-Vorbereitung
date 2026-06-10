import { useState } from 'react'
import { motion } from 'motion/react'
import { pageVariants } from '@/lib/transitions'
import { PageHeader } from '@/components/shared/PageHeader'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import storyMapData from '@/data/storyMap.json'
import storiesData from '@/data/userStories.json'
import personasData from '@/data/personas.json'
import type { UserStory, Persona, ReleaseNumber } from '@/types'
import { Ticket, ScanLine, Calendar, UserCircle, Settings, CheckCircle2, Search, LayoutGrid } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

const stories = storiesData as UserStory[]
const personas = personasData as Persona[]

const iconMap: Record<string, React.ElementType> = {
  ticket: Ticket,
  'scan-line': ScanLine,
  calendar: Calendar,
  'user-circle': UserCircle,
  settings: Settings,
  search: Search,
  'layout-grid': LayoutGrid,
}

const activityColors = [
  '#01696f', '#006494', '#7a39bb', '#437a22', '#a13544', '#964219', '#2d6a8c',
]

const releaseConfig: Record<number, {
  bg: string; bgDark: string; border: string; borderDark: string
  text: string; textDark: string; label: string; dot: string
}> = {
  1: { bg: '#e4f5ed', bgDark: '#1a3d28', border: '#437a22', borderDark: '#2d6b44', text: '#165c35', textDark: '#6ee7a8', label: 'Release 1 – MVP', dot: '#437a22' },
  2: { bg: '#fef7de', bgDark: '#3f2d00', border: '#d19900', borderDark: '#b07d00', text: '#7a5400', textDark: '#fbbf24', label: 'Release 2 – Erweiterung', dot: '#d19900' },
  3: { bg: '#fde8e1', bgDark: '#3f1210', border: '#a13544', borderDark: '#c0404f', text: '#9e2f14', textDark: '#f87171', label: 'Release 3 – Vollausbau', dot: '#a13544' },
}

const priorityDot: Record<string, string> = {
  high: '#ef4444', medium: '#f59e0b', low: '#22c55e',
}

function StoryCard({
  story,
  persona,
  acColor,
  rc,
  isDark,
  onClick,
}: {
  story: UserStory
  persona: Persona | null
  acColor: string
  rc: typeof releaseConfig[1]
  isDark: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const cardBg = isDark
    ? hovered ? '#2a2a2a' : '#1e1e1e'
    : hovered ? rc.bg : 'white'
  const cardBorder = isDark ? rc.borderDark : rc.border
  const textColor = isDark ? '#e5e7eb' : '#1a1a1a'

  return (
    <button
      className="w-full text-left rounded-lg p-2 transition-all duration-150"
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderLeft: `3px solid ${cardBorder}`,
        boxShadow: hovered ? '0 3px 8px rgba(0,0,0,0.18)' : '0 1px 2px rgba(0,0,0,0.08)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono font-bold text-xs" style={{ color: acColor }}>
          {story.id}
        </span>
        <div className="flex items-center gap-1">
          {persona && (
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ background: persona.color, fontSize: '8px' }}
            >
              {persona.avatar[0]}
            </div>
          )}
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: priorityDot[story.priority] }} />
        </div>
      </div>
      <p className="text-xs leading-snug" style={{ color: textColor }}>
        {story.title}
      </p>
    </button>
  )
}

export default function StoryMapPage() {
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null)
  const [activeRelease, setActiveRelease] = useState<ReleaseNumber | null>(null)
  const { theme } = useAppStore()
  const isDark = theme === 'dark'

  const getPersona = (id: string) => personas.find(p => p.id === id)

  const totalStories = stories.length
  const storyCountByRelease = [1, 2, 3].map(r => stories.filter(s => s.release === r).length)

  // Pre-compute fixed row height per release so all cells in a row are identical height
  const rowHeights = Object.fromEntries(
    ([1, 2, 3] as ReleaseNumber[]).map((r) => {
      const maxCards = Math.max(
        ...storyMapData.activities.flatMap(a =>
          a.steps.map(s =>
            stories.filter(st => s.stories.includes(st.id) && st.release === r).length
          )
        ),
        1
      )
      return [r, 16 + maxCards * 62 + Math.max(maxCards - 1, 0) * 6]
    })
  ) as Record<ReleaseNumber, number>

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="Story Map"
        description="Aktivitäten, Steps und Stories nach Releases"
      />

      {/* Stats + Legend */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {([1, 2, 3] as ReleaseNumber[]).map((r) => {
          const rc = releaseConfig[r]
          const isActive = activeRelease === r
          return (
            <button
              key={r}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150"
              style={{
                background: isActive ? rc.dot : 'var(--card-bg)',
                color: isActive ? '#fff' : rc.text,
                borderColor: isActive ? rc.dot : rc.border,
              }}
              onClick={() => setActiveRelease(isActive ? null : r)}
              aria-pressed={isActive}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: isActive ? 'white' : rc.dot }}
              />
              {rc.label}
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : `${rc.dot}20`,
                  color: isActive ? 'white' : rc.dot,
                }}
              >
                {storyCountByRelease[r - 1]}
              </span>
            </button>
          )
        })}

        <div
          className="ml-auto text-xs px-3 py-1.5 rounded-full"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
        >
          {totalStories} Stories gesamt
        </div>
      </div>

      {/* Scroll hint */}
      <div className="flex items-center gap-1.5 mb-3 text-xs font-medium px-2 py-1.5 rounded-lg w-fit"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
      >
        <span>←</span>
        <span>Horizontal scrollen</span>
        <span style={{ color: 'var(--border-color)' }}>·</span>
        <span>Klick auf Story für Details</span>
        <span>→</span>
      </div>

      <div className="overflow-x-auto pb-4 rounded-xl" style={{ border: '1px solid var(--border-color)' }}>
        <TooltipProvider>
          <div className="inline-flex min-w-max">

            {/* ── H: Sticky Release-Row labels ── */}
            <div
              className="flex flex-col flex-shrink-0"
              style={{
                position: 'sticky',
                left: 0,
                zIndex: 20,
                background: 'var(--card-bg)',
              }}
            >
              {/* Spacer for Activity + Step rows */}
              <div style={{ height: '48px', background: isDark ? '#111' : '#f8f8f8' }} />
              <div style={{ height: '40px', background: isDark ? '#111' : '#f8f8f8', borderBottom: '1px solid var(--border-color)' }} />
              {([1, 2, 3] as ReleaseNumber[]).map((r) => {
                const rc = releaseConfig[r]
                const bandBg = isDark ? rc.bgDark : rc.bg
                const bandBorder = isDark ? rc.borderDark : rc.border
                const bandText = isDark ? rc.textDark : rc.text
                return (
                  <div
                    key={r}
                    className="flex items-center justify-center px-2"
                    style={{
                      height: `${rowHeights[r as ReleaseNumber]}px`,
                      background: bandBg,
                      borderTop: `1px solid ${bandBorder}`,
                      writingMode: 'vertical-lr',
                      transform: 'rotate(180deg)',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: bandText,
                      width: '36px',
                    }}
                  >
                    {rc.label}
                  </div>
                )
              })}
            </div>

            {/* Main map */}
            {storyMapData.activities.map((activity, actIdx) => {
              const Icon = iconMap[activity.icon] ?? Ticket
              const acColor = activityColors[actIdx % activityColors.length]

              return (
                <div key={activity.id} className="flex flex-col" style={{ borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
                  {/* Activity header */}
                  <div
                    className="flex items-center gap-2 px-4 font-bold text-xs text-white uppercase tracking-wider"
                    style={{
                      background: acColor,
                      width: `${activity.steps.length * 190}px`,
                      minWidth: `${activity.steps.length * 190}px`,
                      height: '48px',
                      borderRight: '2px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <Icon size={14} />
                    <span>{activity.name}</span>
                  </div>

                  {/* Steps + stories */}
                  <div className="flex flex-1">
                    {activity.steps.map((step) => (
                      <div key={step.id} className="flex flex-col" style={{ width: '190px' }}>
                        {/* Step header */}
                        <div
                          className="flex items-center px-3 font-semibold text-xs"
                          style={{
                            height: '40px',
                            background: `${acColor}22`,
                            borderRight: '1px solid var(--border-color)',
                            borderBottom: '1px solid var(--border-color)',
                            color: acColor,
                          }}
                        >
                          {step.name}
                        </div>

                        {/* ── A+B: Release bands with correct dark-mode background ── */}
                        {([1, 2, 3] as ReleaseNumber[]).map((r) => {
                          const rc = releaseConfig[r]
                          const band = stories.filter(
                            s => step.stories.includes(s.id) && s.release === r
                          )
                          const dimmed = activeRelease !== null && activeRelease !== r
                          const bandBg = isDark ? rc.bgDark : rc.bg
                          const bandBorder = isDark ? rc.borderDark : rc.border

                          return (
                            <div
                              key={r}
                              className="p-2 flex flex-col gap-1.5"
                              style={{
                                background: bandBg,
                                borderRight: '1px solid var(--border-color)',
                                borderBottom: '1px solid var(--border-color)',
                                height: `${rowHeights[r as ReleaseNumber]}px`,
                                overflow: 'hidden',
                                opacity: dimmed ? 0.3 : 1,
                                transition: 'opacity 0.2s',
                              }}
                            >
                              {band.map((story) => {
                                const persona = getPersona(story.persona)
                                return (
                                  <Tooltip key={story.id}>
                                    <TooltipTrigger asChild>
                                      <StoryCard
                                        story={story}
                                        persona={persona ?? null}
                                        acColor={acColor}
                                        rc={rc}
                                        isDark={isDark}
                                        onClick={() => setSelectedStory(story)}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-72 text-xs">
                                      <p className="font-semibold mb-1">{story.title}</p>
                                      <p className="leading-relaxed">{story.story}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )
                              })}

                              {/* ── F: Tooltip on empty cells ── */}
                              {band.length === 0 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex-1 flex items-center justify-center py-3 cursor-default">
                                      <div
                                        className="w-full rounded-md"
                                        style={{
                                          height: '28px',
                                          border: `1.5px dashed ${bandBorder}`,
                                          opacity: 0.35,
                                        }}
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    Keine Story in {rc.label} geplant
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </TooltipProvider>
      </div>

      {/* Priority legend */}
      <div className="flex items-center gap-5 mt-4">
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Priorität:</span>
        {Object.entries(priorityDot).map(([k, c]) => (
          <div key={k} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: c }} />
            {k === 'high' ? 'Hoch' : k === 'medium' ? 'Mittel' : 'Niedrig'}
          </div>
        ))}
      </div>

      {/* Story Detail Sheet */}
      <Sheet open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <SheetContent
          className="w-full sm:max-w-lg overflow-y-auto"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          {selectedStory && (() => {
            const persona = getPersona(selectedStory.persona)
            const rc = releaseConfig[selectedStory.release]
            return (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-sm font-bold" style={{ color: '#01696f' }}>
                      {selectedStory.id}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: rc.bg, color: rc.text, border: `1px solid ${rc.border}` }}
                    >
                      {rc.label}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: `${priorityDot[selectedStory.priority]}20`,
                        color: priorityDot[selectedStory.priority],
                      }}
                    >
                      {selectedStory.priority === 'high' ? 'Hohe' : selectedStory.priority === 'medium' ? 'Mittlere' : 'Niedrige'} Priorität
                    </span>
                  </div>
                  <SheetTitle style={{ color: 'var(--text-primary)' }}>{selectedStory.title}</SheetTitle>
                </SheetHeader>

                <div className="space-y-5 mt-5">
                  <div
                    className="p-4 rounded-xl text-sm italic leading-relaxed"
                    style={{
                      background: 'rgba(1,105,111,0.05)',
                      borderLeft: '3px solid #01696f',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {selectedStory.story}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Akzeptanzkriterien
                    </h4>
                    <ul className="space-y-2">
                      {selectedStory.acceptanceCriteria.map((c, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                          <CheckCircle2 size={16} style={{ color: '#437a22', flexShrink: 0, marginTop: '2px' }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Aktivität
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{selectedStory.activity}</p>
                  </div>

                  {persona && (
                    <div
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: `${persona.color}10`, border: `1px solid ${persona.color}30` }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: persona.color }}
                      >
                        {persona.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{persona.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{persona.role}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}
