// Meta-Abschnitt „Arbeitsweise & Reproduzierbarkeit". Durchgehend in den
// Theme-Farben (ein neutraler Slate-Akzent), aber inhaltsreich: links der
// detaillierte Ablauf als nummerierte Timeline mit Stichwort-Tags, rechts das
// Regelwerk CLAUDE.md erklärt; darunter die Werkzeuge als Icon-Raster und die
// weiteren Projekt-Dateien. Editorial, nicht generisch.
import {
  GitBranch, ShieldCheck, FileText, Package, Braces, Webhook,
  Sparkles, BookOpenCheck,
} from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { JsonZuSvg } from '@/components/presentation/visuals/product'
import type { PresentationStep } from '@/types'

const ACCENT = '#64748b'   // neutrales Slate, in Hell und Dunkel gut lesbar

// Der Ablauf jeder Änderung – Titel, ein Satz, konkrete Stichworte.
const STEPS = [
  { nr: '01', t: 'Regeln aus CLAUDE.md', d: 'Zu Beginn jeder Sitzung die verbindlichen Leitplanken lesen – sie binden alles Weitere.', tags: ['Datenquelle', 'Deutsch', 'Deploy-Workflow'] },
  { nr: '02', t: 'Gezielt ändern', d: 'Die betroffene Datei erst lesen, dann präzise anpassen. Zahlen werden aus den Daten berechnet, nie hartkodiert.', tags: ['Read → Edit', 'zahlwort()'] },
  { nr: '03', t: 'Verifizieren', d: 'Nichts wird ungeprüft veröffentlicht – statische Checks und die echte App im Test.', tags: ['lint 0', 'build', 'Playwright · 0 Fehler', 'Daten-Check'] },
  { nr: '04', t: 'Dokumentieren & pushen', d: 'Ein Eintrag in PROGRESS.md hält fest, was und warum – dann commit und push auf main.', tags: ['PROGRESS.md', 'commit → main'] },
  { nr: '05', t: 'Deployen & gegenprüfen', d: 'Der Push löst GitHub Actions aus; danach wird die Live-Seite kontrolliert.', tags: ['GitHub Actions', '404-Fallback', 'Pages', 'Live-Check'] },
]

// Inhalt von CLAUDE.md – die „genaueren Informationen" dazu.
const REGELWERK = [
  { label: 'Leitplanken', items: ['Inhalte nur aus src/data/*.json', 'Diagramme live als SVG', 'Einfach/Erweitert & Kino-Modus erhalten', 'UI durchgehend Deutsch', 'prototyp-app/ nicht anfassen'] },
  { label: 'Befehle & CI', items: ['npm install (nicht npm ci) + native Binaries', 'lint muss 0 Probleme melden'] },
  { label: 'Deploy & Verifikation', items: ['Push → Actions → Pages', 'Live-Gegenprüfung ist Pflicht'] },
]

const TOOLS = [
  { icon: GitBranch, n: 'Git & GitHub', d: 'Versionierung, Push auf main' },
  { icon: Package, n: 'npm · Vite · TypeScript', d: 'Build (tsc + vite), Lint' },
  { icon: ShieldCheck, n: 'Playwright + Chrome', d: 'E2E-Tests & Screenshots' },
  { icon: Braces, n: 'Node-Skripte', d: 'Daten-Konsistenzchecks' },
  { icon: Webhook, n: 'GitHub REST API', d: 'Actions-Status (kein gh-CLI)' },
  { icon: Sparkles, n: 'Claude Code', d: 'Read/Edit/Write + Bash' },
]

const WEITERE = [
  { name: 'docs/PROGRESS.md', zweck: 'Changelog – nach jeder Änderung ergänzt' },
  { name: 'docs/ARCHITECTURE.md', zweck: 'Farb-Token & Komponenten-Verträge' },
  { name: 'README.md', zweck: 'Einstieg, Live-Link, Schnellstart' },
]

const steps: PresentationStep[] = [
  {
    id: 'quelle', title: 'Eine Datenquelle, ein Design', visual: <JsonZuSvg />,
    body: 'Alle Inhalte liegen als JSON vor. Zahlen werden daraus berechnet, Diagramme live als SVG gerendert – Website und Daten können nicht auseinanderlaufen.',
  },
  {
    id: 'verify', title: 'Jede Änderung wird verifiziert',
    body: 'Vor jeder Veröffentlichung müssen Lint und Build grün sein, alle Touren werden headless mit Playwright durchgeklickt (0 Konsolenfehler) und die Daten per Node-Skript gegengeprüft.',
  },
  {
    id: 'deploy', title: 'Push → GitHub Actions → Live',
    body: 'Ein Push auf main baut und veröffentlicht die Seite automatisch auf GitHub Pages. Danach wird die Live-Seite gegengeprüft: gleicher Build-Hash, Inhalt im Bundle, HTTP 200.',
  },
  {
    id: 'ki', title: 'KI-gestützt, aber überprüft',
    body: 'Umgesetzt mit Claude Code entlang der Regeln in CLAUDE.md. Der Wert liegt im festen Ablauf – gezielt ändern, real testen, dokumentieren, gegenprüfen.',
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
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Diese Website wurde <strong style={{ color: 'var(--text-primary)' }}>KI-gestützt mit Claude Code</strong> umgesetzt –
          nach einem festen, überprüfbaren Ablauf: eine Datenquelle, automatisierte Verifikation, ein CI/CD-Deploy.
          Jeder Schritt ist nachvollziehbar.
        </p>
      }
    >
      {/* Zeile 1: links der Ablauf, rechts das Regelwerk (füllt die Breite) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
        {/* Ablauf */}
        <div className="lg:col-span-3">
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Der Ablauf einer Änderung</h3>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s.nr} className="relative pl-11 pb-6 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span aria-hidden className="absolute w-px" style={{ left: 15, top: 34, bottom: 0, background: 'var(--border-color)' }} />
                )}
                <span
                  className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold font-mono"
                  style={{ background: 'var(--card-bg)', border: `1px solid ${ACCENT}66`, color: ACCENT }}
                >
                  {s.nr}
                </span>
                <h4 className="font-semibold text-sm leading-8" style={{ color: 'var(--text-primary)' }}>{s.t}</h4>
                <p className="text-[13px] leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)', maxWidth: '54ch' }}>{s.d}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {s.tags.map((tag) => (
                    <span key={tag} className="text-[11px] font-mono px-2 py-0.5 rounded-md" style={{ background: 'var(--bg-whiteboard)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{tag}</span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Regelwerk CLAUDE.md */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden h-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div className="h-[3px]" style={{ background: ACCENT }} />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <BookOpenCheck size={16} style={{ color: ACCENT }} />
                <code className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>CLAUDE.md</code>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>— das Regelwerk</span>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                Wird zu Beginn jeder Sitzung gelesen und bindet alle Schritte. Legt fest, was gilt – nicht, was gefällt.
              </p>
              <div className="space-y-3.5">
                {REGELWERK.map((g) => (
                  <div key={g.label}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: ACCENT }}>{g.label}</div>
                    <ul className="space-y-1">
                      {g.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
                          <span className="mt-[0.5em] w-1 h-1 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zeile 2: Werkzeuge als Icon-Raster */}
      <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Werkzeuge</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <div key={tool.n} className="flex items-start gap-3 rounded-xl p-3.5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}18`, color: ACCENT }}>
                <Icon size={17} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{tool.n}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{tool.d}</div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs mb-8" style={{ color: 'var(--text-secondary)' }}>
        Ein Bild-Generierungs-MCP war verfügbar, blieb aber ungenutzt – alle Diagramme sind aus den Daten gerendert.
      </p>

      {/* Zeile 3: weitere Projekt-Dateien */}
      <h3 className="flex items-center gap-2 text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
        <FileText size={15} style={{ color: ACCENT }} /> Weitere Projekt-Dateien
      </h3>
      <div className="rounded-2xl grid grid-cols-1 md:grid-cols-3" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        {WEITERE.map((d, i) => (
          <div key={d.name} className={`p-4 ${i > 0 ? 'border-t md:border-t-0 md:border-l' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
            <code className="text-xs font-semibold" style={{ color: ACCENT }}>{d.name}</code>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.zweck}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
