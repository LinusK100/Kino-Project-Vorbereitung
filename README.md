# CineTicket – Projektdokumentations-Website

Interaktive Dokumentations-Website für das Kino-Ticketsystem **CineTicket**
(Systemanalyse & Entwurf). Sie führt von den Anforderungen bis zum Prototyp –
alle Abschnitte sind aufeinander abgestimmt und einheitlich gestaltet.

> Inhalte = JSON (Single Source of Truth aus `CineTicket_Projektdokumentation` v5.1),
> daraus wird das Design generiert.

## Schnellstart

```bash
npm install
npm run dev      # http://localhost:5173/Kino-Project-Vorbereitung/
npm run build    # tsc + vite build -> dist/
npm run lint
```

> **Native-Binary-Hinweis:** `npm install` lässt auf manchen Macs die nativen
> Binärdateien von `rolldown`, `lightningcss` und `@tailwindcss/oxide` weg
> (nur `package.json` im Paket, keine `.node`-Datei). Symptom: Build bricht mit
> `Cannot find module './…darwin-arm64.node'`. Fix: fehlende `.node` aus dem
> Registry-Tarball (`npm view <pkg>@<ver> dist.tarball`) in den jeweiligen
> `node_modules/<pkg>/`-Ordner kopieren.

## Bedienkonzept

- **Einfach / Erweitert** – jeder Abschnitt hat genau zwei Tiefen
  (Basis/MVP ⊆ Vollausbau). Umschalten oben rechts; global & persistent.
- **Präsentationsmodus** – jeder Abschnitt liefert eine geführte Tour mit
  Spotlight + Erklärtext, manuell (← →) oder automatisch (Auto). Esc beendet.
- **Dark / Light** – persistent, System-Default.

## Abschnitte

| Gruppe | Abschnitte |
|---|---|
| Start | Dashboard (Onboarding: Aufbau + Bedienung) |
| Anforderungen | Personas · User Stories · Story Map |
| Modellierung | Klassendiagramm · Sequenzdiagramme · Zustandsdiagramme |
| Ergebnis | Prototyp (startet die echte App in neuem Tab) · Innovation |

Der **Präsentationsmodus** ist eine eigene Vollbild-Oberfläche (eigene Kopfleiste,
abgeblendeter Hintergrund, Spotlight auf das erklärte Element).

Alle Diagramme werden **nativ als SVG** aus JSON gerendert (kein Bild-Export):
- **Klassendiagramm** – Auto-Layout via `elkjs`, UML-Boxen mit Operationen an den
  Objekten, Kern-/Gruppen-/Alle-Ansicht, Detail-Drawer.
- **Sequenzdiagramme** – 4 Buchungs-Flows; Einfach = Happy Path, Erweitert = mit
  alt/opt/break-Fragmenten und Statuswechsel-Badges.
- **Zustandsdiagramme** – Sitz & Ticket, in Erweitert zusätzlich Buchung & Zahlung
  (Enums als eigene Automaten) + Cross-Links.

## Architektur

```
src/
├── data/            JSON (Doku v5.1) + content.ts (typisierte, modus-abhängige Selektoren)
├── store/appStore   theme + mode (zustand persist)
├── components/
│   ├── layout/      Sidebar (nav.ts), AppShell, TopBar
│   ├── shared/      SectionShell, Callout, ModeToggle, ErrorBoundary
│   ├── presentation Presentation (Spotlight-Engine)
│   └── diagram/     DiagramFrame, ClassDiagram, SequenceDiagram, StateDiagram
├── pages/           ein Page-Modul je Abschnitt (lazy)
└── lib/statusColors zentrale Status-/Gruppen-Palette
```

Doku & Plan: siehe [`docs/`](./docs) (REFACTORING_PLAN, ARCHITECTURE, CONTENT_MAPPING, PROGRESS).

## Tech-Stack

React 19 · Vite (rolldown) · Tailwind v4 · react-router 7 · motion · zustand ·
Radix UI · elkjs · lucide-react.
