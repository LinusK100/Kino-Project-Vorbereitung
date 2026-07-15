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
- [x] Traceability-Matrix — **später bewusst entfernt** (Owner-Entscheidung, bleibt raus)
- [x] Innovation-Abschnitt (Machbarkeits-Flags machbar/teilweise/Konzept)
- [x] Glossar — **später bewusst entfernt** (Owner-Entscheidung, bleibt raus)

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
- 2026-07-03: Prototyp & Innovation ohne Einfach/Erweitert (zeigen immer alles);
  Prototyp-Abschnitt ohne Kino-Tour — stattdessen großer „Prototyp starten"-Button.
  Prototyp-Inhalte an die echte App angeglichen: Wizard-Schritte jetzt
  Sitze → Details → Extras → Zahlung → Fertig (Vorstellung/Datum davor auf der
  Film-Detailseite), Zahlarten Kreditkarte/PayPal/vor Ort; klargestellt, dass der
  10-Minuten-Hold (U47) Design-only ist (Sitzstatus der App: free/taken/selected).
  prototype.json entsprechend aktualisiert (Owner-Entscheidung).
- 2026-07-03: Kino-Modus v3 — Touren folgen jetzt dem Einfach/Erweitert-Modus
  (Modus-Chip im Kino-Kopf): Einfach zeigt den MVP-Kern (37 Folien gesamt),
  Erweitert vertieft mit 7 zusätzlichen Detail-Folien (44 gesamt): Vererbung
  (8 Rollen ▷ Nutzer), Service-Schicht (BuchungService ⇢ Domäne), alt-Fragment,
  Storno-Flow über vier Objekte, Buchungs- und Zahlungs-Automat, Persona-Baum.
  Visuals modusabhängig (Verteilung, Backbone, Release-Bänder, Rollen, Matrix);
  Einfach-Tour zeigt U01 statt der erweiterten U47. Beide Modi × 9 Sektionen
  per Playwright verifiziert (0 Fehler).
- 2026-07-02: UI/UX-Pass — Folien-Animationen deutlich gestrafft (Inhalt nach
  ~1,5 s statt ~2,6 s komplett); Detail-Panels (Klasse, Story) vom rechten Sheet
  auf zentrierten Dialog über dem Inhalt umgestellt; Abschnitts-Header kompakt
  (eine Zeile statt Karten-Band); Diagramm-Zoom mit Drag-Panning, Strg+Scroll am
  Cursor und „Einpassen“-Knopf; Story Map per Ziehen verschiebbar; Dashboard
  entschlackt (ein Hero mit integriertem Tour-Start statt Doppel-Kopf, Gruppen-
  Karten mit Kurzbeschreibung); redundante Callout-Texte entfernt (Notation
  stand doppelt in Callout und Legende).
- 2026-07-11: Präzisions- und Politur-Pass nach Gesamt-Review:
  (1) „MVP"-Überclaim behoben — die Basis-Auswahl (30 Stories) verteilt sich auf
  R1/R2/R3 (14/12/4), Folie hieß aber „30 Stories für den MVP"; jetzt „Die 30
  Kern-Stories" mit Hinweis „14 bilden Release 1, den MVP". Kino-Chip
  „Einfach · MVP" → „Einfach · Basis", ModeToggle-Hint entsprechend.
  (2) Zahlen auf Folien/Karten nicht mehr hartkodiert, sondern aus src/data
  berechnet (Klassen/Gruppen/Rollen/Stories/Personas/Aktivitäten/Flows/
  Automaten/Ideen/Wizard-Schritte; neuer Helper zahlwort() in lib/utils).
  (3) Kino-Modus: „Fertig"-Knopf auf der letzten Folie schließt jetzt (war
  funktionslos); Fokus wird beim Öffnen ins Overlay geholt und beim Schließen
  zurückgegeben. (4) Vererbungs-Folie: Fächerlinien enden an den gemessenen
  Chip-Mitten (ResizeObserver) statt an einem festen Raster. (5) Buchungs-/
  Zahlungs-Automat: orthogonale Elbow-Kanten statt Diagonalen — keine Kante
  läuft mehr durch Guard-Texte. (6) Innovations-Matrix: Achsen mit Skalen-
  Anker „(1 gering · 5 hoch)", überlappende Punkt-Labels weiter auseinander.
  Alle 14 Touren (61 Folien, beide Modi) per Playwright verifiziert, 0 Fehler;
  Build/Lint grün. Offen war noch die Ground-Truth-Frage prototype.json
  (storiesImplementiert=20 vs. 17 in den Modul-Listen) — inhaltlich geklärt
  und behoben im folgenden Eintrag.
- 2026-07-11: Stories-Kennzahl inhaltlich geklärt (Befund 2). Analyse gegen
  Traceability v1.1 (Doku, 2026-06-21) und den echten Prototyp-Quellcode:
  Die 20 der Traceability zählte U06, U28 und U47 mit — alle drei sind im
  Prototyp nachweislich NICHT umgesetzt: U47 (Sitz-Hold) hat keinerlei
  Hold-/Timer-Logik (Owner-Entscheidung 2026-07-03: Design-only), U06
  (Gruppen-Tickets) erfüllt 0/3 Akzeptanzkriterien (kein 8er-Limit, keine
  Nachbarplatz-Präferenz, ein Sammel-QR pro Buchung statt Einzel-Tickets),
  U28 (Seniorenrabatt) ist nur ein manuell wählbarer POS-Tarif (F3) ohne
  Profil-/Altersverifizierung. Die kuratierten Modul-Listen (17 Stories)
  sind der korrekte Stand. Fixes: stats.storiesImplementiert 20 → 17;
  Callout-Text präzisiert („zentrale Release-1-Abläufe" statt „setzt den
  MVP-Kern um", U47 als Design-only benannt); Roadmap um vier Einträge
  ergänzt (Sitz-Hold U47, Gruppen & Rabatte U06/U18/U28, Offline-Validierung
  U16, Preismatrix U25 — UML-Klassen aus der Traceability übernommen), damit
  jede der 16 R1-Stories entweder implementiert (10) oder in der Roadmap (6)
  verortet ist; PrototypePage berechnet alle KPIs jetzt aus den Listen
  (Rollen, uml.json, Modul-Union „17 / 51") statt aus dem stats-Block.
  Verifiziert: JSON konsistent (impl-Union = stats, keine Story doppelt,
  R1 lückenlos), Build/Lint grün, Seite per Screenshot geprüft, 0 Fehler.
  Hinweis: In der Abgabe-Doku (CineTicket_Projektdokumentation) melden
  traceability/traceability.json (stats.implementiert=20, U47 als
  „implementiert") und prototyp/prototyp.json (storiesImplementiert=20)
  noch den alten Stand — dort ggf. nachziehen (Owner-Entscheidung).
- 2026-07-11: Genauigkeits-Pass Prototyp-Beschreibung + Doku-Sync. Alle
  Behauptungen über die echte App gegen deren Quellcode geprüft und korrigiert:
  POS-Shortcuts sind F1–F4 (Tarife) + F12 Abschluss (nicht „F2/F4/F8"),
  Umsatz-Chart zeigt 7 Tage (nicht „7/14/30"), Seed = 8 Filme (Venom,
  Gladiator II, Vaiana 2 … statt „5 Filme, Dune 2/Oppenheimer"), 4 Säle
  (126/176/96/60 statt „3 Säle 120/80/60"), Vorstellungen 7 Tage (nicht 14),
  Sitzkategorien inkl. BARRIEREFREI mit eigenen Preisen je Saal, 30
  Seed-Buchungen; stores um AnsichtStore (view-mode) ergänzt. Dieselben
  Korrekturen in die Abgabe-Doku übernommen: prototyp/prototyp.json =
  identische Kopie der Repo-Datei, prototyp/prototyp.md (Beschreibung,
  Wizard-Schritte, Roadmap-Tabelle +4 R1-Einträge, Mock-Daten, Shortcuts,
  Konsistenz-Note 20→17), traceability v1.2 (U06/U28/U47 → „○ roadmap",
  Stats 17/34, U47-Fußnote präzisiert). REVIEW_REPORT.md mit Nachtrag,
  README „Basis/MVP" → „Basis". Verifiziert: Traceability-implementiert-Menge
  ≡ Modul-Union ≡ Stats (17), Doku-JSON diff-identisch zum Repo, Build/Lint
  grün, Prototyp-Seite per Screenshot geprüft (0 Fehler).
- 2026-07-11: Dashboard einladender + README überarbeitet. Dashboard: zweiter
  Hero-CTA „Zum Prototyp" (interner Link auf /prototyp — der Neuer-Tab-Start
  bleibt Owner-konform nur dort), Abschnitts-Karten mit 3px-Akzentlinie in
  Gruppenfarbe und einer datengetriebenen Kennzahl je Zeile (4–12 Personas,
  30–51 Stories, 7–10 Aktivitäten, 82 Klassen, 4 Flows, 2–4 Automaten,
  4 Rollen live, 6 Ideen — alles aus src/data berechnet). README: Live-URL
  prominent, zwei Screenshots (Dashboard + Kino-Folie, docs/img/), veraltete
  Spotlight-Beschreibung durch den Kino-Modus ersetzt, Architektur-Baum
  aktualisiert (presentation/visuals), Binary-Hinweis verweist jetzt auf
  scripts/ensure-native-binaries.mjs, Kurskontext ergänzt. Verifiziert:
  Build/Lint grün, Dashboard hell/dunkel/mobil per Screenshot, 0 Fehler.
- 2026-07-14: Dashboard-Design-Auswahl vorbereitet (lokal, nicht deployt):
  fünf neue Varianten unter src/pages/overview/ — 1 „Kino" (dunkler Saal,
  Leinwand, Filmstreifen), 2 „Graph" (animiertes Traceability-Netz mit
  Datenfluss-Punkten, Hover-Nachbarschaft, klickbaren Knoten), 3 „Editorial"
  (typografisches Inhaltsverzeichnis 01–08), 4 „Bento" (Kachel-Raster mit
  Release-Balken und 41/82-Kachel), 5 „Aurora" (Farbverläufe hinter
  Glas-Karten). Alle ohne Karo-Hintergrund, Zahlen aus src/data (shared.tsx),
  Tour + Prototyp-Link überall, reduzierte Bewegung respektiert; „Bisher"
  bleibt als Referenz. Temporärer Umschalter unten rechts auf dem Dashboard
  (localStorage) — nach der Entscheidung wird die gewählte Variante fest
  verdrahtet und der Rest entfernt. Build/Lint grün, alle 6 × hell/dunkel
  per Playwright geprüft (0 Fehler), Vergleichsgalerie als Artifact.
- 2026-07-14: Dashboard-Entscheidung umgesetzt: Variante „Kino" ist jetzt das
  Dashboard (OverviewPage.tsx — dunkler Saal mit Projektorlicht, Leinwand-
  Titel-Card, Sitzreihen, die drei Stationen als Filmstreifen mit Perforation;
  bewusst immer dunkel). Temporärer Varianten-Umschalter und die übrigen
  Entwürfe entfernt; „Graph" und „Aurora" sind mit Konzept + vollständigem
  Quellcode in docs/DASHBOARD_VARIANTEN.md archiviert (Owner-Entscheidung).
  README-Screenshot auf das neue Dashboard aktualisiert. Verifiziert:
  Build/Lint grün, hell/dunkel/mobil per Playwright, Tour startet, 0 Fehler.
- 2026-07-15: Dashboard-Feinschliff nach Owner-Feedback: (1) Die drei
  Erklär-Karten sind zurück und direkt sichtbar (nicht erst in der Tour) —
  „Kino-Tour in jedem Abschnitt" (Bedienung ← →/Leertaste/Esc), „Alle Daten
  als JSON" (Datengrundlage für die spätere Umsetzung, live als SVG
  gerendert), „Einfach & Erweitert" — im Saal-Look zwischen CTAs und
  Filmstreifen. (2) Kennzahlen-Zeile unter dem Leinwand-Titel entfernt
  (Zahlen stehen im Filmstreifen je Abschnitt). (3) „Präsentation"-Knopf
  hat jetzt in jedem Abschnitt einen Tooltip (analog ModeToggle).
  (4) Whiteboard-Hintergrund hell von Creme (#f9f8f5) auf Neutralweiß
  (#fafafa, Gitter 0.03) — ruhiger, einheitlich zu den weißen Karten;
  Dunkel unverändert. README-Screenshot erneuert. Verifiziert: Build/Lint
  grün, Dashboard + Abschnitte per Playwright (hell/dunkel), Tour startet,
  0 Fehler.
- 2026-07-15: Präsentations-Audit („nur mit den Touren vor dem Dozenten
  präsentierbar?"): alle acht Abschnitts-Touren inhaltlich geprüft — Aufbau
  je Abschnitt: Konzept → echte Datenausschnitte → Arbeits-/Lesehilfe;
  Zahlen berechnet, Fachkern (U47-Hold) zieht sich durch. Einzige Lücke:
  Die Überblick-Tour endete ohne das Projektergebnis (der Prototyp hat
  bewusst keine eigene Tour). Neue Folie 5/6 „Das Ergebnis: der klickbare
  Prototyp" (ImplSplit + Chips „4 von 8 Rollen klickbar", „17 von 51
  Stories abgedeckt", berechnet) mit Verweis auf den Start im
  Prototyp-Abschnitt. Verifiziert: alle 14 Touren (62 Folien) per
  Playwright, 0 Fehler, Build/Lint grün.
