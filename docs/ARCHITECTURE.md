# Architektur & Design-System

## Farb-Token (Status, abschnittsübergreifend)

Status-Farben sind **bindend** über Sequenz-, Zustands-, Klassendiagramm und Prototyp:

| Bedeutung | Hex | Verwendung |
|---|---|---|
| FREI / GÜLTIG / ERFOLGREICH / positiv | `#437a22` grün | verfügbar, ok |
| RESERVIERT / AUSSTEHEND / Hold | `#d19900` amber | temporär |
| BELEGT / STORNIERT / FEHLGESCHLAGEN | `#a13544` rot | blockiert/negativ |
| EINGELÖST / BESTÄTIGT | `#006494` blau | abgeschlossen |
| ERSTATTET | `#7a39bb` violett | rückabgewickelt |
| DEFEKT / ABGELAUFEN / neutral | `#64748b` grau | gesperrt/inaktiv |

## Kategorie-Farben (Sidebar-Gruppen / Section-Akzent)

| Gruppe | Akzent |
|---|---|
| Start / Marke | `#01696f` teal (Primary) |
| Anforderungen | `#006494` blau |
| Modellierung | `#7a39bb` violett |
| Synthese | `#437a22` grün |
| Produkt | `#964219` braun-orange |

## UML-Gruppen-Farben (aus Doku)

domain=violet, service=indigo, store=rose, dto=amber, enum=cyan. Wird auf die
Token-Palette gemappt (siehe `src/data/uml.ts`).

## Typografie
- Headlines: `DM Serif Display` (`--font-display`)
- Body/UI: `DM Sans` (`--font-body`)
- Mono (IDs, Code, Enums): `ui-monospace`

## Theme
- Light/Dark via `.dark`-Klasse auf `<html>`. Persistiert in localStorage,
  System-Default beim ersten Laden. Tokens in `src/styles/globals.css`.

## Komponenten-Verträge

### SectionShell
```ts
interface SectionShellProps {
  id: string                 // route key, z.B. 'personas'
  title: string
  subtitle: string
  icon: LucideIcon
  accent: string             // Kategorie-Farbe
  intro: React.ReactNode     // Einleitung (was/warum)
  presentation: PresentationStep[]
  children: React.ReactNode  // Inhalt; reagiert auf useMode()
  legend?: React.ReactNode
}
```

### PresentationStep (Kino-Modus)
```ts
interface PresentationStep {
  id: string
  title: string              // Folien-Überschrift
  body: string               // Kernaussage (bei Visual: Bildunterschrift)
  points?: string[]          // optionale Aufzählung, gestaffelt animiert
  visual?: ReactNode         // abschnittsspezifisches Visual (JSON-gerendert)
}
```
Engine: Vollbild-„Kino" auf Schwarz (radialer Verlauf + Akzent-Schein), animierte
Folien (Blur/Fade/Stagger via motion, respektiert prefers-reduced-motion).
Vor/Zurück (← →), Play/Pause (Leertaste), Tempo, klickbarer Fortschritt mit
Auto-Füllung, Esc beendet. Folien sind selbsterklärend — kein DOM-Spotlight.

Visuals (`src/components/presentation/visuals/`) rendern echte Ausschnitte aus
den JSON-Daten, groß und gestaffelt animiert: `uml.tsx` (UML-Boxen/-Beziehungen
aus uml.json, Gruppen, Impl-Split, Enum-Abgleich), `flow.tsx` (Sequenz- und
Zustands-Ausschnitte aus sequences.json/states.json inkl. Statuswechsel-Badges),
`people.tsx` (Personas, Story-Karte/-Schema/-Verteilung, Backbone, Release-
Bänder), `product.tsx` (Kennzahlen, Stationen, JSON→SVG, Modi-Teilmenge,
Rollen, Wizard, Innovations-Matrix). `core.ts` liefert helle Farbvarianten
(`bright`) und Animations-Presets (`pop`/`draw`/`fadeIn`). Jede Sektion wählt
so ihre eigenen, inhaltsspezifischen Folien.

### DiagramFrame
Gemeinsamer Rahmen für alle Diagramme: Ziehen verschiebt den Ausschnitt
(Klicks bleiben erhalten — erst ab ~5 px Bewegung gilt die Geste als Pan),
Strg/Cmd + Scrollen zoomt an der Cursor-Position, Toolbar mit −/+/Einpassen/100 %,
Fit-on-load via MutationObserver, Legende-Slot, „Als Text"-Umschalter
(Barrierefreiheit). Story Map nutzt dasselbe Drag-Muster über `useDragScroll`.

### Detail-Overlays
Objekt-Details (UML-Klasse, User Story) öffnen als **zentrierter Dialog** über
dem Inhalt (`ui/dialog`, Overlay 40 % + Blur) — nicht als Sheet am Seitenrand.

## Daten-Layer
`src/data/` enthält die JSON aus Doku v5.1. `src/data/index.ts` exportiert
typisierte, modusabhängige Selektoren:
```ts
usePersonas() // -> basis|erweitert je nach useMode()
useStories()
useStoryMap()
// Diagramme sind modusabhängig im Renderer (Filter), Quelle ist je 1 JSON.
```

## Routing
react-router 7, `basename=/Kino-Project-Vorbereitung` (GitHub Pages) bleibt.
Lazy-geladene Seiten pro Abschnitt.
