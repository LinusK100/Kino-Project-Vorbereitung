import type { ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────
// Domain content types (Doku v5.1)
// ─────────────────────────────────────────────────────────────

export type Priority = 'high' | 'medium' | 'low'
export type ReleaseNumber = 1 | 2 | 3
export type Mode = 'einfach' | 'erweitert'
export type Theme = 'light' | 'dark'

export interface Persona {
  id: string
  name: string
  role: string
  age: number
  avatar: string
  color: string
  tier: 'basis' | 'erweitert'
  group: string
  roleEnum: string
  umbrella?: boolean
  refinedBy?: string[]
  refines?: string | null
  background: string
  goals: string[]
  frustrations: string[]
  motto: string
}

export interface UserStory {
  id: string
  persona: string
  priority: Priority
  release: ReleaseNumber
  activity: string
  title: string
  story: string
  acceptanceCriteria: string[]
}

export interface StoryMapStep {
  id: string
  name: string
  stories: string[]
}
export interface StoryMapActivity {
  id: string
  name: string
  icon: string
  steps: StoryMapStep[]
}
export interface Release {
  id: number
  name: string
  color: string
  borderColor: string
}
export interface StoryMap {
  title: string
  releases: Release[]
  activities: StoryMapActivity[]
}

// ── UML class diagram ──
export interface UmlAttribute { visibility: string; name: string; type: string }
export interface UmlMethod { visibility: string; name: string; params: string; returnType: string }
export interface UmlClass {
  id: string
  group: 'domain' | 'service' | 'store' | 'dto' | 'enum'
  stereotype: string | null
  implementedInPrototype: boolean
  attributes: UmlAttribute[]
  methods: UmlMethod[]
  values?: string[]
}
export interface UmlRelationship {
  id: string
  type: 'association' | 'composition' | 'dependency' | 'inheritance'
  from: string
  to: string
  label?: string
  fromMultiplicity?: string
  toMultiplicity?: string
}
export interface UmlGroup { id: string; label: string; color: string }
export interface UmlDiagram {
  title: string
  subtitle: string
  groups: UmlGroup[]
  classes: UmlClass[]
  relationships: UmlRelationship[]
}

// ── Sequence diagrams ──
export interface SeqParticipant { id: string; label: string; kind: 'actor' | 'control' | 'entity'; umlClass?: string }
export interface SeqMessage {
  id: string; seq: string; from: string; to: string
  type: 'sync' | 'return' | 'create' | 'self'
  label: string; stateEffect?: string; stories?: string[]
}
export interface SeqOperand { guard: string; messageRefs: string[] }
export interface SeqFragment { id: string; kind: 'alt' | 'opt' | 'break'; label: string; operands: SeqOperand[] }
export interface SequenceDiagram {
  id: string; title: string; description: string; stories?: string[]
  participants: SeqParticipant[]; messages: SeqMessage[]; fragments: SeqFragment[]
}

// ── State machines ──
export interface SmState {
  id: string; label: string; kind: 'initial' | 'normal' | 'final'
  color?: string; description?: string; invariants?: string[]
  relations?: Record<string, string>
}
export interface SmTransition {
  id: string; from: string; to: string
  event: string; guard?: string; action?: string; actor?: string; note?: string
  relatedClasses?: string[]
}
export interface StateMachine {
  id: string; title: string; context: string; statusEnum: string
  initial: string; description: string
  states: SmState[]; transitions: SmTransition[]
}

// ── Innovation ──
export interface Innovation {
  id: string; name: string; icon: string; tier: 'basis' | 'erweitert'
  persona: string; personaLabel: string; stories: string[]; umlClasses: string[]
  feasibility: 'machbar' | 'teilweise' | 'konzept'
  status: 'roadmap' | 'konzept'
  impact: number; effort: number
  summary: string; detail: string; note: string
}

// ─────────────────────────────────────────────────────────────
// Presentation engine (Kino-Modus: Vollbild-Folien auf Schwarz)
// ─────────────────────────────────────────────────────────────
export interface PresentationStep {
  id: string
  title: string            // Folien-Überschrift
  body: string             // Kernaussage der Folie
  points?: string[]        // optionale Aufzählung, gestaffelt animiert
  visual?: ReactNode       // abschnittsspezifisches Visual (aus JSON gerendert),
                           // z. B. ein Diagramm-Ausschnitt — Text wird zur Bildunterschrift
}
