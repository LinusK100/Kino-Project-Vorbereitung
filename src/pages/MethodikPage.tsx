// Meta-Abschnitt „Arbeitsweise & Reproduzierbarkeit". Bewusst als eigenständiges,
// technisches „Engineering-Panel" gestaltet (dunkle Fläche, Cyan-Akzent, Mono-
// Details) – es hebt sich vom hellen Karten-Look der Inhalts-Abschnitte ab, weil
// es ein anderes Thema ist: der Prozess selbst. Zusammenhänge als Ablauf-Pipeline,
// knappe Stichpunkte statt Fließtext.
import { Fragment } from 'react'
import {
  GitBranch, ShieldCheck, FileText, Wrench, Rocket, Sparkles,
  BookOpenCheck, PencilRuler, RotateCw,
} from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { JsonZuSvg } from '@/components/presentation/visuals/product'
import type { PresentationStep } from '@/types'

const ACCENT = '#475569'   // neutrales Slate für Kopf/Nav (Meta-Abschnitt)
const CYAN = '#4dd6f0'     // technischer Highlight-Ton im Panel

// Der Kreislauf jeder Änderung – die Kernaussage des Abschnitts.
const STAGES = [
  { icon: BookOpenCheck, title: 'Regeln', mono: 'CLAUDE.md', keys: ['Leitplanken', 'nur JSON-Daten'] },
  { icon: PencilRuler, title: 'Ändern', keys: ['Datei lesen', 'Zahlen aus Daten'] },
  { icon: ShieldCheck, title: 'Prüfen', gate: true, keys: ['lint 0', 'build', 'Playwright · 0 Fehler', 'Daten-Check'] },
  { icon: GitBranch, title: 'Festhalten', mono: 'PROGRESS.md', keys: ['dokumentieren', 'commit → main'] },
  { icon: Rocket, title: 'Deployen', keys: ['GitHub Actions', 'Pages · live', 'gegengeprüft'] },
]

// GitHub-Actions-Kette (löst der Push auf main aus)
const CI = ['npm install', 'native binaries', 'npm run build', 'cp → 404.html', 'Pages · live']

const WERKZEUGE = [
  'Git & GitHub', 'npm · Vite · TypeScript', 'Playwright + System-Chrome',
  'Node-Skripte', 'GitHub REST API', 'Claude Code',
]

const DATEIEN = [
  { name: 'CLAUDE.md', zweck: 'Leitplanken, Befehle & Deploy' },
  { name: 'docs/PROGRESS.md', zweck: 'Changelog nach jeder Änderung' },
  { name: 'docs/ARCHITECTURE.md', zweck: 'Farb-Token & Komponenten-Verträge' },
  { name: 'docs/REVIEW_REPORT.md', zweck: 'Momentaufnahme des Reviews' },
  { name: 'README.md', zweck: 'Einstieg, Live-Link, Schnellstart' },
]

const steps: PresentationStep[] = [
  {
    id: 'quelle', title: 'Eine Datenquelle, ein Design', visual: <JsonZuSvg />,
    body: 'Alle Inhalte liegen als JSON vor. Zahlen werden daraus berechnet, Diagramme live als SVG gerendert – Website und Daten können nicht auseinanderlaufen.',
  },
  {
    id: 'verify', title: 'Jede Änderung wird verifiziert',
    body: 'Vor jeder Veröffentlichung müssen Lint und Build grün sein, alle Touren werden headless mit Playwright durchgeklickt (0 Konsolenfehler, Screenshots gesichtet) und die Daten per Node-Skript gegengeprüft.',
  },
  {
    id: 'deploy', title: 'Push → GitHub Actions → Live',
    body: 'Ein Push auf main baut und veröffentlicht die Seite automatisch über GitHub Actions auf Pages. Danach wird die Live-Seite gegengeprüft: gleicher Build-Hash, Inhalt im Bundle, HTTP 200.',
  },
  {
    id: 'ki', title: 'KI-gestützt, aber überprüft',
    body: 'Umgesetzt mit Claude Code entlang der Regeln in CLAUDE.md. Der Wert liegt im festen Ablauf – gezielt ändern, real testen, dokumentieren, gegenprüfen – jeder Schritt nachvollziehbar.',
  },
]

export default function MethodikPage() {
  return (
    <SectionShell
      kicker="Projekt"
      title="Arbeitsweise & Reproduzierbarkeit"
      subtitle="Wie diese Website entsteht, geprüft und veröffentlicht wird"
      icon={GitBranch}
      accent={ACCENT}
      modes={false}
      presentation={steps}
      intro={
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'linear-gradient(120deg, #1b2130, #12151d)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${CYAN}22`, color: CYAN }}>
            <Sparkles size={15} />
          </span>
          <p className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.82)' }}>
            KI-gestützt mit <strong style={{ color: '#fff' }}>Claude Code</strong> umgesetzt – nach einem festen,
            überprüfbaren Ablauf. Kein Blindflug: eine Datenquelle, automatisierte Verifikation, CI/CD-Deploy.
          </p>
        </div>
      }
    >
      {/* ── Das technische Panel: der Kreislauf jeder Änderung ── */}
      <div
        className="rounded-2xl p-5 md:p-6 mb-4"
        style={{
          background: 'linear-gradient(160deg, #1b2130 0%, #12151d 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 16px 50px -28px rgba(0,0,0,0.6)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <RotateCw size={14} style={{ color: CYAN }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Der Kreislauf jeder Änderung
          </span>
        </div>

        {/* Pipeline (auf schmalen Schirmen horizontal scrollbar) */}
        <div className="overflow-x-auto pb-1">
          <div className="flex items-stretch gap-1.5 min-w-max">
            {STAGES.map((s, i) => {
              const Icon = s.icon
              return (
                <Fragment key={s.title}>
                  <div
                    className="flex-shrink-0 rounded-xl p-3.5 w-[176px]"
                    style={{
                      background: s.gate ? `${CYAN}12` : 'rgba(255,255,255,0.03)',
                      border: s.gate ? `1px solid ${CYAN}88` : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5" style={{ background: `${CYAN}1f`, color: CYAN }}>
                      <Icon size={16} />
                    </div>
                    <div className="text-[13px] font-bold text-white leading-tight">{s.title}</div>
                    {s.mono && <div className="text-[10px] font-mono mt-0.5" style={{ color: CYAN }}>{s.mono}</div>}
                    <ul className="mt-2 space-y-1">
                      {s.keys.map((k) => (
                        <li key={k} className="flex items-start gap-1.5 text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.62)' }}>
                          <span className="mt-[0.45em] w-1 h-1 rounded-full flex-shrink-0" style={{ background: CYAN }} />
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className="flex items-center flex-shrink-0 text-lg" style={{ color: 'rgba(255,255,255,0.3)' }}>→</div>
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>

        {/* Kreislauf-Hinweis */}
        <div className="flex items-center gap-2 mt-3 text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
          <RotateCw size={12} style={{ color: CYAN }} />
          Live-Ergebnis gegengeprüft (Build-Hash · Inhalt im Bundle · HTTP 200) — dann die nächste Änderung.
        </div>

        {/* GitHub-Actions-Detail */}
        <div className="mt-4 pt-4 flex items-center gap-x-1.5 gap-y-2 flex-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="text-[10px] font-bold uppercase tracking-wider mr-1" style={{ color: 'rgba(255,255,255,0.42)' }}>
            GitHub Actions · Push auf main
          </span>
          {CI.map((c, i) => (
            <Fragment key={c}>
              <code className="text-[10.5px] font-mono px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }}>{c}</code>
              {i < CI.length - 1 && <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>}
            </Fragment>
          ))}
        </div>
      </div>

      {/* ── Referenz: Werkzeuge + feste Dateien ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <h3 className="flex items-center gap-2 text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            <Wrench size={15} style={{ color: ACCENT }} /> Werkzeuge
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {WERKZEUGE.map((w) => (
              <span key={w} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--bg-whiteboard)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>{w}</span>
            ))}
          </div>
          <p className="text-[11px] mt-2.5" style={{ color: 'var(--text-secondary)' }}>
            Bild-Generierungs-MCP verfügbar, bewusst ungenutzt – keine KI-Bilder, alle Diagramme aus den Daten.
          </p>
        </div>

        <div className="rounded-2xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <h3 className="flex items-center gap-2 text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            <FileText size={15} style={{ color: ACCENT }} /> Feste Dateien
          </h3>
          <ul>
            {DATEIEN.map((d, i) => (
              <li
                key={d.name}
                className="flex items-baseline justify-between gap-3 py-2"
                style={{ borderTop: i > 0 ? '1px solid var(--border-color)' : 'none' }}
              >
                <code className="text-xs font-semibold flex-shrink-0" style={{ color: ACCENT }}>{d.name}</code>
                <span className="text-[11px] text-right" style={{ color: 'var(--text-secondary)' }}>{d.zweck}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  )
}
