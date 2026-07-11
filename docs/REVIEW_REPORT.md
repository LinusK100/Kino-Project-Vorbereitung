# Review-Report — CineTicket Doku-Website

> Vollständige Analyse, Bewertung und Verbesserung. Stand: 2026-07-02.
> Methode: automatisierte Inhalts-Validierung (Node-Skripte gegen alle `src/data/*.json`
> und die Ground-Truth-Doku v5.1) + funktionale/visuelle Prüfung mit Playwright
> (headless Chrome, alle Routen × Einfach/Erweitert × Light/Dark, Mobil 390×800,
> Präsentationsmodus, Diagramm-Interaktionen).

## Gesamturteil

**Sehr guter Zustand mit wenigen, gezielt behobenen Mängeln.** Die Inhalte waren
referenziell praktisch fehlerfrei und deckungsgleich mit der Doku v5.1; die
gefundenen Schwächen lagen in der UML-Notation (fehlender Startpfeil, fehlende
Aktivierungsbalken), einem echten Funktions-Crash (Klassendiagramm-Ansichtswechsel)
und einzelnen Sprach-/Anzeige-Details. Alle wurden behoben.

| Dimension | Note (vorher → nachher) | Kurzbegründung |
|---|---|---|
| **A) Inhalt** | 1,7 → **1,0** | Referenzielle Integrität über alle 11 Datenquellen fehlerfrei (skriptgeprüft: Personas ↔ Stories ↔ Map ↔ UML ↔ Sequenz ↔ Zustand ↔ Innovation ↔ Prototyp); basis ⊆ erweitert hält; Enums exakt konsistent; Inhalte identisch mit Ground Truth v5.1. Abzüge vorher: fehlender UML-Startpfeil, fehlende Aktivierungsbalken, „Hoche/Mittele Priorität", Roadmap-Module im Erweitert-Modus nicht gezeigt, KPI „8 Diagramme" (real 9). |
| **B) Funktionalität** | 2,3 → **1,0** | Alle Routen, Modi, Präsentationsmodus (Esc/Pfeile/Leertaste/Auto/Sprung), Klick-Highlight, Als-Text, Prototyp-Embed liefen. Abzüge vorher: **Crash** beim Wechsel auf Klassendiagramm-Ansichten mit disjunkter Klassenmenge (z. B. „Enums" → ErrorBoundary), Fit-on-load griff bei „Alle 82" nicht, 404-Poster im Prototyp. |
| **C) Design** | 1,3 → **1,0** | Klare Hierarchie, konsistente Kategorie-Akzente, saubere Diagramme, Dark Mode und Mobil (Hamburger) einwandfrei, sichtbarer Fokus (3px outline). Abzüge vorher: fehlendes Gastro-Icon in der Story Map (Fallback-Kreis), Release-Chip im Story-Detail ohne Dark-Variante. |
| **D) Aufbau/Struktur** | 1,3 → **1,0** | Navigation logisch (Start · Anforderungen · Modellierung · Ergebnis), Dashboard erklärt Struktur + Bedienung, JSON-getriebener Content-Layer mit getypter Registry, keine toten Dateien. Abzüge vorher: Lint nicht sauber (2 shadcn-Fehler, 2 Warnungen), missverständlicher Hinweis „Umschalten oben rechts" auf dem Dashboard (dort gibt es keinen Toggle). |

## Prüfumfang (automatisiert)

- **Inhalts-Skript** (`validate.mjs`): 0 Fehler. Geprüft: eindeutige IDs; jede
  referenzierte Persona/Story/UML-Klasse/Methode existiert; jede Story genau 1× in der
  Story Map und unter der richtigen Aktivität; basis ⊆ erweitert (Personas, Stories,
  Map-Aktivitäten); Zustands-IDs ≡ Enum-Werte des Klassendiagramms (Sitzstatus,
  Ticketstatus, Buchungsstatus, Zahlungsstatus); Sequenz-Nachrichten ↔ UML-Methoden;
  Prototyp-Statistiken (41 implementiert / 41 Design-only / 20 Stories) stimmen mit den
  Rohdaten überein; kein Mojibake. *(Nachtrag 2026-07-11: Die Stories-Kennzahl wurde
  nach Code-Abgleich auf 17 korrigiert — U06/U28/U47 sind Roadmap, s. PROGRESS.md.)*
- **Ground-Truth-Abgleich:** alle JSON inhaltlich identisch mit
  `CineTicket_Projektdokumentation` v5.1 (einzige Abweichung: normalisierter
  Doppel-Leerraum in einem crossLink-Text).
- **Playwright:** 9 Routen × 2 Modi × 2 Themes, Präsentationsmodus end-to-end
  (öffnen, ←/→, Leertaste/Auto ~6 s, Fortschritts-Sprung, Esc), Klick-Highlight
  (11 Knoten gedimmt), Zoom, Als-Text, Mobil-Menü, Tab-Fokus, Prototyp-App (MSW lädt
  Filme, 0 × 404). Ergebnis nach den Fixes: **0 Konsolen-/Seitenfehler**.

## Behobene Mängel (priorisiert, vorher → nachher)

### Inhalt / UML-Korrektheit
1. **Fehlender Startpfeil im Sitzplatz-Automaten.** `states.json` (wie die Ground
   Truth) enthält keine Transition `_initial → FREI`; der Startkreis hing in der Luft —
   ein UML-Notationsfehler. Der Renderer synthetisiert die Initial-Transition jetzt,
   wenn sie in den Daten fehlt; die Daten bleiben deckungsgleich mit v5.1
   (`src/components/diagram/StateDiagram.tsx:118`, `:169`).
2. **Aktivierungsbalken fehlten in allen Sequenzdiagrammen** (Kriterium
   „Lebenslinien/Aktivierungen/Nachrichten/Fragmente"). Jede Nicht-Akteur-Lebenslinie
   zeigt jetzt ihre Ausführungsspanne als schmalen Balken; Legende ergänzt
   (`src/components/diagram/SequenceDiagram.tsx:41`, `:86`; `src/pages/SequencePage.tsx:80`).
3. **Grammatikfehler „Hoche Priorität" / „Mittele Priorität"** im Story-Detail
   (Label + „e" zusammengesetzt) → korrekte Formen „Hohe/Mittlere/Niedrige Priorität"
   (`src/pages/UserStoriesPage.tsx:16`, `:164`).
4. **Erweitert-Modus des Prototyps unterschlug die Roadmap.** Überschrift versprach
   „implementiert vs. Roadmap", gerendert wurden nur die 11 implementierten Module.
   Jetzt werden zusätzlich alle 14 Roadmap-Module aus `prototype.json` gelistet
   (Persona · Stories · UML-Klassen) (`src/pages/PrototypePage.tsx:1131`).
5. **Schrittanzeige „6 / 5"** auf dem Profil-Screen des eingebetteten Flows →
   dynamisch „x / 6" (`src/pages/PrototypePage.tsx:1076`).
6. **Dashboard-KPI „8 Diagramme"** — tatsächlich sind es 9 (1 Klassendiagramm +
   4 Sequenzdiagramme + 4 Zustandsautomaten). Wert wird jetzt aus den Datenquellen
   berechnet (`src/pages/OverviewPage.tsx:15`).
7. **Kaputtes Filmposter im Prototyp** (TMDB-Pfad für „Smile 2" lieferte 404, sichtbar
   als graue Kachel auf dem Startscreen). Korrigierter, verifizierter Pfad in
   `cineticket-prototyp/src/mocks/data/seed.ts` und in beiden gebauten Bundles
   (`public/prototyp-app/assets/browser-DCDnA2Ms.js`) — gleiche Stringlänge, kein
   Rebuild nötig; Live-Check: 0 × 404.
8. **Missverständlicher Bedienhinweis** „Umschalten oben rechts" auf dem Dashboard
   (dort existiert kein Modus-Toggle) → „oben rechts in jedem Abschnitt"
   (`src/pages/OverviewPage.tsx:23`, `:53`).

### Funktionalität
9. **Crash beim Ansichtswechsel im Klassendiagramm** (vorbestehend): Wechsel auf eine
   Ansicht mit disjunkter Klassenmenge (z. B. „Enums") renderte das alte Layout gegen
   die neue Klassenliste → `undefined.group` → ErrorBoundary („Abschnitt konnte nicht
   geladen werden"). Fix: Render-Guard für verwaiste Layout-Knoten + Layout-Reset beim
   Klassenwechsel (`src/components/diagram/ClassDiagram.tsx:57`, `:126`). Alle 7
   Ansichten (Kern/Domäne/Services/Stores/DTOs/Enums/Alle 82) klicken sich jetzt
   fehlerfrei durch.
10. **Fit-on-load griff bei „Alle 82" nicht**: elk braucht dafür mehrere Sekunden,
    die Retry-Timer (max. 1,1 s) liefen vorher aus → Diagramm blieb auf altem Zoom.
    Jetzt beobachtet ein MutationObserver das Einfügen des SVG und fittet sofort
    (verifiziert: 42 % statt 89 %); manueller Zoom wird nicht mehr von späten Timern
    überschrieben (`src/components/diagram/DiagramFrame.tsx:29`).

### Design
11. **Story Map „GASTRO & SERVICE" ohne Icon** — `coffee` fehlte im Icon-Mapping
    (Fallback-Kreis statt Kaffeetasse); ungenutztes `utensils` ersetzt
    (`src/pages/StoryMapPage.tsx:2`, `:14`).
12. **Release-Chip im Story-Map-Detail ohne Dark-Mode-Farben** → nutzt jetzt die
    vorhandenen `bgDark/textDark/borderDark`-Varianten (`src/pages/StoryMapPage.tsx:167`).

### Struktur / Werkzeugkette
13. **Lint jetzt vollständig grün** (vorher 2 Fehler + 2 Warnungen):
    `public/` (fremdes Prototyp-Bundle) wird ignoriert; die shadcn-üblichen
    cva-Varianten-Exporte in `src/components/ui/` sind von
    `react-refresh/only-export-components` ausgenommen (`eslint.config.js`);
    die `useMemo`-Abhängigkeiten in `SequenceDiagram.tsx` sind korrekt deklariert
    (`useCallback` für `colX`/`rowOf`).

## Bewusst NICHT geändert (mit Begründung)

- **Story U26 wechselt die Persona** (basis: Thomas/Manager → erweitert: Nora/Admin
  mit erweitertem Rollenmodell). So steht es in der Ground Truth: Im Basis-Modell
  existiert die Admin-Persona nicht, die Verantwortung liegt beim Manager; der
  Erweitert-Modus verfeinert sie. Kein Widerspruch, sondern dokumentierte Verfeinerung.
- **Terminale Zustände (z. B. Ticket EINGELÖST/STORNIERT/ABGELAUFEN) enden nicht in
  einem ◎-Endknoten.** UML erlaubt Automaten ohne Final-Pseudozustand; die Objekte
  bestehen fachlich weiter (Historisierung). Der echte Endzustand ◎ wird dort gezeigt,
  wo der Lebenszyklus wirklich endet (VorstellungSitz „Vorstellung beendet"); terminale
  Zustände sind in den Detailkarten als „Endzustand" gekennzeichnet. Erfundene
  Ende-Transitionen hätten der Ground Truth widersprochen.
- **`statesExtra.ts` bleibt TypeScript statt JSON.** Die Automaten Buchung/Zahlung sind
  bewusst aus den Enums + Sequenzdiagrammen **abgeleitet** (nur Erweitert-Modus); die
  Quelle v5.1 enthält exakt zwei Automaten. Eine Verschiebung nach `states.json` hätte
  den 1:1-Abgleich mit der Ground Truth gebrochen. Enum-Konsistenz wird skriptgeprüft.
- **Gemischte Akzentfarben in der Gruppe „Ergebnis"** (Prototyp braun-orange,
  Innovation grün): etablierte Abschnittsfarben aus dem Design-System
  (ARCHITECTURE.md); Wiedererkennbarkeit je Abschnitt wiegt hier stärker als
  Gruppen-Uniformität.
- **Klassendiagramm-Layout (vertikal, Fit auf Breite)** unverändert: Breite-Fit hält
  den Text beim Laden lesbar; die Übersicht liefern Kern-Ansicht, Gruppenfilter,
  Zoom und „Als Text". Ein Querformat-Umbau wäre ein Risiko ohne klaren Gewinn.
- **Traceability und Glossar bleiben entfernt** (explizite Vorgabe).
- **CI-Workflow unangetastet** (`npm install` + `ensure-native-binaries.mjs` +
  `404.html` — nötig für die plattformspezifischen nativen Binaries auf dem
  Linux-Runner).
- **Chunk-Size-Warnung des Builds** (ClassDiagramPage ≈ 1,4 MB durch elkjs):
  bekannter, harmloser Hinweis; die Seite ist lazy-geladen, elkjs wird nur dort gezogen.

## Verifikation nach den Änderungen

- `npm run build` ✓ grün (tsc + vite) · `npm run lint` ✓ 0 Probleme
- Inhalts-Validierung ✓ 0 Fehler
- Playwright-Sweep ✓ 9 Routen × 2 Modi ohne Konsolen-/Seitenfehler; Initial-Pfeil,
  Aktivierungsbalken, Roadmap-Liste, „x / 6", „Hohe Priorität", Alle-82-Fit (42 %),
  Enums-Ansicht ohne Crash, Prototyp-App ohne 404 — alle per Screenshot bestätigt.
