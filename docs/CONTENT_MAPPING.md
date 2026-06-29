# Inhalts-Mapping: Doku v5.1 → Website

Quelle: `../../CineTicket_Projektdokumentation/` (relativ zu kino-projekt).

| Abschnitt | Quelldatei(en) | Ziel in src/data | Einfach | Erweitert |
|---|---|---|---|---|
| Personas | personas/personas.json, personas-erweitert.json | personas.json, personas-erweitert.json | 4 | 12 |
| User Stories | user-stories/user-stories(.|-erweitert).json | userStories(.|Erweitert).json | 30 | 51 |
| Story Map | story-map/story-map(.|-erweitert).json | storyMap(.|Erweitert).json | 7 Akt. | 10 Akt. |
| Klassendiagramm | uml/uml-klassendiagramm.json | uml.json | implem. Kern (41) | alle 82 |
| Sequenzdiagramme | sequenzdiagramm/sequenzdiagramm.json | sequences.json | Happy-Path | + Fragmente |
| Zustandsdiagramme | zustandsautomat/zustandsautomat.json | stateMachines.json | Sitz+Ticket | +Buchung+Zahlung |
| Traceability | traceability/traceability.json | traceability.json | impl.-Sicht | volle Matrix |
| Innovation | README Innovations-Layer + erweitert. Stories | innovation.json (neu) | Top-Ideen | alle + Flags |
| Glossar | glossar.md | glossary.json (neu) | Kernbegriffe | alle |
| Prototyp | prototyp/prototyp.json | prototype.json | MVP-Screens | + Roadmap |

## Wichtige Konsistenz-Anker (aus Doku)
- Enums: Sitzstatus[FREI,AUSGEWÄHLT,RESERVIERT,BELEGT,DEFEKT];
  Ticketstatus[GÜLTIG,EINGELÖST,STORNIERT,ABGELAUFEN];
  Buchungsstatus[AUSSTEHEND,BESTÄTIGT,STORNIERT,EINGELÖST];
  Zahlungsstatus[…ERFOLGREICH,FEHLGESCHLAGEN,ERSTATTET].
- `VorstellungSitz` (Assoziationsklasse) trägt die Status-Operationen
  reservieren/belegen/freigeben/istAbgelaufen → verhindert Doppelbuchung.
- Operationen gehören an die Domänenobjekte, nicht an Nutzer/Akteure.
- Traceability verbindet Story ↔ Persona ↔ UML-Klassen ↔ Prototyp-Status.

## Umzuwandeln (neue JSON, aus Markdown extrahiert)
- innovation.json — aus README-Tabelle + erweitert. Stories (U39–U46) + Flags
  („implementiert"/„roadmap"/„konzept").
- glossary.json — aus glossar.md (Begriff → Definition, ggf. Kategorie).
