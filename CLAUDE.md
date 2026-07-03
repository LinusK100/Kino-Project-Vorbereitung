# CLAUDE.md — Arbeitsregeln für dieses Repo

Doku-Website für **CineTicket** (Systemanalyse & Entwurf), deployt via GitHub Pages:
<https://linusk100.github.io/Kino-Project-Vorbereitung/> · Repo `LinusK100/Kino-Project-Vorbereitung`, Branch `main`.
Die Website wird von einem Dozenten benotet — Inhaltstreue und Politur gehen vor Tempo.

## Verbindliche Leitplanken (Owner-Entscheidungen)

- **Inhalte nur aus `src/data/*.json`** (Ground Truth: `CineTicket_Projektdokumentation` v5.1
  unter `/Users/linus/Downloads/CineTicket_Projektdokumentation`). Keine erfundenen Fakten,
  keine Marketing-/KI-Floskeln. Zahlen auf Folien/Karten aus den Daten berechnen, nie hartkodieren.
- **Diagramme werden zur Laufzeit als SVG aus den JSON gerendert** — keine statischen Bilder.
- **Einfach/Erweitert**-Umschalter und der **Kino-Präsentationsmodus** bleiben erhalten;
  Basis ist immer echte Teilmenge des Vollausbaus. **Ausnahmen (Owner, 2026-07-03):**
  Prototyp und Innovation haben bewusst **keinen** Modus (zeigen immer alles), und der
  Prototyp-Abschnitt hat **keine** Kino-Tour — die Präsentation ist der Prototyp selbst
  (großer „Prototyp starten"-Button).
- Der Prototyp-Abschnitt beschreibt die **echte App** in `public/prototyp-app/`
  (Wizard: Sitze → Details → Extras → Zahlung → Fertig; Vorstellung/Datum davor auf der
  Film-Detailseite; **kein Hold im Prototyp** — der 10-Minuten-Hold ist Design-only).
- **Traceability & Glossar wurden bewusst entfernt — nicht wieder einführen**
  (ältere Docs in `docs/` erwähnen sie noch; das ist historisch).
- **`public/prototyp-app/` nicht anfassen** (gebauter Prototyp inkl. MSW-Worker).
  Quellcode des Prototyps: `/Users/linus/Downloads/cineticket-prototyp` (eigener Ordner, kein Repo).
- **UI-Sprache durchgehend Deutsch.**

## Befehle & CI-Eigenheiten

- `npm install` (CI nutzt **nicht** `npm ci`) + `scripts/ensure-native-binaries.mjs`
  (npm lässt auf manchen Macs die nativen Binaries von rolldown/lightningcss/oxide weg — s. README).
- `npm run dev` · `npm run build` (tsc + vite) · `npm run lint` (muss 0 Probleme melden).
- Lint-Konvention: kein setState-in-Effect — Render-time-Reset-Pattern verwenden
  (`const [prev, setPrev] = useState(x); if (x !== prev) { setPrev(x); … }`).
- `404.html` ist der SPA-Fallback für GitHub Pages: Deep-Links liefern nominell HTTP 404 — gewollt, nicht "fixen".

## Deploy & Verifikation

- Push auf `main` → GitHub Actions → Pages. Auf dem Rechner gibt es **kein `gh` CLI** —
  Actions-Status per GitHub REST API (`curl https://api.github.com/repos/LinusK100/Kino-Project-Vorbereitung/actions/runs?head_sha=…`).
- Visuelle Prüfung: `playwright-core` + System-Chrome headless
  (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`).
  Vor jedem Push: Build + Lint grün und die Präsentations-Touren aller Abschnitte durchschalten
  (0 Konsolen-/Seitenfehler; geblockte Webfonts und der SPA-404 zählen nicht).
- Nach dem Deploy die Live-URL gegenprüfen, nicht nur den lokalen Preview.

## Wegweiser

| Datei | Zweck |
|---|---|
| `docs/ARCHITECTURE.md` | Farb-Token, Komponenten-Verträge (SectionShell, PresentationStep, DiagramFrame), Datenlayer |
| `docs/PROGRESS.md` | Lebende Checkliste + Changelog — **bei jeder Änderung aktualisieren** |
| `docs/REVIEW_REPORT.md` | Review-Stand (Momentaufnahme) |
| `docs/REFACTORING_PLAN.md`, `docs/CONTENT_MAPPING.md` | Historische Planung, teilweise überholt |
| `src/components/presentation/visuals/` | JSON-getriebene Folien-Visuals des Kino-Modus |
