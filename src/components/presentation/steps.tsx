// Brücke zwischen den Präsentations-JSON (src/data/presentations/*.json) und den
// Folien-Visuals. Der Folien-TEXT lebt als JSON (einheitlich mit dem Rest der
// Daten); das Visual kann kein JSON sein (React/SVG), daher verweist eine
// Kennung auf diese Registry. Berechnete Zahlen bleiben in den Visuals — im
// JSON steht nie eine hartkodierte Zahl.
import { useMemo, type ReactNode } from 'react'
import { useMode } from '@/store/appStore'
import type { PresentationStep, RawPresentationStep, PresentationVisualSpec, PresentationData } from '@/types'
import { DreiStationen, JsonZuSvg, TeilmengeModi, InnovationsMatrix, IdeeVerankert } from './visuals/product'
import { PersonaKern, PersonaBaum, ZieleFrustrationen, StorySchema, StoryKarte, StoryVerteilung, BackboneChips, ReleaseBaender } from './visuals/people'
import { FlowUebersicht, SeqAusschnitt, SitzHappyPath, SitzRueckwege, TicketZyklus, BuchungZyklus, ZahlungZyklus } from './visuals/flow'
import { UmlBuchungsmodell, UmlVorstellungSitz, UmlBuchungskette, UmlKomposition, UmlServices, UmlVererbung, EnumAbgleich } from './visuals/uml'

import overview from '@/data/presentations/overview.json'
import personas from '@/data/presentations/personas.json'
import userStories from '@/data/presentations/user-stories.json'
import storyMap from '@/data/presentations/story-map.json'
import klassendiagramm from '@/data/presentations/klassendiagramm.json'
import sequenzdiagramme from '@/data/presentations/sequenzdiagramme.json'
import zustandsdiagramme from '@/data/presentations/zustandsdiagramme.json'
import innovation from '@/data/presentations/innovation.json'
import arbeitsweise from '@/data/presentations/arbeitsweise.json'

type P = Record<string, unknown> | undefined
type Tier = 'basis' | 'erweitert'

const VISUALS: Record<string, (p: P) => ReactNode> = {
  dreiStationen: () => <DreiStationen />,
  jsonZuSvg: () => <JsonZuSvg />,
  teilmengeModi: () => <TeilmengeModi />,
  innovationsMatrix: (p) => <InnovationsMatrix tier={(p?.tier as Tier) ?? 'erweitert'} />,
  ideeVerankert: () => <IdeeVerankert />,
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
  umlBuchungsmodell: () => <UmlBuchungsmodell />,
  umlVorstellungSitz: () => <UmlVorstellungSitz />,
  umlBuchungskette: () => <UmlBuchungskette />,
  umlKomposition: () => <UmlKomposition />,
  umlServices: () => <UmlServices />,
  umlVererbung: () => <UmlVererbung />,
  enumAbgleich: () => <EnumAbgleich />,
}

function renderVisual(spec?: PresentationVisualSpec): ReactNode {
  if (!spec) return undefined
  const fn = VISUALS[spec.id]
  if (!fn) { console.warn('Unbekanntes Präsentations-Visual:', spec.id); return undefined }
  return fn(spec.props)
}

function resolve(raw: RawPresentationStep[]): PresentationStep[] {
  return raw.map((s) => ({ id: s.id, title: s.title, body: s.body, points: s.points, visual: renderVisual(s.visual) }))
}

const DATA: Record<string, PresentationData> = {
  overview, personas, 'user-stories': userStories, 'story-map': storyMap,
  klassendiagramm, sequenzdiagramme, zustandsdiagramme, innovation, arbeitsweise,
}

// Liefert die Folien eines Abschnitts, modusabhängig aufgelöst.
export function usePresentation(section: keyof typeof DATA | string): PresentationStep[] {
  const mode = useMode()
  return useMemo(() => {
    const data = DATA[section]
    if (!data) return []
    const raw = data.steps ?? (mode === 'einfach' ? data.einfach : data.erweitert) ?? []
    return resolve(raw)
  }, [section, mode])
}
