// Brücke zwischen den Präsentations-JSON (src/data/presentations/*.json) und den
// Folien-Visuals. Der Folien-TEXT lebt als JSON (einheitlich mit dem Rest der
// Daten); das Visual kann kein JSON sein (React/SVG), daher verweist eine
// Kennung auf diese Registry. Berechnete Zahlen bleiben in den Visuals — im
// JSON steht nie eine hartkodierte Zahl.
//
// Zwei Deck-Arten:
//  - usePresentation(abschnitt): die Tour EINES Abschnitts (steps der JSON-Datei)
//  - useGesamt(): das Drehbuch gesamt.json — referenziert Abschnitts-Folien
//    („ref": "personas.seiten", optional überschrieben) oder definiert
//    zusammengelegte Folien direkt. Jede Folie kennt ihren Abschnitt für
//    Hintergrund-Route, Akzentfarbe und Timeline.
import { useMemo, type ReactNode } from 'react'
import type {
  PresentationStep, RawPresentationStep, PresentationVisualSpec, PresentationData, GesamtData,
} from '@/types'
import {
  DreiStationen, JsonZuSvg, TeilmengeModi, InnovationsMatrix, IdeeVerankert,
  IdeenListe, RollenLive, LiveDemo, Fundament,
} from './visuals/product'
import { PersonaKern, PersonaBaum, ZieleFrustrationen, StorySchema, StoryKarte, StoryVerteilung, BackboneChips, ReleaseBaender } from './visuals/people'
import { FlowUebersicht, SeqAusschnitt, SitzHappyPath, SitzRueckwege, TicketZyklus, BuchungZyklus, ZahlungZyklus, AutomatenKurz } from './visuals/flow'
import { UmlBuchungsmodell, UmlVorstellungSitz, UmlBuchungskette, UmlKomposition, UmlServices, UmlVererbung, EnumAbgleich } from './visuals/uml'
import { AblaufFlow, WerkzeugChips, DateiChips, ArbeitsweiseKompakt } from './visuals/meta'

import overview from '@/data/presentations/overview.json'
import personas from '@/data/presentations/personas.json'
import userStories from '@/data/presentations/user-stories.json'
import storyMap from '@/data/presentations/story-map.json'
import klassendiagramm from '@/data/presentations/klassendiagramm.json'
import sequenzdiagramme from '@/data/presentations/sequenzdiagramme.json'
import zustandsdiagramme from '@/data/presentations/zustandsdiagramme.json'
import innovation from '@/data/presentations/innovation.json'
import arbeitsweise from '@/data/presentations/arbeitsweise.json'
import prototyp from '@/data/presentations/prototyp.json'
import gesamt from '@/data/presentations/gesamt.json'

type P = Record<string, unknown> | undefined
type Tier = 'basis' | 'erweitert'

const VISUALS: Record<string, (p: P) => ReactNode> = {
  dreiStationen: () => <DreiStationen />,
  jsonZuSvg: () => <JsonZuSvg />,
  teilmengeModi: () => <TeilmengeModi />,
  innovationsMatrix: (p) => <InnovationsMatrix tier={(p?.tier as Tier) ?? 'erweitert'} />,
  ideeVerankert: () => <IdeeVerankert />,
  ideenListe: (p) => <IdeenListe gruppe={(p?.gruppe as 'nah' | 'vision') ?? 'nah'} />,
  rollenLive: () => <RollenLive />,
  liveDemo: () => <LiveDemo />,
  fundament: () => <Fundament />,
  personaKern: () => <PersonaKern />,
  personaBaum: () => <PersonaBaum />,
  zieleFrustrationen: (p) => <ZieleFrustrationen id={p?.id as string} />,
  storySchema: () => <StorySchema />,
  storyKarte: (p) => <StoryKarte id={p?.id as string} />,
  storyVerteilung: (p) => <StoryVerteilung tier={(p?.tier as Tier) ?? 'basis'} />,
  backboneChips: (p) => <BackboneChips tier={(p?.tier as Tier) ?? 'basis'} />,
  releaseBaender: (p) => <ReleaseBaender tier={(p?.tier as Tier) ?? 'basis'} />,
  flowUebersicht: () => <FlowUebersicht />,
  seqAusschnitt: (p) => <SeqAusschnitt flow={p?.flow as string} msgSeqs={p?.msgSeqs as string[]} frame={p?.frame as { label: string; guard: string } | undefined} />,
  sitzHappyPath: () => <SitzHappyPath />,
  sitzRueckwege: () => <SitzRueckwege />,
  ticketZyklus: () => <TicketZyklus />,
  buchungZyklus: () => <BuchungZyklus />,
  zahlungZyklus: () => <ZahlungZyklus />,
  automatenKurz: () => <AutomatenKurz />,
  umlBuchungsmodell: () => <UmlBuchungsmodell />,
  umlVorstellungSitz: () => <UmlVorstellungSitz />,
  umlBuchungskette: () => <UmlBuchungskette />,
  umlKomposition: () => <UmlKomposition />,
  umlServices: () => <UmlServices />,
  umlVererbung: () => <UmlVererbung />,
  enumAbgleich: () => <EnumAbgleich />,
  ablaufFlow: () => <AblaufFlow />,
  werkzeugChips: () => <WerkzeugChips />,
  dateiChips: () => <DateiChips />,
  arbeitsweiseKompakt: () => <ArbeitsweiseKompakt />,
}

function renderVisual(spec?: PresentationVisualSpec): ReactNode {
  if (!spec) return undefined
  const fn = VISUALS[spec.id]
  if (!fn) { console.warn('Unbekanntes Präsentations-Visual:', spec.id); return undefined }
  return fn(spec.props)
}

function resolve(raw: RawPresentationStep[]): PresentationStep[] {
  return raw.map((s) => ({
    id: s.id, title: s.title, body: s.body, points: s.points,
    visual: renderVisual(s.visual), kernsatz: s.kernsatz, art: s.art,
  }))
}

const DATA: Record<string, PresentationData> = {
  overview, personas, 'user-stories': userStories, 'story-map': storyMap,
  klassendiagramm, sequenzdiagramme, zustandsdiagramme, innovation, arbeitsweise, prototyp,
}

// ── Abschnitts-Metadaten: Hintergrund-Route, Beschriftung, Akzent ──
export interface SectionMeta { path: string; label: string; kurz: string; accent: string }
export const SECTION_META: Record<string, SectionMeta> = {
  start: { path: '/', label: 'CineTicket', kurz: 'Start', accent: '#01696f' },
  overview: { path: '/', label: 'Überblick', kurz: 'Überblick', accent: '#01696f' },
  personas: { path: '/personas', label: 'Personas', kurz: 'Personas', accent: '#006494' },
  'user-stories': { path: '/user-stories', label: 'User Stories', kurz: 'Stories', accent: '#006494' },
  'story-map': { path: '/story-map', label: 'Story Map', kurz: 'Story Map', accent: '#006494' },
  klassendiagramm: { path: '/klassendiagramm', label: 'Klassendiagramm', kurz: 'Klassen', accent: '#7a39bb' },
  sequenzdiagramme: { path: '/sequenzdiagramme', label: 'Sequenzdiagramme', kurz: 'Sequenzen', accent: '#7a39bb' },
  zustandsdiagramme: { path: '/zustandsdiagramme', label: 'Zustandsdiagramme', kurz: 'Zustände', accent: '#7a39bb' },
  prototyp: { path: '/prototyp', label: 'Prototyp', kurz: 'Prototyp', accent: '#964219' },
  innovation: { path: '/innovation', label: 'Innovation', kurz: 'Innovation', accent: '#437a22' },
  arbeitsweise: { path: '/arbeitsweise', label: 'Arbeitsweise', kurz: 'Projekt', accent: '#64748b' },
  abschluss: { path: '/', label: 'Abschluss', kurz: 'Fazit', accent: '#01696f' },
}

// Liefert die Folien eines Abschnitts. Der Präsentationsmodus hat bewusst
// EINE Quelle — unabhängig vom Einfach/Erweitert-Umschalter der Seite.
export function usePresentation(section: keyof typeof DATA | string): PresentationStep[] {
  return useMemo(() => {
    const data = DATA[section]
    if (!data) return []
    const raw = data.steps ?? data.erweitert ?? data.einfach ?? []
    return resolve(raw)
  }, [section])
}

// ── Gesamt-Präsentation: Drehbuch auflösen ──
export interface GesamtSlide extends PresentationStep { abschnitt: string }

function resolveGesamt(): GesamtSlide[] {
  return (gesamt as GesamtData).folien.map((f, i) => {
    let base: RawPresentationStep | undefined
    if (f.ref) {
      const [sec, id] = f.ref.split('.')
      base = DATA[sec]?.steps?.find((s) => s.id === id)
      if (!base) console.warn('Gesamt-Drehbuch: Referenz nicht gefunden:', f.ref)
    }
    const merged: RawPresentationStep = {
      id: f.id ?? base?.id ?? `folie-${i}`,
      title: f.title ?? base?.title ?? '',
      body: f.body ?? base?.body ?? '',
      points: f.points ?? base?.points,
      visual: f.visual ?? base?.visual,
      kernsatz: f.kernsatz ?? base?.kernsatz,
      art: f.art ?? base?.art,
    }
    return { ...resolve([merged])[0], abschnitt: f.abschnitt }
  })
}

export function useGesamt(): GesamtSlide[] {
  return useMemo(() => resolveGesamt(), [])
}

// Erste Gesamt-Folie eines Abschnitts — für „Gesamte Präsentation ab hier".
// Abschnitte ohne eigene Gesamt-Folien (Überblick, Arbeitsweise) starten vorn.
export function gesamtStartIndex(section: string): number {
  const alias: Record<string, string> = { overview: 'start', arbeitsweise: 'start' }
  const key = alias[section] ?? section
  const idx = (gesamt as GesamtData).folien.findIndex((f) => f.abschnitt === key)
  return idx < 0 ? 0 : idx
}
