import type { StateMachine } from '@/types'

// Two additional enum-based state machines, derived from the sequence diagrams
// and the Buchungsstatus / Zahlungsstatus enums in the class diagram.
// Shown only in "Erweitert" mode (the enums-as-state-machines expansion).
export const extraMachines: StateMachine[] = [
  {
    id: 'buchung',
    title: 'Buchungs-Lebenszyklus',
    context: 'Buchung',
    statusEnum: 'Buchungsstatus',
    initial: 'AUSSTEHEND',
    description: 'Eine Buchung entsteht beim Checkout (AUSSTEHEND), wird mit erfolgreicher Zahlung BESTÄTIGT und beim Einlass EINGELÖST. Storno ist vor dem Einlass möglich.',
    states: [
      { id: 'AUSSTEHEND', label: 'Ausstehend', kind: 'normal', color: '#d19900', description: 'Checkout läuft – Sitz ist als Hold reserviert, Zahlung noch nicht abgeschlossen.' },
      { id: 'BESTÄTIGT', label: 'Bestätigt', kind: 'normal', color: '#006494', description: 'Zahlung erfolgreich; Sitz BELEGT, Ticket(s) GÜLTIG erzeugt.' },
      { id: 'EINGELÖST', label: 'Eingelöst', kind: 'final', color: '#006494', description: 'Alle Tickets der Buchung wurden beim Einlass validiert.' },
      { id: 'STORNIERT', label: 'Storniert', kind: 'final', color: '#a13544', description: 'Buchung zurückgenommen; Sitz wieder frei, Zahlung erstattet.' },
    ],
    transitions: [
      { id: 'b0', from: '_initial', to: 'AUSSTEHEND', event: 'anlegen(antrag)', actor: 'BuchungService' },
      { id: 'b1', from: 'AUSSTEHEND', to: 'BESTÄTIGT', event: 'bestätigen()', guard: 'Zahlung ERFOLGREICH', actor: 'BuchungService' },
      { id: 'b2', from: 'AUSSTEHEND', to: 'STORNIERT', event: 'abbrechen()', guard: 'Zahlung fehlgeschlagen / Hold-Timeout', actor: 'System' },
      { id: 'b3', from: 'BESTÄTIGT', to: 'EINGELÖST', event: 'einchecken()', guard: 'QR validiert', actor: 'EinlassService' },
      { id: 'b4', from: 'BESTÄTIGT', to: 'STORNIERT', event: 'stornieren()', guard: 'vor Vorstellungsbeginn', actor: 'Kassierer / Kunde' },
    ],
  },
  {
    id: 'zahlung',
    title: 'Zahlungs-Lebenszyklus',
    context: 'Zahlung',
    statusEnum: 'Zahlungsstatus',
    initial: 'AUSSTEHEND',
    description: 'Eine Zahlung wird verarbeitet (AUSSTEHEND), gelingt (ERFOLGREICH) oder scheitert (FEHLGESCHLAGEN). Bei Storno wird eine erfolgreiche Zahlung erstattet.',
    states: [
      { id: 'AUSSTEHEND', label: 'Ausstehend', kind: 'normal', color: '#d19900', description: 'Transaktion wird verarbeitet.' },
      { id: 'ERFOLGREICH', label: 'Erfolgreich', kind: 'normal', color: '#437a22', description: 'Betrag erfolgreich eingezogen; Buchung kann bestätigt werden.' },
      { id: 'FEHLGESCHLAGEN', label: 'Fehlgeschlagen', kind: 'final', color: '#a13544', description: 'Zahlung abgelehnt; Hold bleibt kurz aktiv, Buchung nicht bestätigt.' },
      { id: 'ERSTATTET', label: 'Erstattet', kind: 'final', color: '#7a39bb', description: 'Bei Storno zurückgebucht.' },
    ],
    transitions: [
      { id: 'z0', from: '_initial', to: 'AUSSTEHEND', event: 'verarbeiten()', actor: 'BuchungService' },
      { id: 'z1', from: 'AUSSTEHEND', to: 'ERFOLGREICH', event: 'ok', guard: 'Autorisierung erteilt', actor: 'Zahlung' },
      { id: 'z2', from: 'AUSSTEHEND', to: 'FEHLGESCHLAGEN', event: 'abgelehnt', guard: 'Deckung/Autorisierung fehlt', actor: 'Zahlung' },
      { id: 'z3', from: 'ERFOLGREICH', to: 'ERSTATTET', event: 'erstatten()', guard: 'Storno', actor: 'BuchungService' },
    ],
  },
]
