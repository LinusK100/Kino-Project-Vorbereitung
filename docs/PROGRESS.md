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
- 2026-07-15: Dashboard theme-abhängig: Dunkel bleibt der „Kinosaal", Hell
  zeigt jetzt die „Aurora"-Optik aus dem Varianten-Archiv (Farbflächen in
  den Akzentfarben hinter Glas-Karten, Verlaufs-Titel) — mit identischen
  Inhalten (Erklär-Karten, Abschnitts-Kennzahlen, Ergebnis-Folie in der
  Tour, keine Kennzahlen-Zeile im Held). Umschaltung reagiert live auf den
  Theme-Toggle (useAppStore). DASHBOARD_VARIANTEN.md entsprechend
  aktualisiert. Verifiziert: Build/Lint grün, hell/dunkel/mobil + Live-
  Toggle-Test per Playwright, Tour öffnet (6 Folien), 0 Fehler.
- 2026-07-15: Präsentations-Inhalte auf Funktion statt Übersichtszahlen
  umgestellt (Owner-Feedback) + Buchungsmodell-Analyse + Hintergrund neu.
  (1) Zähler aus den Touren entfernt/entschärft: „82 Klassen, fünf Gruppen",
  „41/41 implementiert", „17 von 51 Stories", „30 in der Basis/51",
  „Sieben Aktivitäten", „Vier Flows", „vier Automaten", „Sechs Ideen",
  Dashboard-KennzahlenStrip. Stattdessen erklären die Folien, wie das
  System funktioniert. Personas: statt Zählung jetzt konkrete Spotlights
  (Monika/Kasse, Endkunde/online) mit Zielen→Frustrationen→Funktion;
  ZieleFrustrationen(id) parametrisiert. FlowUebersicht zeigt je Ablauf,
  was er tut, statt Teilnehmer-/Nachrichten-Zahlen.
  (2) Buchungsmodell analysiert und Darstellung korrigiert: Das Modell ist
  korrekt (Buchung=Kauf, Ticket=Karte je Sitz, VorstellungSitz=Sitz-Status
  je Vorstellung als Assoziationsklasse, Sitzplatz=physisch, BuchungService
  =«control», hält keine Daten). Die Verwechslung „Buchung/Ticket/Sitz/
  Buchung/Service" wird jetzt direkt aufgelöst: neue Auftakt-Folie
  „Das Herzstück: eine Buchung" (UmlBuchungsmodell mit Klartext-Rollen je
  Klasse), Folie „Wer macht was: Objekt vs. Service" (Buchung ≠
  BuchungService), Vertiefung „Der BuchungService steuert nur".
  (3) Karierter Hintergrund entfernt → dezenter, nicht wiederholender
  Akzent-Lichtschein oben (var(--bg-glow)); Inhalt steht im Vordergrund,
  Grund bleibt filigran (hell #fbfbfa, dunkel #161619). Verifiziert:
  Build/Lint grün, alle 14 Touren (62 Folien) + Hintergrund hell/dunkel
  per Playwright, 0 Fehler.
- 2026-07-16: Neuer Abschnitt „Arbeitsweise & Reproduzierbarkeit" (Owner-Wunsch,
  Website-Abschnitt am Ende, Framing „Methodik & KI-gestützt"). Neue Seite
  MethodikPage.tsx unter /arbeitsweise; neue Nav-Gruppe „Projekt" (meta:true —
  erscheint nur in der Seitenleiste, nicht in den Drei-Stationen-Kacheln des
  Dashboards; GROUPS-Filter in OverviewPage entsprechend). Inhalt: eine
  Datenquelle (JSON→berechnete Zahlen/SVG), der 7-Schritt-Ablauf jeder
  Änderung (Regeln→ändern→lint/build→Playwright→Daten-Check→PROGRESS→push),
  die angelegten MD-Dateien mit Zweck, die Werkzeuge (Git, npm/Vite,
  Playwright+System-Chrome, Node-Skripte, GitHub REST API, Claude Code;
  Bild-MCP verfügbar aber ungenutzt), und Push→GitHub-Actions→Pages inkl.
  Live-Gegenprüfung. Kompakte 4-Folien-Kino-Tour zum Präsentieren (Schluss
  „KI-gestützt, aber überprüft"). Slate-Akzent #475569. README-Abschnitts-
  tabelle ergänzt. Verifiziert: Build/Lint grün, Seite hell/dunkel + Tour
  per Playwright, Dashboard-Kacheln unverändert (3), 0 Fehler.
- 2026-07-16: Abschnitt „Arbeitsweise" neu gestaltet (Owner-Feedback: moderner,
  stärker abgegrenzt, Zusammenhänge zeigen, weniger Text). Jetzt ein
  eigenständiges dunkles „Engineering-Panel" mit Cyan-Akzent (#4dd6f0), das
  sich klar vom hellen Karten-Look der Inhalts-Abschnitte abhebt. Kernstück:
  der Kreislauf jeder Änderung als Pipeline (Regeln → Ändern → Prüfen[Gate] →
  Festhalten → Deployen) mit Verbindungspfeilen, darunter die GitHub-Actions-
  Kette als Mono-Chips und der Gegenprüf-/Kreislauf-Hinweis. Fließtext durch
  knappe Stichpunkte ersetzt; Werkzeuge und feste Dateien als zwei kompakte
  Karten. DASHBOARD_VARIANTEN.md aus der Dateiliste entfernt (nicht relevant).
  Verifiziert: Build/Lint grün, hell/dunkel + Tour per Playwright, 0 Fehler.
- 2026-07-16: Abschnitt „Arbeitsweise" beruhigt (Owner-Feedback: einheitliche
  Farbe, übersichtlicher, weniger Kleinteile, weniger KI-Look). Das dunkle
  Panel mit Cyan-Pop und Chip-Soup ist raus; die Seite läuft jetzt durchgehend
  in den Theme-Farben (hell auf hell, dunkel auf dunkel) mit einem einzigen
  neutralen Slate-Akzent (#64748b, in beiden Themes lesbar). Der Ablauf ist
  eine schlichte nummerierte Timeline (01–05, ein Schritt = ein Satz) mit
  Verbindungslinie; darunter eine einzige Karte mit zwei Spalten (Werkzeuge
  als Fließzeile, angelegte Dateien als kompakte Liste). Editorial und ruhig
  statt Tech-Dashboard. Verifiziert: Build/Lint grün, hell/dunkel + Tour per
  Playwright, 0 Fehler.
- 2026-07-16: Abschnitt „Arbeitsweise" inhaltsreicher (Owner-Feedback: zu
  schlicht, Werkzeuge schöner, Platz neben dem Ablauf nutzen, CLAUDE.md
  erklären, Workflow detaillierter). Zweispaltige Zeile 1: links der Ablauf
  als nummerierte Timeline mit Stichwort-Tags je Schritt (detaillierter),
  rechts eine erklärende CLAUDE.md-Karte (Leitplanken · Befehle & CI ·
  Deploy) — füllt den vorher leeren Platz. Werkzeuge jetzt als Icon-Raster
  (Icon + Name + Zweck, 3 Spalten). Weitere Projekt-Dateien als kompakte
  Drei-Spalten-Leiste. Durchgehend ein neutraler Slate-Akzent, Theme-Farben.
  Verifiziert: Build/Lint grün, hell/dunkel deterministisch (Element-Wait,
  0 Fehler). Hinweis: lokale/CI-Build-Hashes unterscheiden sich (macOS vs.
  Linux) – Inhalt wird am echten Live-Chunk gegengeprüft.
- 2026-07-16: Präsentations-Inhalte nach JSON ausgelagert + inhaltlicher
  Mehrwert-Check je Abschnitt (Owner). (1) Alle Tour-Texte liegen jetzt als
  src/data/presentations/<abschnitt>.json (9 Dateien, einfach/erweitert oder
  steps) — regelkonform zu CLAUDE.md „Inhalte nur aus src/data". Neue
  Visual-Registry + Selektor usePresentation() in
  components/presentation/steps.tsx (Text aus JSON, Visual per Kennung,
  berechnete Zahlen bleiben in den Visuals). Alle 8 Seiten von inline
  stepsFor auf usePresentation umgestellt; Typen RawPresentationStep etc.
  (2) Personas inhaltlich umgebaut: statt beliebiger Einzel-Spotlights jetzt
  die Abgrenzung Kundschaft vs. Betrieb im Zentrum (Folie „Kundschaft und
  Betrieb", dann je ein Beispiel pro Seite). (3) Gezielt-leichter Sprach-
  Feinschliff nach Leitfaden: Gedankenstrich-Pointen entschärft
  („endet – garantiert" → „endet von selbst"), das eine forcierte → im
  Fließtext ausgeschrieben, listige Dreier („konsistent, interaktiv und
  jederzeit prüfbar") gestrafft, Meta-Schluss der Stories auf
  Nachvollziehbarkeit umgestellt. Verifiziert: 14 Touren (71 Folien) per
  Playwright, 0 Fehler; Build/Lint grün.
- 2026-07-16: Größeres UX-/Inhalts-Paket (Owner). (1) Echter Vollbildmodus
  für Diagramme: neuer „Vollbild"-Knopf öffnet ein Overlay mit eigenem
  Zoom/Pan, auf die Fläche eingepasst, Esc/Schließen (vorher tat der
  Maximize-Knopf nur „100 %"). (2) Notations-/Leseart-Hinweise nicht mehr
  unter dem Titel, sondern hinter einem „Hilfe"-Button links neben dem
  Einfach/Erweitert-Umschalter (zentrales Sheet). SectionShell: neue
  help-Prop; 6 Seiten von intro auf help umgestellt. (3) Präsentationsmodus
  hat jetzt EINE Quelle — unabhängig von Einfach/Erweitert (Selektor ignoriert
  den Modus, JSON auf je ein steps-Array kollabiert, Modus-Chip im Kino-Kopf
  entfernt). (4) Arbeitsweise: langer KI-Satz entfernt, kurze Projekt-vs-
  Prototyp-Einordnung ergänzt; Tour schöner mit Ablauf-Fluss, Werkzeug- und
  Datei-Visuals (visuals/meta.tsx). (5) Innovation: Tour stellt jede Idee kurz
  vor (nur die Idee, keine Klassen/Diagramme); „Ideen über den MVP hinaus"-
  Hinweis raus, Machbarkeits-Legende ins Hilfe-Sheet. (6) Prototyp: eigener
  Hero (oranger Verlauf) mit „Prototyp starten" im Vordergrund; Buchungs-
  Wizard entfernt, Roadmap auf eine Zeile + Rollen-Chips gekürzt, aufs
  Wesentliche reduziert. Verifiziert: Build/Lint grün, 15 Touren + Vollbild +
  Hilfe-Sheet + Prototyp per Playwright, 0 Fehler.
- 2026-07-16: Neues Präsentations-Konzept (Dozenten-Vorgabe). (1) Gesamt-
  Präsentation über alle Abschnitte: Drehbuch src/data/presentations/
  gesamt.json (29 Folien) referenziert Abschnitts-Folien oder definiert
  zusammengelegte direkt; Rahmen-Folien Titel/Projekt/Agenda/Kernsätze;
  Arbeitsweise als Projekt-Einordnung an den Anfang gezogen, Innovation als
  Matrix + 2×3 Ideen, Zustände mit Sitz im Detail und den weiteren Automaten
  nur erwähnt. (2) Globaler PresentationHost über den Routen: beim Folien-
  wechsel navigiert der Hintergrund still zum passenden Abschnitt — eine
  Präsentation, nicht neun; Abschnitts-Timeline unten mit Segmenten (nach
  PPT-Vorlage Systemanalyse_CI_CD), Kernsatz-Banner je Folie. (3) Auto-Modus
  entfernt (kein Play/Pause/Tempo mehr); Steuerung ← → / Weiter / Esc.
  (4) Präsentation öffnet immer HELL (Vorgabe), Dunkel per Knopf: Palette
  pres() + theme-abhängiges bright() in visuals/core.ts, alle Visuals von
  Weiß-Alpha auf Token umgestellt. (5) Start-Auswahl an jedem Knopf: nur
  Abschnitt / gesamt ab hier / gesamt von vorn / Fortsetzen an gemerkter
  Folie (persistiert). (6) Download: Druck-Route /praesentation/druck (ohne
  AppShell) → scripts/export-praesentation.mjs erzeugt public/CineTicket_
  Praesentation.pdf (29 Folien, 16:9); Stale-Guard check-praesentation.mjs
  läuft vor jedem Build. Neue Abschnitts-Tour Prototyp (2 Folien).
  Verifiziert: Lint 0, Build grün, Playwright 25/25 (10 Touren, Gesamt-
  Durchlauf mit URL-Wechsel an allen 9 Grenzen, Resume-Logik, Hilfe-Sheet,
  Vollbild, PDF 200), 0 Konsolenfehler.
- 2026-07-16 (2): Folien-Redesign nach Owner-Feedback. (1) Echtes Präsentations-
  Layout (SlideView.tsx, von Host UND Druck-Route genutzt): Titel links oben
  mit Akzentlinie, Lead-Satz darunter, Kernsatz-Banner volle Breite unten —
  statt zentriertem Hero-Text. (2) Volle Flächennutzung (Smart Board):
  FitVisual misst die Naturgröße jedes Visuals und skaliert es per zoom auf
  die verfügbare Fläche (0.55–1.6×); Folienbereich auf min(1680px, 97 vw).
  (3) Fazit inhaltlich neu: statt generischer „Drei Kernsätze" jetzt
  „Was uns wichtig war: weiterbauen können" mit vier konkreten Prinzipien
  (Daten statt Dokumente, roter Faden U47, Enum≙Automat, bewiesen & kartiert;
  Zahlen berechnet) plus Weg-Strip Anforderungen → Modell → Prototyp →
  Release 2–3. PDF neu exportiert. Verifiziert: Lint 0, Build grün,
  Playwright 25/25, 0 Konsolenfehler.
- 2026-07-17: Faktenprüfung fürs Vortrags-Skript (Owner-Auftrag) — drei
  Inhaltsfehler gefunden und behoben: (1) „Release 1 quer durch alle
  Aktivitäten" war falsch (4 von 10 Aktivitäten ohne R1-Story) → Release-
  Folie sagt jetzt „schmale Scheibe durch die Kern-Aktivitäten, Suche/Gastro/
  Facility/Marke folgen bewusst später". (2) Fazit-Strip „Prototyp
  (Release 1)" → „Prototyp (MVP-Kern)" (Prototyp = 17 Stories: 10×R1, 6×R2,
  1×R3; U47 bewusst nicht umgesetzt). (3) ReleaseBaender-Notiz präzisiert
  („ihren Kern zeigt der Prototyp"). PDF neu exportiert. Vortrags-Skript
  (29 Folien, Kernbotschaft + Stichpunkte + Übergänge + Faktenprüfungs-
  Anhang) liegt als MD+PDF in ~/Downloads (nicht Teil des Repos).
- 2026-07-17 (2): Folien-Feinschliff nach Owner-Feedback. (1) PPT-nähere
  Anatomie: farbige Subline unter dem Titel, Stichpunkte links neben dem
  Visual (SlideView zweispaltig), kürzere Titel, Zoom-Deckel 1.22 statt 1.6
  (gleichmäßige Größen). (2) Kopfleiste farblich abgesetzt (Abschnittsfarbe),
  Luft zwischen Inhalt und unterer Leiste, Zurück/Weiter links/rechts neben
  der Timeline. (3) Alle 29 Folientexte neu: kurze Sublines + Stichpunkte,
  keine Gedankenstriche; Fazit entschlackt; KI-Werkzeug-Hinweis von der
  Vortragsfolie genommen (bleibt im Arbeitsweise-Abschnitt der Website).
  (4) Skript um Rückfragen-Vorbereitung je Folie erweitert (MD+PDF in
  ~/Downloads). PDF neu exportiert. Lint 0, Playwright 25/25, 0 Fehler.
- 2026-07-17 (3): Folien-Design modernisiert (Owner: „zu filigran"). Folie
  liegt jetzt als abgerundete Karte („Slide-Card") mit Akzentkante oben und
  Schatten auf einer ruhigen Bühne; Abschnitts-Chip statt Kicker, Titel in
  kräftiger Sans (statt Serife), farbige Subline; Stichpunkte als gleich-
  mäßige Info-Karten UNTER dem Visual (statt Liste daneben); Visual-Zoom bis
  1.45. Druck-Route nutzt dieselbe Karte. PDF-Export-Fix: Viewport exakt in
  Seitengröße (1122×631), sonst reflowt Chromiums Print-Pipeline und breite
  Visuals brechen um (Seite 14 war beschnitten); zusätzlich FitVisual auf
  width:max-content (nie umbrechen, immer skalieren). Lint 0, Playwright
  25/25, 0 Konsolenfehler, PDF visuell geprüft.
- 2026-07-17 (4): Farb-, Größen- und Inhalts-Feinschliff (Owner). (1) Grau/
  Braun raus: Hell-Palette auf kühle, klare Flächen (#f3f6fb etc.),
  Präsentations-Akzent Prototyp von Rostbraun auf modernes Orange (#c2410c).
  (2) Sequenz-/Zustandsdiagramme deutlich größer: SVG-Visuals hatten unter
  width:max-content ihre Naturbreite verloren (auf ~300px kollabiert) —
  jetzt feste Naturbreite, FitVisual skaliert. (3) Gesamt-Deck auf 26 Folien
  gestrafft: „Objekt vs. Service" (klang doppelt) und Stories-Bauplan
  (Überschneidung Story Map) raus, Kernaussagen als Banner/Punkte verlagert;
  Prototyp+Live-Demo auf einer Folie; echte nummerierte Agenda-Folie
  (agendaListe-Visual). (4) Fazit neu: agentisches Weiterbauen („Daten statt
  Dokumente", „Ein roter Faden", „Spezifikation statt Prompt", „Der Ablauf
  sichert die Qualität"); schwache Karten gestrichen. (5) Skript auf 26
  Folien inkl. Rückfragen zum agentischen Weg aktualisiert (MD+PDF in
  ~/Downloads). Lint 0, Playwright 26er-Durchlauf ALLES GRÜN, PDF neu.
- 2026-07-17 (5): Feinschliff-Paket (Owner). (1) Agenda-Karten größer (px-6
  py-5, Nummern 32px, maxWidth 1220). (2) UML-Legende erklärt jetzt die
  Schichten: „Jede Kachel im Diagramm ist eine Klasse" + je Gruppe Anzahl,
  Erklärung und Beispielklassen (Domäne/Services/Stores/DTOs/Enums); grüner
  Punkt erklärt. (3) Story Map in der Präsentation: statt zwei unlesbarer
  Chip-/Band-Folien EINE Matrix-Folie (storyMapMini: Aktivitäten × Releases
  mit Story-Zahlen aus den Daten, gestrichelt = Vollausbau) → 25 Folien.
  (4) Diagramm-Vollbild: horizontal UND vertikal scrollbar — Zentrierung
  via margin:auto am Inhalt statt items-center am Container (Flex-Center
  machte den linken/oberen Überlauf unerreichbar). Skript auf 25 Folien
  nachgezogen. Lint 0, Playwright 25er-Durchlauf ALLES GRÜN, PDF neu.
- 2026-07-17 (6): User-Stories-Folie der Gesamt-Präsentation (Owner): statt
  einer ausführlichen U47-Karte mit Akzeptanzkriterien jetzt eine Galerie
  aus vier kompakten Stories (storyGalerie-Visual: U47/U01/U15/U22 —
  Stammkundin, Kasse, Einlass, Student; Prioritäten und Releases als Chips
  ablesbar, U47 als „der Kern" hervorgehoben). Abschnitts-Tour behält die
  Detailkarte. Skript-Folie 9 nachgezogen. Lint 0, Playwright ALLES GRÜN,
  PDF neu exportiert.
- 2026-07-17 (7): PDF = Präsentation (Owner). Kopf- und Fußleiste des
  Präsentationsmodus als geteilte Komponenten extrahiert (PresHeaderBar/
  PresFootBar in PresentationHost.tsx) und in der Druck-Route verwendet:
  Jede PDF-Seite zeigt jetzt exakt die Live-Ansicht — getönte Kopfleiste mit
  Icon/„PRÄSENTATION"/Zähler/Mond/Beenden, unten Zurück-Knopf, Timeline und
  Weiter/Fertig-Pill. Lint 0, Playwright ALLES GRÜN, PDF neu exportiert und
  Seite für Seite gegengeprüft.
- 2026-07-17 (8): PDF-Fidelity + Schlussfolie (Owner). (1) Diagramme im PDF
  waren klein/abgeschnitten (Sequenz-Folien): Druckseiten und Export jetzt
  exakt in Live-Größe 1600×900 px, Chromium mit --hide-scrollbars (die
  Scrollbar der gestapelten Druckseiten verschob sonst die Messung von
  FitVisual gegenüber dem Print-Layout). PDF-Seiten = 1:1 die Live-Ansicht.
  (2) Neue Schlussfolie „Vielen Dank" (Titel-Layout) → 26 Folien; Fazit ohne
  Danke-Banner. (3) Website-Link als Pill mit Globus-Icon auf Titel- UND
  Schlussfolie (neues link-Feld in den Folien-Typen, klickbar auch im PDF).
  Skript nachgezogen. Lint 0, Playwright 26er-Durchlauf ALLES GRÜN.
- 2026-07-17 (9): Fazit + PDF-Verfahren (Owner). (1) Fazit-Folie auf reine
  Schlagwort-Kacheln reduziert (Icon + Begriff: Daten statt Dokumente,
  Roter Faden U47, Modell als Bauplan, Erst testen dann live); die Sätze
  dazu stehen im Vortrags-Skript. (2) PDF-Export komplett neu: Statt Print-
  Rendering fotografiert der Export jede Folie der LAUFENDEN Präsentation
  (Playwright, 1600×900 bei 2×, JPEG 92) und bindet die Screenshots zu einem
  PDF — Abweichungen vom Live-Aussehen sind damit konstruktionsbedingt
  unmöglich. Titel-/Schlussseite verlinken auf die Website. Druck-Route
  bleibt für manuelles Drucken bestehen. Lint 0, Playwright ALLES GRÜN.
- 2026-07-17 (10): PDF-Export: Aufnahme jetzt stabilitätsbasiert statt fester
  Wartezeit (Owner-Fund: Story-Map-Folie war mitten in der Einblend-
  Staffelung fotografiert, ~1,9 s > 1,3 s Wartezeit; Innovations-Matrix und
  Fazit lagen knapp an der Grenze). Der Export fotografiert jede Folie so
  lange, bis zwei aufeinanderfolgende Aufnahmen pixelidentisch sind (max.
  ~5,5 s) — jede Folie ist damit garantiert fertig animiert. Story-Map- und
  Matrix-Seite im PDF gegengeprüft: vollständig.
