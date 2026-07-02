# CineTicket Doku-Website — Refactoring-Plan

> **Historisches Planungsdokument (Stand 2026-06-29), teilweise überholt:**
> Traceability und Glossar wurden nach dem Umbau **bewusst wieder entfernt**
> (Owner-Entscheidung — nicht wieder einführen), und der Präsentationsmodus ist
> seit 2026-07-02 der Kino-Modus mit visuellen Folien.
> Aktueller Stand: [`PROGRESS.md`](./PROGRESS.md), Architektur:
> [`ARCHITECTURE.md`](./ARCHITECTURE.md), Inhalts-Mapping:
> [`CONTENT_MAPPING.md`](./CONTENT_MAPPING.md).

## 0. Entscheidung: Verbessern statt Neubau

Die bestehende Website (`Kino_Projekt_Struktur_Website/kino-projekt`) wird
**in-place umgebaut**, nicht neu gebaut. Begründung:

- Stack ist bereits ideal: React 19, Vite (rolldown), Tailwind v4, react-router 7,
  motion, zustand, Radix-UI-Primitives. Build läuft grün.
- Design-System (Whiteboard-Theme, Teal-Palette, DM Sans/Serif, Dark Mode),
  App-Shell und die hochwertigen Personas-/StoryMap-Renderings sind wiederverwendbar.
- Die eigentliche Arbeit ist **Content-Layer (Doku v5.1)** + **Section-Framework**
  (einheitliches Layout, Einfach/Erweitert, Präsentationsmodus) + **native
  Diagramm-Renderer** + neue Abschnitte. Das ist Restrukturierung, kein Greenfield.

## 1. Single Source of Truth

Alle Inhalte stammen aus `CineTicket_Projektdokumentation/` **v5.1** und werden
nach `src/data/` migriert. Pro Abschnitt zwei Ebenen:

| Ebene | Datei-Suffix | UI-Modus |
|---|---|---|
| Basis (MVP, Teilmenge) | `*.json` | **Einfach** |
| Erweitert (Vollausbau) | `*-erweitert.json` | **Erweitert** |

Leitprinzip der Doku: *Basis ⊆ Erweitert*, *Modell ⊇ Prototyp*. Die
Traceability-Matrix verbindet Story ↔ Persona ↔ UML ↔ Prototyp und sichert
Konsistenz. Diese Konsistenz ist Pflicht-Akzeptanzkriterium für jeden Abschnitt.

## 2. Informationsarchitektur (Sidebar)

Gruppierte Navigation — gleiche Kategorie = gleiches Design:

```
Start
  └─ Dashboard            (Onboarding: Aufbau + Bedienung + Modi erklärt)
Anforderungen (Analyse)
  ├─ Personas             basis 4 / erweitert 12
  ├─ User Stories         basis 30 / erweitert 51
  └─ Story Map            basis / erweitert
Modellierung (Entwurf)
  ├─ Klassendiagramm      UML, 82 Klassen / implementierter Kern
  ├─ Sequenzdiagramme     4 Buchungs-Flows
  └─ Zustandsdiagramme    Sitz, Ticket (+ Buchung/Zahlung als Enum-Automaten)
Synthese
  ├─ Traceability         Matrix über alle Ebenen
  ├─ Innovation           Innovations-Layer (mit Machbarkeits-Flags)
  └─ Glossar              einheitliche Begriffe
Produkt
  └─ Prototyp             In-Page-Mockup + Start des echten Prototyps (neuer Tab)
```

## 3. Querschnitts-Features

### 3.1 Einfach/Erweitert-Modus
- Globaler, **persistenter** Modus (zustand + localStorage), prominent in der TopBar.
- Jeder Abschnitt liest den Modus und rendert basis- bzw. erweitert-Daten.
- Genau zwei Stufen pro Abschnitt — keine weiteren Detailtiefen.

### 3.2 Präsentationsmodus (Flagship)
- Pro Abschnitt eine Sequenz von **Schritten** (Slides), die die wichtigsten
  Elemente erklären und hervorheben (Spotlight + Erklärtext).
- Steuerung: **manuell durchklicken** (Vor/Zurück, Pfeiltasten) **oder
  automatisch** (Play/Pause, einstellbares Tempo, Fortschrittsbalken).
- Gemeinsame `PresentationEngine` + `usePresentation`-Hook; jeder Abschnitt
  liefert ein `PresentationStep[]` (Selector/Anchor + Titel + Erklärung + optional
  Modus/Filter-Setzung).
- Esc beendet; respektiert `prefers-reduced-motion`.

### 3.3 Einheitliches Section-Framework
- `SectionShell`: konsistenter Kopf (Titel, Untertitel, Icon, Kategorie-Farbe),
  Intro-Block, Modus-Toggle, Präsentations-Button, Inhaltsbereich, Legende.
- `SectionIntro`, `DiagramFrame` (Zoom/Pan/Legende/Reset für alle Diagramme),
  `Callout` (Hinweise/Innovation/Design-only).

## 4. Diagramm-Rendering (nativ, JSON-getrieben)

Anforderung: schön, übersichtlich, **keine Überlagerungen**, Pfeile sichtbar,
Text lesbar. Format bleibt JSON → daraus wird das Design generiert.

- **Sequenzdiagramme**: deterministisches Layout (Lebenslinien = Spalten,
  Nachrichten = Zeilen). Aktivierungsbalken, Fragmente (alt/opt/break),
  stateEffect-Badges, Story-Chips. Umschalter Happy-Path/Fragmente. Spec:
  `CineTicket_Projektdokumentation/sequenzdiagramm/sequenzdiagramm-darstellung.md`.
- **Zustandsdiagramme**: gerichtetes Layout (Auto-Layout via elkjs **oder**
  kuratierte Koordinaten, da Automaten klein sind). Initial/Final, Self-Loops,
  event[guard]/action-Beschriftung. Enums als eigene Automaten: Sitzstatus,
  Ticketstatus, **zusätzlich** Buchungsstatus, Zahlungsstatus.
- **Klassendiagramm**: gruppierte Layout-Regionen (Domäne/Services/Stores/DTOs/
  Enums). Einfach = implementierter Kern (~Domäne+Services, `implementedInPrototype`).
  Erweitert = alle 82 mit Gruppen-Filter/Collapse. Interaktiv (Zoom/Pan, Klick →
  Detailkarte). Operationen stehen **an den Objekten** (z. B. `VorstellungSitz`:
  reservieren/belegen/freigeben) — als Status-Operationen, nicht an Nutzern. Enums
  separat. Beziehungstypen: composition/association/dependency/inheritance mit
  Multiplizitäten.

### Diagramm-Qualitäts-Checkliste
- [ ] Keine sich überlappenden Knoten/Köpfe.
- [ ] Kein Text, der aus seiner Box/über eine Linie läuft.
- [ ] Jeder Pfeil sichtbar, Beschriftung lesbar (Kontrast ≥ 4.5:1).
- [ ] Konsistente Status-Farbpalette (siehe ARCHITECTURE.md).
- [ ] Funktioniert in Light + Dark, responsive (horizontal scroll statt Umbruch).
- [ ] Textalternative vorhanden (Tabellen/Listen aus JSON).

## 5. Phasen

| Phase | Inhalt | Task |
|---|---|---|
| 0 | Plan, Checkpoints, Screenshot-Tooling | #1 |
| 1 | Foundation: Daten-Layer + Section-Framework + PresentationEngine | #2 |
| 2 | Personas, User Stories, Story Map migrieren | #3 |
| 3 | Native Diagramme: Klasse, Sequenz, Zustand | #4 |
| 4 | Dashboard, Traceability, Innovation, Glossar | #5 |
| 5 | Prototyp-Seite + Konsistenz-Pass | #6 |
| 6 | Visuelle QA-Schleife (Chrome-Screenshots), Politur, Build | #7 |

## 6. Test- & QA-Strategie

- Headless **Google Chrome via Playwright** (`docs/../tools/shoot.mjs`):
  Screenshots je Abschnitt × Modus × Theme + Präsentationsschritte.
- Iterieren: Screenshot ansehen → Mängel beheben → erneut. Besonders Diagramme.
- Abschluss je Phase: `npm run build` grün, `npm run lint` sauber, PROGRESS.md
  aktualisiert, ggf. Git-Commit als Checkpoint.

## 7. Risiken / offene Punkte

- Klassendiagramm mit 82 Klassen ist das größte Lesbarkeits-Risiko → Interaktivität
  + Modus-Reduktion + Gruppen-Filter.
- elkjs als Layout-Dependency (pure JS, keine native Bindings) — nur falls
  kuratierte Koordinaten nicht reichen.
- Innovationen, die im Projektrahmen nicht umsetzbar sind, werden **gekennzeichnet**
  (Badge „Konzept/Design-only") und im Innovation-Abschnitt gebündelt.
