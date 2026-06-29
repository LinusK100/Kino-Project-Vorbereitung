import { useReducer } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronLeft, Check, QrCode, Download,
  Home, Search, Star, Clock, Wifi, Battery, Signal,
  MapPin, Film, Zap, Heart, Share2, Ticket, User,
  ShieldCheck, ChevronRight, Bell, CreditCard, HelpCircle, LogOut, BookOpen,
  Smartphone, ExternalLink, Rocket,
} from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { screenVariants } from '@/lib/transitions'
import { useAppStore } from '@/store/appStore'
import { prototype } from '@/data/content'
import type { PresentationStep } from '@/types'

const ACCENT = '#964219'
// The full interactive Hi-Fi prototype is a separate app; this section is the
// only place that opens an external tab (per project requirement).
const PROTOTYPE_URL = import.meta.env.BASE_URL + 'prototyp-app/'

const protoSteps: PresentationStep[] = [
  { id: 'intro', title: 'Prototyp', body: 'Der Prototyp setzt den MVP-Kern als klickbares Hi-Fi-Modell um. Hier siehst du den Online-Buchungs-Flow eines Studenten Schritt für Schritt.', target: '[data-pres="section-header"]' },
  { id: 'launch', title: 'In neuem Tab starten', body: 'Der vollständige interaktive Prototyp öffnet sich als eigene App in einem neuen Tab – als einziger Abschnitt der Website.', target: '[data-pres="launch"]' },
  { id: 'phone', title: 'Klickbarer Flow', body: 'Im iPhone-Rahmen klickst du dich durch: Home → Film → Sitzplan → Checkout → Bestätigung. Genau der Flow aus dem Sequenzdiagramm „Online-Buchung".', target: '[data-pres="phone"]' },
  { id: 'roadmap', title: 'Erweitert: Roadmap', body: 'Im Erweitert-Modus siehst du, welche Module schon implementiert sind und welche als Roadmap modelliert wurden (Modell ⊇ Prototyp).', target: '[data-pres="status"]', mode: 'erweitert' },
]

type Screen = 'home' | 'detail' | 'seats' | 'checkout' | 'confirm' | 'profile'

interface PrototypeState {
  screen: Screen
  selectedTime: string | null
  selectedSeats: string[]
  paymentMethod: string | null
  wishlist: boolean
}

type Action =
  | { type: 'GO_TO'; screen: Screen }
  | { type: 'SELECT_TIME'; time: string }
  | { type: 'TOGGLE_SEAT'; seat: string }
  | { type: 'SELECT_PAYMENT'; method: string }
  | { type: 'TOGGLE_WISH' }
  | { type: 'RESET' }

function reducer(state: PrototypeState, action: Action): PrototypeState {
  switch (action.type) {
    case 'GO_TO': return { ...state, screen: action.screen }
    case 'SELECT_TIME': return { ...state, selectedTime: action.time }
    case 'TOGGLE_SEAT':
      return {
        ...state,
        selectedSeats: state.selectedSeats.includes(action.seat)
          ? state.selectedSeats.filter(s => s !== action.seat)
          : state.selectedSeats.length < 4
            ? [...state.selectedSeats, action.seat]
            : state.selectedSeats,
      }
    case 'SELECT_PAYMENT': return { ...state, paymentMethod: action.method }
    case 'TOGGLE_WISH': return { ...state, wishlist: !state.wishlist }
    case 'RESET': return initialState
    default: return state
  }
}

const initialState: PrototypeState = {
  screen: 'home',
  selectedTime: null,
  selectedSeats: [],
  paymentMethod: null,
  wishlist: false,
}

const screenInfo: Record<Screen, { title: string; desc: string; step: number }> = {
  home: { title: 'Home Screen', desc: 'Filmsuche, Featured Banner und Empfehlungen', step: 1 },
  detail: { title: 'Film-Detail', desc: 'Filminfo, Trailer-Placeholder, Vorstellungszeiten wählen', step: 2 },
  seats: { title: 'Sitzplan', desc: 'Interaktiver Saalplan – bis zu 4 Sitze wählbar', step: 3 },
  checkout: { title: 'Checkout', desc: 'Bestellübersicht, Studentenrabatt & Zahlung', step: 4 },
  confirm: { title: 'Bestätigung', desc: 'QR-Code-Ticket und Download-Option', step: 5 },
  profile: { title: 'Profil', desc: 'Nutzerprofil, Buchungshistorie und Einstellungen', step: 6 },
}

const screens: Screen[] = ['home', 'detail', 'seats', 'checkout', 'confirm', 'profile']
const times = [
  { t: '14:30', hall: 'Saal 2', available: true },
  { t: '17:00', hall: 'Saal 4', available: true },
  { t: '20:15', hall: 'Saal 1', available: true },
  { t: '22:45', hall: 'Saal 3', available: false },
]

const PRICE_PER_SEAT = 13.50
const STUDENT_DISCOUNT = 0.20

function generateSeats() {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const occupied = new Set(['A3', 'A4', 'B5', 'B6', 'C2', 'D7', 'D8', 'E1', 'F3', 'F4', 'F5', 'G2', 'G6'])
  const premium = new Set(['D3', 'D4', 'D5', 'D6', 'E3', 'E4', 'E5', 'E6'])
  return rows.map(row =>
    [1, 2, 3, 4, 5, 6, 7, 8].map(col => ({
      id: `${row}${col}`, row, col,
      occupied: occupied.has(`${row}${col}`),
      premium: premium.has(`${row}${col}`),
    }))
  )
}
const seatGrid = generateSeats()

// ── STATUS BAR ───────────────────────────────────────────
function StatusBar({ light = false }: { light?: boolean }) {
  const c = light ? 'rgba(255,255,255,0.9)' : '#1a1a1a'
  return (
    <div
      className="absolute z-30 flex items-center justify-between px-5"
      style={{
        top: '15px',
        left: 0,
        right: 0,
        height: '20px',
        fontSize: '11px',
        color: c,
        fontWeight: 600,
        WebkitMaskImage: 'linear-gradient(to right, black 0%, black calc(50% - 70px), transparent calc(50% - 65px), transparent calc(50% + 65px), black calc(50% + 70px), black 100%)',
        maskImage: 'linear-gradient(to right, black 0%, black calc(50% - 70px), transparent calc(50% - 65px), transparent calc(50% + 65px), black calc(50% + 70px), black 100%)',
        pointerEvents: 'none',
      }}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={12} />
        <Wifi size={12} />
        <Battery size={12} />
      </div>
    </div>
  )
}

// ── TAB BAR ──────────────────────────────────────────────
function TabBar({ activeScreen, dispatch }: { activeScreen: Screen; dispatch: React.Dispatch<Action> }) {
  const tabs: { icon: React.ElementType; label: string; screen: Screen }[] = [
    { icon: Home, label: 'Home', screen: 'home' },
    { icon: Film, label: 'Programm', screen: 'detail' },
    { icon: Ticket, label: 'Tickets', screen: 'confirm' },
    { icon: User, label: 'Profil', screen: 'profile' },
  ]

  const activeTab =
    activeScreen === 'home' ? 'Home'
    : activeScreen === 'detail' || activeScreen === 'seats' || activeScreen === 'checkout' ? 'Programm'
    : activeScreen === 'confirm' ? 'Tickets'
    : activeScreen === 'profile' ? 'Profil'
    : 'Home'

  return (
    <div
      className="flex-shrink-0 flex justify-around items-center py-2 px-2 border-t"
      style={{ background: 'white', borderColor: '#f3f4f6' }}
    >
      {tabs.map(({ icon: Icon, label, screen }) => {
        const active = label === activeTab
        return (
          <button
            key={label}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
            onClick={() => dispatch({ type: 'GO_TO', screen })}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: active ? '#01696f' : 'transparent' }}
            >
              <Icon size={18} style={{ color: active ? 'white' : '#9ca3af' }} />
            </div>
            <span className="text-xs" style={{ color: active ? '#01696f' : '#9ca3af', fontWeight: active ? 600 : 400 }}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── HOME SCREEN ──────────────────────────────────────────
function HomeScreen({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Dark hero area — starts at top:0 so gradient reaches behind Dynamic Island */}
      <div style={{ background: 'linear-gradient(160deg, #0d1117 0%, #1a1a2e 100%)', paddingTop: '54px' }}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Heute, 9. Juni</p>
            <p className="font-bold text-white text-base">Guten Abend, Jonas 👋</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: '#a12c7b', color: 'white' }}
          >JS</div>
        </div>

        {/* Search */}
        <div className="px-5 pb-4">
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <Search size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Film, Kino, Genre suchen…</span>
          </div>
        </div>

        {/* Featured Banner */}
        <div
          className="mx-5 rounded-2xl overflow-hidden cursor-pointer mb-5"
          style={{
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onClick={() => dispatch({ type: 'GO_TO', screen: 'detail' })}
        >
          <div className="p-4 pb-5">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#f59e0b', color: '#000' }}
              >
                ★ Top-Pick
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Sci-Fi · 169 Min</span>
            </div>
            <h3 className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Interstellar
            </h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Ein Astronauten-Team reist durchs All auf der Suche nach einer neuen Heimat für die Menschheit.
            </p>
            <div
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center"
              style={{ background: '#01696f' }}
            >
              Jetzt Ticket sichern →
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>Empfohlen für dich</p>
            <button className="text-xs font-medium" style={{ color: '#01696f' }}>Alle sehen</button>
          </div>

          <div className="space-y-2">
            {[
              { emoji: '🎭', title: 'Everything Everywhere', genre: 'Drama · Komödie', rating: '4.9', time: '139 Min', price: '11 €', fsk: '16' },
              { emoji: '💣', title: 'Oppenheimer', genre: 'Drama · Biopic', rating: '4.8', time: '180 Min', price: '11 €', fsk: '12' },
              { emoji: '🧊', title: 'The Zone of Interest', genre: 'Drama', rating: '4.6', time: '105 Min', price: '10 €', fsk: '12' },
            ].map((film) => (
              <div
                key={film.title}
                className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer"
                style={{ background: 'white', border: '1px solid #f3f4f6' }}
                onClick={() => dispatch({ type: 'GO_TO', screen: 'detail' })}
              >
                <div
                  className="w-12 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: '#f3f4f6' }}
                >
                  {film.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm leading-tight truncate" style={{ color: '#1a1a1a' }}>
                      {film.title}
                    </p>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: '#01696f' }}>{film.price}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{film.genre}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star size={10} fill="#f59e0b" color="#f59e0b" />
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{film.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} style={{ color: '#9ca3af' }} />
                      <span className="text-xs" style={{ color: '#6b7280' }}>{film.time}</span>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: '#f3f4f6', color: '#6b7280', fontSize: '9px' }}>
                      FSK {film.fsk}
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: '#d1d5db', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── DETAIL SCREEN ────────────────────────────────────────
function DetailScreen({ state, dispatch }: { state: PrototypeState; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      {/* Hero */}
      <div
        className="relative flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #0d1117, #1a1a2e)', height: '200px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '2px solid rgba(255,255,255,0.3)' }}
          >
            <div className="w-0 h-0" style={{ borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid white', marginLeft: '3px' }} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(transparent, rgba(13,17,23,0.95))' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#f59e0b', color: '#000' }}>
              ★ 8.6
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Sci-Fi · 2014 · 169 Min · FSK 12</span>
          </div>
          <h2 className="text-white font-bold text-2xl" style={{ fontFamily: 'var(--font-display)' }}>Interstellar</h2>
        </div>

        {/* Fix 2.3a/b: buttons unterhalb Dynamic Island (top: 54px) */}
        <button
          className="absolute left-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ top: '54px', background: 'rgba(0,0,0,0.4)' }}
          onClick={() => dispatch({ type: 'GO_TO', screen: 'home' })}
        >
          <ChevronLeft size={16} color="white" />
        </button>

        <div className="absolute right-4 flex gap-2" style={{ top: '54px' }}>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={() => dispatch({ type: 'TOGGLE_WISH' })}
          >
            <Heart
              size={14}
              color={state.wishlist ? '#ef4444' : 'white'}
              fill={state.wishlist ? '#ef4444' : 'none'}
            />
          </button>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <Share2 size={14} color="white" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 py-4">
        {/* Quick info */}
        <div className="flex gap-4 mb-4">
          {[
            { icon: MapPin, text: 'Saal 1–4' },
            { icon: Zap, text: 'Dolby Atmos' },
            { icon: ShieldCheck, text: 'Ab 12' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-xs" style={{ color: '#6b7280' }}>
              <Icon size={12} style={{ color: '#01696f' }} />
              {text}
            </div>
          ))}
        </div>

        <p className="text-sm leading-relaxed mb-5" style={{ color: '#374151' }}>
          Ein Team von Astronauten reist durch ein Wurmloch, um eine neue Heimat für die Menschheit zu finden. Ein episches Sci-Fi-Abenteuer über Zeit, Liebe und das Überleben der Menschheit.
        </p>

        <h4 className="font-semibold text-sm mb-3" style={{ color: '#1a1a1a' }}>Vorstellung wählen</h4>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {times.map(({ t, hall, available }) => {
            const sel = state.selectedTime === t
            return (
              <button
                key={t}
                className="p-3 rounded-xl text-left transition-all"
                style={{
                  background: !available ? '#f9fafb' : sel ? '#01696f' : 'white',
                  border: `1.5px solid ${!available ? '#e5e7eb' : sel ? '#01696f' : '#e5e7eb'}`,
                  cursor: available ? 'pointer' : 'not-allowed',
                  opacity: !available ? 0.5 : 1,
                }}
                disabled={!available}
                onClick={() => available && dispatch({ type: 'SELECT_TIME', time: t })}
              >
                <p className="font-bold text-base" style={{ color: sel ? 'white' : '#1a1a1a' }}>{t}</p>
                <p className="text-xs mt-0.5" style={{ color: sel ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>{hall}</p>
                {!available && (
                  <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>Ausverkauft</p>
                )}
              </button>
            )
          })}
        </div>

        <button
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all"
          style={{
            background: state.selectedTime ? '#01696f' : '#f3f4f6',
            color: state.selectedTime ? 'white' : '#9ca3af',
          }}
          disabled={!state.selectedTime}
          onClick={() => state.selectedTime && dispatch({ type: 'GO_TO', screen: 'seats' })}
        >
          {state.selectedTime ? `Weiter · ${state.selectedTime} Uhr →` : 'Vorstellung wählen'}
        </button>
      </div>
    </div>
  )
}

// ── SEATS SCREEN ─────────────────────────────────────────
function SeatsScreen({ state, dispatch }: { state: PrototypeState; dispatch: React.Dispatch<Action> }) {
  const subtotal = state.selectedSeats.length * PRICE_PER_SEAT
  const discount = subtotal * STUDENT_DISCOUNT
  const total = subtotal - discount

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Fix 2.3c: paddingTop für StatusBar-Bereich */}
      <div
        className="flex items-center gap-3 px-4 py-2 border-b"
        style={{ borderColor: '#f3f4f6', paddingTop: '54px' }}
      >
        <button
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#f3f4f6' }}
          onClick={() => dispatch({ type: 'GO_TO', screen: 'detail' })}
        >
          <ChevronLeft size={16} style={{ color: '#1a1a1a' }} />
        </button>
        <div>
          <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>Sitzplan</p>
          <p className="text-xs" style={{ color: '#6b7280' }}>Interstellar · {state.selectedTime} · max. 4 Plätze</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 pt-3">
        {/* Screen */}
        <div className="mb-4 text-center">
          <div
            className="mx-auto rounded-b-3xl mb-1"
            style={{ width: '70%', height: '6px', background: 'linear-gradient(90deg, transparent, #01696f, transparent)' }}
          />
          <p className="text-xs font-medium" style={{ color: '#9ca3af', letterSpacing: '0.1em' }}>LEINWAND</p>
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-1.5 items-center mb-3">
          {seatGrid.map((row) => (
            <div key={row[0].row} className="flex items-center gap-1">
              <span className="text-xs w-5 text-right font-mono flex-shrink-0" style={{ color: '#d1d5db' }}>
                {row[0].row}
              </span>
              <div className="flex gap-0.5">
                {row.slice(0, 4).map((seat) => {
                  const isSel = state.selectedSeats.includes(seat.id)
                  return (
                    <button
                      key={seat.id}
                      className="transition-all rounded-t-md"
                      style={{
                        width: '22px', height: '18px',
                        background: seat.occupied ? '#e5e7eb' : isSel ? '#01696f' : seat.premium ? '#daeced' : '#d1fae5',
                        border: `1px solid ${seat.occupied ? '#d1d5db' : isSel ? '#015a5f' : seat.premium ? '#01696f' : '#6ee7b7'}`,
                        cursor: seat.occupied ? 'not-allowed' : 'pointer',
                        transform: isSel ? 'scaleY(0.92)' : 'none',
                      }}
                      disabled={seat.occupied}
                      onClick={() => !seat.occupied && dispatch({ type: 'TOGGLE_SEAT', seat: seat.id })}
                      aria-label={`Sitz ${seat.id}`}
                    />
                  )
                })}
              </div>
              <div className="w-1" />
              <div className="flex gap-0.5">
                {row.slice(4).map((seat) => {
                  const isSel = state.selectedSeats.includes(seat.id)
                  return (
                    <button
                      key={seat.id}
                      className="transition-all rounded-t-md"
                      style={{
                        width: '22px', height: '18px',
                        background: seat.occupied ? '#e5e7eb' : isSel ? '#01696f' : seat.premium ? '#daeced' : '#d1fae5',
                        border: `1px solid ${seat.occupied ? '#d1d5db' : isSel ? '#015a5f' : seat.premium ? '#01696f' : '#6ee7b7'}`,
                        cursor: seat.occupied ? 'not-allowed' : 'pointer',
                        transform: isSel ? 'scaleY(0.92)' : 'none',
                      }}
                      disabled={seat.occupied}
                      onClick={() => !seat.occupied && dispatch({ type: 'TOGGLE_SEAT', seat: seat.id })}
                      aria-label={`Sitz ${seat.id}`}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 py-2 text-xs" style={{ color: '#6b7280' }}>
          {[
            { bg: '#d1fae5', border: '#6ee7b7', label: 'Frei' },
            { bg: '#daeced', border: '#01696f', label: 'Premium' },
            { bg: '#01696f', border: '#015a5f', label: 'Gewählt' },
            { bg: '#e5e7eb', border: '#d1d5db', label: 'Belegt' },
          ].map(({ bg, border, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-3 h-2.5 rounded-t-sm" style={{ background: bg, border: `1px solid ${border}` }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t" style={{ borderColor: '#f3f4f6' }}>
        {state.selectedSeats.length > 0 && (
          <div className="flex justify-between text-xs mb-2" style={{ color: '#6b7280' }}>
            <span>{state.selectedSeats.join(', ')}</span>
            <span className="font-semibold" style={{ color: '#1a1a1a' }}>
              {total.toFixed(2).replace('.', ',')} €
              <span className="ml-1 font-normal" style={{ color: '#16a34a' }}>(-20%)</span>
            </span>
          </div>
        )}
        <button
          className="w-full py-3 rounded-2xl font-semibold text-sm transition-all"
          style={{
            background: state.selectedSeats.length > 0 ? '#01696f' : '#f3f4f6',
            color: state.selectedSeats.length > 0 ? 'white' : '#9ca3af',
          }}
          disabled={state.selectedSeats.length === 0}
          onClick={() => state.selectedSeats.length > 0 && dispatch({ type: 'GO_TO', screen: 'checkout' })}
        >
          {state.selectedSeats.length > 0
            ? `${state.selectedSeats.length} Platz${state.selectedSeats.length > 1 ? 'ätze' : ''} gewählt → Weiter`
            : 'Platz auswählen'}
        </button>
      </div>
    </div>
  )
}

// ── CHECKOUT SCREEN ──────────────────────────────────────
function CheckoutScreen({ state, dispatch }: { state: PrototypeState; dispatch: React.Dispatch<Action> }) {
  const subtotal = state.selectedSeats.length * PRICE_PER_SEAT
  const discount = subtotal * STUDENT_DISCOUNT
  const total = subtotal - discount

  const methods = [
    { id: 'card', icon: '💳', label: 'Kreditkarte / Debit', sub: '•••• 4242' },
    { id: 'apple', icon: '', label: 'Apple Pay', sub: 'Face ID oder Touch ID' },
    { id: 'paypal', icon: '🅿', label: 'PayPal', sub: 'lena@example.de' },
  ]

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      <div className="bg-white border-b" style={{ borderColor: '#f3f4f6', paddingTop: '54px' }}>
        <div className="flex items-center gap-3 px-4 py-2">
          <button
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#f3f4f6' }}
            onClick={() => dispatch({ type: 'GO_TO', screen: 'seats' })}
          >
            <ChevronLeft size={16} />
          </button>
          <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>Bestellung abschließen</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-3 space-y-3">
        {/* Order Card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #f3f4f6' }}>
          <div className="flex gap-3 p-4">
            <div
              className="w-12 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: '#0d1117' }}
            >
              🎬
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: '#1a1a1a' }}>Interstellar</p>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{state.selectedTime} Uhr</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>Sitze: {state.selectedSeats.join(', ')}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  Studentenrabatt −20%
                </span>
              </div>
            </div>
          </div>

          <div className="border-t mx-4" style={{ borderColor: '#f9fafb' }} />

          <div className="px-4 py-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#6b7280' }}>{state.selectedSeats.length}× Ticket (je {PRICE_PER_SEAT.toFixed(2).replace('.', ',')} €)</span>
              <span style={{ color: '#1a1a1a' }}>{subtotal.toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#16a34a' }}>Studentenrabatt (−20%)</span>
              <span style={{ color: '#16a34a' }}>−{discount.toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2" style={{ borderColor: '#f3f4f6', color: '#1a1a1a' }}>
              <span>Gesamt</span>
              <span style={{ color: '#01696f' }}>{total.toFixed(2).replace('.', ',')} €</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: '#9ca3af' }}>
            Zahlungsmethode
          </p>
          <div className="space-y-2">
            {methods.map(({ id, icon, label, sub }) => {
              const sel = state.paymentMethod === id
              return (
                <button
                  key={id}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all"
                  style={{
                    background: sel ? '#01696f' : 'white',
                    border: `1.5px solid ${sel ? '#01696f' : '#f3f4f6'}`,
                  }}
                  onClick={() => dispatch({ type: 'SELECT_PAYMENT', method: id })}
                >
                  <span className="text-xl w-8 text-center flex-shrink-0">{icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: sel ? 'white' : '#1a1a1a' }}>{label}</p>
                    <p className="text-xs" style={{ color: sel ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}>{sub}</p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: sel ? 'white' : '#d1d5db' }}
                  >
                    {sel && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' }}
        >
          <ShieldCheck size={14} style={{ flexShrink: 0 }} />
          Sichere Verbindung · SSL-verschlüsselt · Keine versteckten Gebühren
        </div>
      </div>

      <div className="px-4 py-3 bg-white border-t" style={{ borderColor: '#f3f4f6' }}>
        <button
          className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all"
          style={{
            background: state.paymentMethod ? '#01696f' : '#f3f4f6',
            color: state.paymentMethod ? 'white' : '#9ca3af',
          }}
          disabled={!state.paymentMethod}
          onClick={() => state.paymentMethod && dispatch({ type: 'GO_TO', screen: 'confirm' })}
        >
          {state.paymentMethod ? `Jetzt buchen · ${total.toFixed(2).replace('.', ',')} €` : 'Zahlungsmethode wählen'}
        </button>
      </div>
    </div>
  )
}

// ── CONFIRM SCREEN ───────────────────────────────────────
function ConfirmScreen({ state, dispatch }: { state: PrototypeState; dispatch: React.Dispatch<Action> }) {
  const subtotal = state.selectedSeats.length * PRICE_PER_SEAT
  const total = subtotal * (1 - STUDENT_DISCOUNT)

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Fix 2.3d: mehr Abstand oben nach StatusBar */}
      <div
        className="flex flex-col items-center pb-6 px-6"
        style={{ background: 'linear-gradient(160deg, #f0fdf4, #dcfce7)', paddingTop: '62px' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
          style={{ background: '#16a34a' }}
        >
          <Check size={28} color="white" strokeWidth={3} />
        </motion.div>
        <h3 className="font-bold text-xl mb-1" style={{ color: '#15803d' }}>Buchung bestätigt!</h3>
        <p className="text-sm text-center" style={{ color: '#6b7280' }}>
          Dein Ticket wird per E-Mail gesendet.
        </p>
      </div>

      <div className="flex-1 px-5 py-4 space-y-4">
        {/* QR Ticket Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          {/* Ticket top */}
          <div
            className="px-5 py-4"
            style={{ background: 'linear-gradient(135deg, #0d1117, #1a1a2e)' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>CineTicket</p>
                <h4 className="font-bold text-white text-lg" style={{ fontFamily: 'var(--font-display)' }}>Interstellar</h4>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Sci-Fi · 169 Min · FSK 12</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: '#01696f', color: 'white' }}>
                ✓ Gültig
              </span>
            </div>
          </div>

          {/* Dashed divider */}
          <div className="relative flex items-center">
            <div className="w-5 h-5 rounded-full flex-shrink-0 -ml-2.5" style={{ background: '#f3f4f6' }} />
            <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: '#e5e7eb' }} />
            <div className="w-5 h-5 rounded-full flex-shrink-0 -mr-2.5" style={{ background: '#f3f4f6' }} />
          </div>

          {/* Ticket details */}
          <div className="px-5 py-4">
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              {[
                { label: 'Datum', value: '9. Juni 2026' },
                { label: 'Uhrzeit', value: `${state.selectedTime ?? '–'} Uhr` },
                { label: 'Sitze', value: state.selectedSeats.join(', ') || '–' },
                { label: 'Preis', value: `${total.toFixed(2).replace('.', ',')} €` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{label}</p>
                  <p className="font-semibold" style={{ color: '#1a1a1a' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* QR Code */}
            <div
              className="flex flex-col items-center py-4 rounded-xl"
              style={{ background: '#f9fafb' }}
            >
              <QrCode size={100} style={{ color: '#1a1a1a' }} />
              <p className="text-xs mt-2 font-mono font-bold" style={{ color: '#9ca3af' }}>
                CIN-2026-A7F3K2
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <button
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm"
          style={{ background: '#01696f', color: 'white' }}
        >
          <Download size={16} />
          Ticket speichern / drucken
        </button>

        <button
          className="w-full py-3 rounded-2xl text-sm font-medium"
          style={{ background: '#f3f4f6', color: '#6b7280' }}
          onClick={() => dispatch({ type: 'RESET' })}
        >
          Zurück zum Start
        </button>
      </div>
    </div>
  )
}

// ── PROFILE SCREEN ───────────────────────────────────────
function ProfileScreen({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  const history = [
    { title: 'Interstellar', date: '9. Juni 2026', seats: 'D4, D5', price: '21,60 €', hall: 'Saal 1' },
    { title: 'Oppenheimer', date: '14. Mai 2026', seats: 'E3', price: '10,80 €', hall: 'Saal 2' },
    { title: 'Everything Everywhere', date: '2. April 2026', seats: 'B6, B7', price: '21,60 €', hall: 'Saal 4' },
  ]

  const settings = [
    { icon: Bell, label: 'Benachrichtigungen', sub: 'Push & E-Mail aktiv' },
    { icon: CreditCard, label: 'Zahlungsmethoden', sub: 'Kreditkarte •••• 4242' },
    { icon: BookOpen, label: 'Studentenstatus', sub: 'Verifiziert bis Sep 2026' },
    { icon: HelpCircle, label: 'Hilfe & Support', sub: 'FAQ, Kontakt' },
  ]

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pb-5"
        style={{ background: 'linear-gradient(160deg, #0d1117 0%, #1a1a2e 100%)', paddingTop: '54px' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white flex-shrink-0"
            style={{ background: '#a12c7b', border: '3px solid rgba(255,255,255,0.2)' }}
          >JS</div>
          <div>
            <p className="font-bold text-white text-lg">Jonas Schmidt</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>lena@example.de</p>
            <span
              className="inline-block text-xs px-2 py-0.5 rounded-full font-semibold mt-1.5"
              style={{ background: '#01696f', color: 'white' }}
            >
              Studentin · verifiziert
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          {[
            { value: '3', label: 'Buchungen' },
            { value: '53,00 €', label: 'Gespart' },
            { value: '7', label: 'Filme gesehen' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex-1 rounded-xl px-3 py-2 text-center"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p className="font-bold text-white text-base">{value}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Buchungshistorie */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: '#9ca3af' }}>
            Buchungshistorie
          </p>
          <div className="space-y-2">
            {history.map((booking) => (
              <div
                key={booking.title + booking.date}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: 'white', border: '1px solid #f3f4f6' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: '#0d1117' }}
                >
                  🎬
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#1a1a1a' }}>{booking.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                    {booking.date} · {booking.hall} · Plätze {booking.seats}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold" style={{ color: '#01696f' }}>{booking.price}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>−20%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Einstellungen */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: '#9ca3af' }}>
            Einstellungen
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #f3f4f6' }}>
            {settings.map(({ icon: Icon, label, sub }, idx) => (
              <button
                key={label}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
                style={{ borderBottom: idx < settings.length - 1 ? '1px solid #f9fafb' : 'none' }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#f3f4f6' }}
                >
                  <Icon size={15} style={{ color: '#6b7280' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{label}</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{sub}</p>
                </div>
                <ChevronRight size={14} style={{ color: '#d1d5db' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Abmelden */}
        <button
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium"
          style={{ background: '#fff1f2', color: '#ef4444', border: '1px solid #fecdd3' }}
          onClick={() => dispatch({ type: 'GO_TO', screen: 'home' })}
        >
          <LogOut size={15} />
          Abmelden
        </button>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────
export default function PrototypePage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const info = screenInfo[state.screen]

  const renderScreen = () => {
    switch (state.screen) {
      case 'home': return <HomeScreen dispatch={dispatch} />
      case 'detail': return <DetailScreen state={state} dispatch={dispatch} />
      case 'seats': return <SeatsScreen state={state} dispatch={dispatch} />
      case 'checkout': return <CheckoutScreen state={state} dispatch={dispatch} />
      case 'confirm': return <ConfirmScreen state={state} dispatch={dispatch} />
      case 'profile': return <ProfileScreen dispatch={dispatch} />
    }
  }

  const { mode } = useAppStore()

  return (
    <SectionShell
      kicker="Ergebnis"
      title="Prototyp"
      subtitle="Klickbarer Hi-Fi-Prototyp · Online-Buchungs-Flow"
      icon={Smartphone}
      accent={ACCENT}
      presentation={protoSteps}
      intro={
        <div className="flex flex-col sm:flex-row sm:items-center gap-3" data-pres="launch">
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm flex-shrink-0 transition-transform hover:-translate-y-0.5"
            style={{ background: ACCENT, boxShadow: `0 4px 16px ${ACCENT}55` }}
          >
            <Rocket size={18} /> Vollständigen Prototyp starten <ExternalLink size={15} />
          </a>
          <Callout kind="info">
            Der vollständige interaktive Prototyp öffnet sich in einem <strong>neuen Tab</strong> – als einziger Abschnitt der Website.
            Unten siehst du eine eingebettete Vorschau des Buchungs-Flows.
          </Callout>
        </div>
      }
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start" data-pres="phone">
        {/* Phone */}
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <div
            className="relative"
            style={{
              width: '375px',
              height: '812px',
              borderRadius: '44px',
              background: '#1a1a1a',
              padding: '10px',
              boxShadow: '0 50px 100px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(0,0,0,0.5)',
            }}
          >
            {/* Side buttons */}
            <div className="absolute" style={{ left: '-3px', top: '120px', width: '3px', height: '32px', background: '#333', borderRadius: '2px 0 0 2px' }} />
            <div className="absolute" style={{ left: '-3px', top: '170px', width: '3px', height: '56px', background: '#333', borderRadius: '2px 0 0 2px' }} />
            <div className="absolute" style={{ left: '-3px', top: '240px', width: '3px', height: '56px', background: '#333', borderRadius: '2px 0 0 2px' }} />
            <div className="absolute" style={{ right: '-3px', top: '160px', width: '3px', height: '80px', background: '#333', borderRadius: '0 2px 2px 0' }} />

            {/* Screen */}
            <div
              className="relative overflow-hidden flex flex-col"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '36px',
                background: 'white',
              }}
            >
              {/* Dynamic island */}
              <div
                className="absolute z-20"
                style={{
                  top: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '120px',
                  height: '36px',
                  background: '#1a1a1a',
                  borderRadius: '20px',
                }}
              />

              {/* Global status bar */}
              <StatusBar light={state.screen === 'home' || state.screen === 'detail'} />

              {/* Screen content — flex-1 so TabBar sticks to bottom */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.screen}
                  variants={screenVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="flex-1 overflow-hidden">
                    {renderScreen()}
                  </div>
                  <TabBar activeScreen={state.screen} dispatch={dispatch} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {screens.map((s) => (
              <button
                key={s}
                className="rounded-full transition-all duration-300"
                style={{
                  width: state.screen === s ? '28px' : '8px',
                  height: '8px',
                  background: state.screen === s ? '#01696f' : '#d1d5db',
                }}
                onClick={() => dispatch({ type: 'GO_TO', screen: s })}
                aria-label={screenInfo[s].title}
              />
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex-1 min-w-0 space-y-3 lg:pt-4">
          {/* Current screen info */}
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: '#01696f', color: 'white' }}
              >
                {info.step} / 5
              </span>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                {info.title}
              </h3>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{info.desc}</p>
          </div>

          {/* Step navigation */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
          >
            {screens.map((s, idx) => {
              const i = screenInfo[s]
              const isActive = state.screen === s
              const isDone = info.step > i.step
              const isLast = idx === screens.length - 1
              return (
                <button
                  key={s}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all text-sm"
                  style={{
                    background: isActive ? 'rgba(1,105,111,0.06)' : 'transparent',
                    borderBottom: isLast ? 'none' : '1px solid var(--border-color)',
                  }}
                  onClick={() => dispatch({ type: 'GO_TO', screen: s })}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                    style={{
                      background: isActive ? '#01696f' : isDone ? '#437a22' : 'var(--border-color)',
                      color: (isActive || isDone) ? 'white' : 'var(--text-secondary)',
                    }}
                  >
                    {isDone ? <Check size={13} /> : i.step}
                  </div>
                  <span
                    className="font-medium"
                    style={{ color: isActive ? '#01696f' : 'var(--text-secondary)' }}
                  >
                    {i.title}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#01696f' }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Persona Info */}
          <div
            className="p-4 rounded-2xl flex items-center gap-3"
            style={{ background: 'rgba(0,100,148,0.06)', border: '1px solid rgba(0,100,148,0.15)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: '#006494' }}
            >
              JS
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Jonas Schmidt</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Student · Ziel: Ticket in &lt; 60 Sek. (Story U04)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Module status & roadmap (erweitert) */}
      {mode === 'erweitert' && (
        <div className="mt-7" data-pres="status">
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Module: implementiert vs. Roadmap</h3>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            Der Prototyp setzt {prototype.stats.rollenImplementiert}/{prototype.stats.rollenGesamt} Rollen und {prototype.stats.umlImplementiert} UML-Klassen um – {prototype.stats.umlDesignOnly} sind als Roadmap modelliert (Modell ⊇ Prototyp).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {prototype.module.map((m) => (
              <div key={m.id} className="flex items-start gap-2.5 rounded-xl p-3" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                <span className="mt-0.5 text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{ background: m.status === 'implementiert' ? '#437a2220' : '#d1990020', color: m.status === 'implementiert' ? '#437a22' : '#d19900' }}>
                  {m.status === 'implementiert' ? 'live' : 'Roadmap'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.beschreibung}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionShell>
  )
}
