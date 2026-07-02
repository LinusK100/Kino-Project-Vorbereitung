# Fortschritt — CineTicket Doku-Website Umbau

> Lebende Checkliste. Bei jedem Arbeitsschritt aktualisieren.

## Legende
- [x] erledigt · [~] in Arbeit · [ ] offen

## Phase 0 — Setup
- [x] Bestand analysiert (Website + Doku v5.1)
- [x] Build repariert (fehlende native Bindings: rolldown, lightningcss, oxide)
- [x] Entscheidung Verbessern-statt-Neubau dokumentiert
- [x] Plan + Checkpoint-Dateien (REFACTORING_PLAN, PROGRESS, ARCHITECTURE, CONTENT_MAPPING)
- [x] Screenshot-Tooling (Playwright + System-Chrome, tools/shoot im scratchpad)

## Phase 1 — Foundation
- [x] Daten aus Doku v5.1 nach src/data migriert (basis + erweitert, alle Abschnitte)
- [x] Content-Index `src/data/content.ts` (typisiert, modusabhängig, mode→tier-Mapping)
- [x] `useMode` / store (einfach/erweitert, persistent via zustand persist)
- [x] Theme-Persistenz + System-Default
- [x] Gruppierte Sidebar + Routen (11 Abschnitte)
- [x] `SectionShell` + `Callout` + `ErrorBoundary`
- [x] `ModeToggle`
- [x] `PresentationEngine` (manuell + auto, Spotlight + Caption, Tastatur)

## Phase 2 — Anforderungen
- [x] Personas (basis 4 / erweitert 12) + Präsentation
- [x] User Stories (30 / 51) + Verteilungs-Bars + Präsentation
- [x] Story Map (7 / 10 Aktivitäten) + Release-Bänder + Präsentation
- [x] Gliederung/Design der drei konsistent (verifiziert per Screenshot)

## Phase 3 — Modellierung
- [x] Klassendiagramm-Renderer (elkjs-Layout, UML-Boxen, Operationen an Objekten, Kern/Gruppen/Alle, Detail-Drawer)
- [x] Sequenzdiagramme (4 Flows, Lebenslinien, Badges, Fragmente in Erweitert)
- [x] Zustandsdiagramme (Sitz, Ticket + Buchung/Zahlung als Enum-Automaten, Cross-Links)
- [x] DiagramFrame (Zoom, Als-Text-Alternative, Legende)
- [x] Build grün (tsc + vite)
- [~] Feinpolitur Diagramm-Lesbarkeit (in Phase 6 QA)

## Phase 4 — Synthese
- [x] Dashboard als Onboarding/Erklärung (Aufbau + Bedienung + Modi + Präsentation)
- [x] Traceability-Matrix (Story↔Persona↔Aktivität↔Release↔UML↔Prototyp)
- [x] Innovation-Abschnitt (Machbarkeits-Flags machbar/teilweise/Konzept)
- [x] Glossar (Suche, Kernbegriffe, verwechselte Paare, Rollen)

## Phase 5 — Produkt
- [x] Prototyp-Seite auf SectionShell, externer Start (neuer Tab) nur hier
- [x] Persona-Konsistenz im Prototyp (Jonas/Student statt Lena)
- [x] Alte ungenutzte Dateien identifiziert (personas.json/userStories.json/storyMap.json, PageHeader/WhiteboardCard/BadgePriority)
- [~] Voller Konsistenz-Pass läuft in Phase 6

## Phase 6 — QA
- [x] Screenshot-Durchlauf alle 11 Abschnitte × Modus × Theme (Light + Dark)
- [x] Präsentationsmodus getestet (Spotlight + Caption + Auto)
- [x] Diagramm-Lesbarkeit final (State/Sequence/Class, auch „Alle 82")
- [x] Build grün; Lint nur noch 2 vorbestehende shadcn-Warnungen (ui/badge, ui/button)
- [x] Tote Dateien entfernt (alte JSON, PageHeader/WhiteboardCard/BadgePriority, index.css, App.css)
- [x] react-hooks-Sauberkeit (render-time Reset statt setState-in-effect)

## Phase 7 — Bewertungs-Readiness (Nachtrag)
- [x] Echten Prototyp gebaut & unter `public/prototyp-app/` eingebettet (Launch-Button
      öffnet ihn im Build/Preview/Pages; MSW-Mock läuft)
- [x] Diagramme „fit-on-load": Klasse/Sequenz/Zustand passen sich beim Laden in den
      Rahmen ein → sofortige Übersicht, dann Zoom/„Als Text" für Details
- [x] Präsentations-Tour end-to-end getestet (inkl. Modus-Wechsel-Schritte)
- [x] Cleanup: stray `@/`-Ordner entfernt, tote Dateien weg; Lint nur noch 2 shadcn-Hinweise

## Phase 8 — Externes Review & Politur (2026-07-02)
- [x] Automatisierte Inhalts-Validierung (0 Fehler) + Playwright-Audit; Ergebnisse in
      [`REVIEW_REPORT.md`](./REVIEW_REPORT.md)
- [x] UML: Initial-Pfeil im Sitz-Automaten, Aktivierungsbalken in Sequenzdiagrammen
- [x] Fix: Crash bei Klassendiagramm-Ansichtswechsel (Enums u. a.), Fit-on-load „Alle 82"
- [x] Inhalt: Roadmap-Module im Prototyp-Erweitert, „Hohe/Mittlere Priorität", KPI 9,
      Smile-2-Poster (404) im Prototyp-Bundle
- [x] Lint vollständig grün (public/ ignoriert, ui/-Ausnahme, Hook-Deps sauber)

## Changelog
- 2026-06-29: Projektstart, Analyse, Build-Fix, Plan erstellt.
- 2026-06-29: Phase 1 Foundation + Phase 2 Anforderungen fertig & per Screenshot verifiziert
  (Personas/Stories/StoryMap auf SectionShell, Einfach/Erweitert, Präsentationsmodus).
- 2026-06-29: Phase 3 Diagramme (Klasse/Sequenz/Zustand) nativ als SVG, JSON-getrieben.
- 2026-06-29: Phase 4 Dashboard/Traceability/Innovation/Glossar.
- 2026-06-29: Phase 5 Prototyp (externer Start im neuen Tab) + Konsistenz.
- 2026-06-29: Phase 6 QA-Sweep Light/Dark, Cleanup, Lint/Build grün. ALLE PHASEN FERTIG.
- 2026-07-02: Phase 8 Review-Pass: UML-Notation (Initial-Pfeil, Aktivierungen),
  Klassendiagramm-Crash + Fit behoben, Prototyp-Roadmap sichtbar, Sprach-/KPI-Fixes,
  Lint 0 Probleme. Details in REVIEW_REPORT.md.
- 2026-07-02: Prototyp-Seite verschlankt: alter In-Page-iPhone-Mockup (6 Screens,
  hartkodiert) entfernt; die Seite führt jetzt direkt zum echten Prototyp (neuer Tab)
  und zeigt JSON-getrieben Kennzahlen, Rollen, Wizard-Schritte, Technik und Roadmap.
- 2026-07-02: Präsentationsmodus als „Kino" neu gebaut: Vollbild auf Schwarz mit
  Akzent-Projektorschein, animierte selbsterklärende Folien (Blur/Fade/Stagger,
  optionale Aufzählungspunkte) statt DOM-Spotlight; Folien-Inhalte aller 9 Abschnitte
  neu geschrieben. Dashboard reduziert: Hero mit Kennzahlen-Chips, drei Kernkarten
  (Präsentationsmodus, Inhalte als JSON→SVG, Einfach/Erweitert), Abschnitts-Verzeichnis.
- 2026-07-02: Kino-Modus v2 — jede Sektion mit eigenen visuellen Folien statt
  Einheitstext: echte Diagramm-Ausschnitte (UML-Klassen mit Original-Attributen/
  -Operationen, Sequenz-Nachrichten mit Statuswechsel-Badges, Zustandsautomaten
  mit animierten Kanten) direkt aus den JSON-Daten gerendert; dazu Persona-Karten,
  U47-Story-Karte, Verteilungs-Balken, Backbone/Release-Bänder, Rollen-Grid,
  Wizard-Stepper, Impact/Aufwand-Matrix, JSON→SVG-Pipeline. 39 Folien × Playwright
  verifiziert (0 Fehler), Build/Lint grün.
