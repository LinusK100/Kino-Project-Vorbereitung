// Meta-Abschnitt „Arbeitsweise & Reproduzierbarkeit". Bewusst ruhig und
// editorial gehalten – durchgehend in den Theme-Farben der Website (hell auf
// hell, dunkel auf dunkel, kein aufgesetztes dunkles Panel), ein einziger
// neutraler Akzent. Der Ablauf als schlichte nummerierte Timeline zeigt den
// Zusammenhang; wenige, klare Bausteine statt vieler Kleinteile.
import { GitBranch, Wrench, FileText } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { JsonZuSvg } from '@/components/presentation/visuals/product'
import type { PresentationStep } from '@/types'

const ACCENT = '#64748b'   // neutrales Slate, in Hell und Dunkel gut lesbar

// Der Ablauf jeder Änderung – ein Schritt, ein Satz.
const STEPS = [
  { nr: '01', t: 'Regeln aus CLAUDE.md', d: 'Zuerst die verbindlichen Leitplanken lesen: Inhalte nur aus den JSON-Daten, durchgehend Deutsch, den gebauten Prototyp nicht anfassen.' },
  { nr: '02', t: 'Gezielt ändern', d: 'Die betroffene Datei erst lesen, dann präzise anpassen. Zahlen werden aus den Daten berechnet, nie hartkodiert.' },
  { nr: '03', t: 'Verifizieren', d: 'Lint und Build müssen grün sein; alle Präsentations-Touren werden headless mit Playwright durchgeklickt (0 Konsolenfehler), die Daten per Node-Skript gegengeprüft.' },
  { nr: '04', t: 'Dokumentieren & pushen', d: 'Ein Eintrag in docs/PROGRESS.md hält fest, was und warum – dann commit und push auf main.' },
  { nr: '05', t: 'Automatisch veröffentlichen', d: 'Der Push löst GitHub Actions aus (npm install → build → 404-Fallback → GitHub Pages); danach wird die Live-Seite gegengeprüft.' },
]

const DATEIEN = [
  { name: 'CLAUDE.md', zweck: 'Leitplanken, Befehle & Deploy' },
  { name: 'docs/PROGRESS.md', zweck: 'Changelog nach jeder Änderung' },
  { name: 'docs/ARCHITECTURE.md', zweck: 'Farb-Token & Komponenten-Verträge' },
  { name: 'README.md', zweck: 'Einstieg & Live-Link' },
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
      {/* Der Ablauf als nummerierte Timeline */}
      <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Der Ablauf einer Änderung</h3>
      <ol className="relative mb-2">
        {/* durchgehende Verbindungslinie hinter den Markern */}
        <span aria-hidden className="absolute w-px" style={{ left: 15, top: 16, bottom: 40, background: 'var(--border-color)' }} />
        {STEPS.map((s) => (
          <li key={s.nr} className="relative pl-11 pb-6 last:pb-0">
            <span
              className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold font-mono"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: ACCENT }}
            >
              {s.nr}
            </span>
            <h4 className="font-semibold text-sm leading-8" style={{ color: 'var(--text-primary)' }}>{s.t}</h4>
            <p className="text-[13px] leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)', maxWidth: '62ch' }}>{s.d}</p>
          </li>
        ))}
      </ol>
      <p className="text-xs pl-11 mb-8" style={{ color: 'var(--text-secondary)' }}>
        ↺ Nach dem Deploy beginnt der Kreislauf von vorn.
      </p>

      {/* Werkzeuge & angelegte Dateien – eine Karte, zwei Spalten */}
      <div className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <div className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold mb-2.5" style={{ color: 'var(--text-primary)' }}>
            <Wrench size={15} style={{ color: ACCENT }} /> Werkzeuge
          </h3>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Git &amp; GitHub · npm, Vite und TypeScript · Playwright mit System-Chrome ·
            Node-Skripte für Daten-Checks · GitHub REST API · Claude Code.
          </p>
          <p className="text-xs leading-relaxed mt-2.5" style={{ color: 'var(--text-secondary)', opacity: 0.85 }}>
            Ein Bild-Generierungs-MCP war verfügbar, blieb aber ungenutzt – alle Diagramme sind aus den Daten gerendert.
          </p>
        </div>
        <div className="p-5 border-t md:border-t-0 md:border-l" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="flex items-center gap-2 text-sm font-bold mb-2.5" style={{ color: 'var(--text-primary)' }}>
            <FileText size={15} style={{ color: ACCENT }} /> Angelegte Dateien
          </h3>
          <dl className="space-y-2">
            {DATEIEN.map((d) => (
              <div key={d.name} className="flex items-baseline justify-between gap-3">
                <dt><code className="text-xs font-semibold" style={{ color: ACCENT }}>{d.name}</code></dt>
                <dd className="text-[12px] text-right" style={{ color: 'var(--text-secondary)' }}>{d.zweck}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SectionShell>
  )
}
