// Typed content registry — single source of truth (Doku v5.1).
// Mode-aware selectors return the basis (einfach) or erweitert dataset.

import { useMode } from '@/store/appStore'
import type {
  Persona, UserStory, StoryMap, UmlDiagram, SequenceDiagram,
  StateMachine, TraceEntry, Innovation, GlossaryCategory,
} from '@/types'

import personasBasis from './personas.basis.json'
import personasErweitert from './personas.erweitert.json'
import storiesBasis from './stories.basis.json'
import storiesErweitert from './stories.erweitert.json'
import storymapBasis from './storymap.basis.json'
import storymapErweitert from './storymap.erweitert.json'
import umlRaw from './uml.json'
import sequencesRaw from './sequences.json'
import statesRaw from './states.json'
import traceabilityRaw from './traceability.json'
import innovationRaw from './innovation.json'
import glossaryRaw from './glossary.json'
import prototypeRaw from './prototype.json'

export const personas = {
  basis: personasBasis as Persona[],
  erweitert: personasErweitert as Persona[],
}
export const stories = {
  basis: storiesBasis as UserStory[],
  erweitert: storiesErweitert as UserStory[],
}
export const storyMaps = {
  basis: storymapBasis as StoryMap,
  erweitert: storymapErweitert as StoryMap,
}

export const uml = (umlRaw as { diagram: UmlDiagram }).diagram
export const sequences = (sequencesRaw as { diagrams: SequenceDiagram[] }).diagrams
export const stateMachines = (statesRaw as { machines: StateMachine[]; crossLinks: { id: string; trigger: string; effect: string; classes: string[] }[] })
export const traceability = traceabilityRaw as {
  stats: { stories: number; implementiert: number; roadmap: number }
  entries: TraceEntry[]
}
export const innovation = innovationRaw as {
  title: string; subtitle: string
  legend: { feasibility: Record<string, string>; status: Record<string, string> }
  innovations: Innovation[]
}
export const glossary = glossaryRaw as {
  title: string; subtitle: string
  categories: GlossaryCategory[]
  roles: { role: string; personas: string; area: string }[]
}
export const prototype = prototypeRaw as {
  beschreibung: string
  stats: { rollenImplementiert: number; rollenGesamt: number; umlImplementiert: number; umlDesignOnly: number; storiesImplementiert: number }
  module: { id: string; rolle: string; name: string; status: string; beschreibung: string; stories: string[]; umlClasses: string[] }[]
  roadmap: { modul: string; rolle: string; persona: string; stories: string[]; umlClasses: string[] }[]
}

// All personas keyed by id (full set) — used for avatar/color lookups everywhere.
export const personaById: Record<string, Persona> = Object.fromEntries(
  (personasErweitert as Persona[]).map((p) => [p.id, p]),
)
// Some datasets (traceability) reference personas by display name.
export const personaByName: Record<string, Persona> = Object.fromEntries(
  (personasErweitert as Persona[]).map((p) => [p.name, p]),
)

// ── Mode-aware hooks ──
// UI mode 'einfach' -> dataset 'basis', 'erweitert' -> 'erweitert'.
const tierForMode = (m: 'einfach' | 'erweitert') => (m === 'einfach' ? 'basis' : 'erweitert')

export function usePersonas(): Persona[] {
  return personas[tierForMode(useMode())]
}
export function useStories(): UserStory[] {
  return stories[tierForMode(useMode())]
}
export function useStoryMap(): StoryMap {
  return storyMaps[tierForMode(useMode())]
}
