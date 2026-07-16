// Meta-Abschnitt „Arbeitsweise & Reproduzierbarkeit": macht transparent, wie
// diese Website entsteht, geprüft und veröffentlicht wird – KI-gestützt mit
// Claude Code, nach einem festen, überprüfbaren Ablauf. Inhalte statisch
// (beschreibt den Prozess selbst), daher keine Daten-Selektoren.
import {
  GitBranch, Database, ShieldCheck, FileText, Wrench, Rocket,
  BookOpenCheck, PencilRuler, TerminalSquare, ListChecks, UploadCloud, Globe,
} from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { JsonZuSvg } from '@/components/presentation/visuals/product'
import type { PresentationStep } from '@/types'

const ACCENT = '#475569'
const REPO = 'github.com/LinusK100/Kino-Project-Vorbereitung'
const LIVE = 'linusk100.github.io/Kino-Project-Vorbereitung'

// Der Ablauf jeder Änderung – vom Regelwerk bis zur Live-Kontrolle.
const PIPELINE = [
  { icon: BookOpenCheck, title: 'Regeln lesen', text: 'Zu Beginn jeder Sitzung wird CLAUDE.md gelesen – die verbindlichen Leitplanken: Inhalte nur aus den JSON-Daten, Diagramme als SVG, Deutsch, kein Anfassen des gebauten Prototyps.' },
  { icon: PencilRuler, title: 'Gezielt ändern', text: 'Die betroffene Datei wird erst gelesen, dann präzise angepasst. Zahlen werden aus den Daten berechnet (Helfer zahlwort()), nie hartkodiert – so laufen Website und Daten nicht auseinander.' },
  { icon: TerminalSquare, title: 'Statisch prüfen', text: 'npm run lint muss 0 Probleme melden, npm run build (TypeScript + Vite) muss durchlaufen.' },
  { icon: ShieldCheck, title: 'Real testen', text: 'Die echte App wird headless mit Playwright (System-Chrome) gefahren: alle Präsentations-Touren durchklicken, jede Folie als Screenshot sichern, auf 0 Konsolen-/Seitenfehler prüfen – die Screenshots werden gesichtet.' },
  { icon: ListChecks, title: 'Daten prüfen', text: 'Node-Skripte laufen gegen die JSON und prüfen die Konsistenz (z. B. Buchungs-Klassen, Story-Zuordnung, berechnete Zahlen).' },
  { icon: FileText, title: 'Dokumentieren', text: 'Jede Änderung bekommt einen Eintrag in docs/PROGRESS.md: was, warum, wie verifiziert. Das ist das lebende Projektgedächtnis.' },
  { icon: Rocket, title: 'Veröffentlichen', text: 'Commit + Push auf main lösen den automatischen Deploy aus; danach wird die Live-Seite gegengeprüft (siehe unten).' },
]

const MD_DATEIEN = [
  { name: 'CLAUDE.md', zweck: 'Verbindliche Leitplanken, Befehle und der Deploy-Ablauf. Wird zuerst gelesen und schlägt ältere Planungsnotizen.' },
  { name: 'docs/PROGRESS.md', zweck: 'Lebendes Changelog – nach jeder Änderung ergänzt (was, warum, Verifikation).' },
  { name: 'docs/ARCHITECTURE.md', zweck: 'Farb-Token, Komponenten-Verträge und der Datenlayer.' },
  { name: 'docs/DASHBOARD_VARIANTEN.md', zweck: 'Archiv der verworfenen Dashboard-Entwürfe (Graph, Aurora) mit vollem Quellcode.' },
  { name: 'docs/REVIEW_REPORT.md', zweck: 'Momentaufnahme des Review-Stands.' },
  { name: 'README.md', zweck: 'Einstieg: Live-Link, Schnellstart, Architektur, Screenshots.' },
]

const WERKZEUGE = [
  { n: 'Git & GitHub', d: 'Versionierung, Push auf main' },
  { n: 'npm · Vite · TypeScript', d: 'Build (tsc + vite), Lint (ESLint)' },
  { n: 'Playwright + System-Chrome', d: 'headless E2E-Durchläufe & Screenshots' },
  { n: 'Node-Skripte', d: 'Daten-Konsistenzchecks gegen die JSON' },
  { n: 'GitHub REST API (curl)', d: 'Actions-Status abfragen (kein gh-CLI)' },
  { n: 'Claude Code', d: 'Read/Edit/Write + Bash, folgt CLAUDE.md' },
]

const DEPLOY = [
  'npm install (nicht npm ci – das macOS-Lockfile lässt Linux-only-Abhängigkeiten aus)',
  'scripts/ensure-native-binaries.mjs (native Binaries von rolldown/lightningcss/oxide absichern)',
  'npm run build (TypeScript-Check + Vite-Build → dist/)',
  'cp dist/index.html dist/404.html (SPA-Fallback für Deep-Links auf GitHub Pages)',
  'Artefakt hochladen und auf GitHub Pages veröffentlichen',
]

const steps: PresentationStep[] = [
  {
    id: 'quelle', title: 'Eine Datenquelle, ein Design', visual: <JsonZuSvg />,
    body: 'Alle Inhalte liegen als JSON vor. Zahlen werden daraus berechnet, Diagramme live als SVG gerendert – Website und Daten können nicht auseinanderlaufen.',
  },
  {
    id: 'verify', title: 'Jede Änderung wird verifiziert',
    body: 'Vor jeder Veröffentlichung: Lint (0 Probleme) und Build müssen grün sein, alle Präsentations-Touren werden headless mit Playwright durchgeklickt (0 Konsolenfehler, Screenshots gesichtet), Daten per Node-Skript gegengeprüft.',
  },
  {
    id: 'deploy', title: 'Push → GitHub Actions → Live',
    body: 'Ein Push auf main baut und veröffentlicht die Seite automatisch über GitHub Actions auf GitHub Pages. Danach wird die Live-Seite gegengeprüft: gleicher Build-Hash, charakteristischer Inhalt im Live-Bundle, HTTP 200.',
  },
  {
    id: 'ki', title: 'KI-gestützt, aber überprüft',
    body: 'Die Umsetzung erfolgte mit Claude Code entlang der Regeln in CLAUDE.md. Der Wert liegt nicht im Generieren, sondern im festen Ablauf: gezielt ändern, real testen, dokumentieren, gegenprüfen – jeder Schritt nachvollziehbar.',
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
        <Callout kind="info" title="Transparenz">
          Diese Website wurde <strong>KI-gestützt mit Claude Code</strong> umgesetzt – nach einem
          festen, überprüfbaren Ablauf. Dieser Abschnitt macht ihn sichtbar: eine Datenquelle,
          automatisierte Verifikation und ein CI/CD-Deploy.
        </Callout>
      }
    >
      {/* Eine Datenquelle */}
      <Block icon={Database} title="Eine Datenquelle als Grundlage">
        <p>
          Alle Inhalte – Personas, User Stories, UML, Zustände, Prototyp-Daten – liegen als
          strukturierte <code>src/data/*.json</code> vor (Ground Truth der Projektdokumentation).
          Kennzahlen werden daraus <strong>berechnet</strong>, nicht abgeschrieben; die Diagramme
          werden zur Laufzeit als SVG daraus gerendert. So ist jede Zahl auf der Seite
          nachvollziehbar und bleibt mit den Daten konsistent.
        </p>
      </Block>

      {/* Ablauf einer Änderung */}
      <Block icon={ShieldCheck} title="Der Ablauf einer Änderung">
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          {PIPELINE.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.title} className="flex items-start gap-3.5 px-4 py-3.5"
                style={{ borderBottom: i < PIPELINE.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${ACCENT}18`, color: ACCENT }}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold" style={{ color: ACCENT }}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{s.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Block>

      {/* MD-Dateien */}
      <Block icon={FileText} title="Projekt-Dokumentation (Markdown)">
        <p className="mb-3">
          Der Prozess stützt sich auf feste Markdown-Dateien – teils eigens für die Zusammenarbeit
          angelegt:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {MD_DATEIEN.map((d) => (
            <div key={d.name} className="rounded-xl p-3" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <code className="text-xs font-semibold" style={{ color: ACCENT }}>{d.name}</code>
              <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>{d.zweck}</p>
            </div>
          ))}
        </div>
      </Block>

      {/* Werkzeuge */}
      <Block icon={Wrench} title="Werkzeuge & Tools">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {WERKZEUGE.map((w) => (
            <div key={w.n} className="flex items-baseline gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <span className="text-sm font-medium flex-shrink-0" style={{ color: 'var(--text-primary)' }}>{w.n}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>— {w.d}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2.5" style={{ color: 'var(--text-secondary)' }}>
          Ein Bild-Generierungs-Dienst (MCP-Server) war verfügbar, wurde im Projekt aber
          bewusst nicht genutzt – es gibt keine KI-generierten Bilder, alle Diagramme sind
          aus den Daten gerendert.
        </p>
      </Block>

      {/* Veröffentlichung */}
      <Block icon={Rocket} title="Veröffentlichung: Push → GitHub Actions → Pages">
        <p className="mb-3">
          Ein <strong>Push auf <code>main</code></strong> löst den GitHub-Actions-Workflow
          (<code>.github/workflows/deploy.yml</code>) aus, der die Seite baut und auf GitHub
          Pages veröffentlicht:
        </p>
        <div className="rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            <UploadCloud size={15} style={{ color: ACCENT }} /> Push auf <code>main</code>
          </div>
          <ol className="space-y-2">
            {DEPLOY.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-mono font-bold flex-shrink-0" style={{ color: ACCENT }}>{i + 1}.</span>
                <span>{d}</span>
              </li>
            ))}
          </ol>
          <div className="flex items-center gap-2 mt-3 pt-3 text-xs font-semibold" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <Globe size={15} style={{ color: ACCENT }} /> Live &amp; gegengeprüft (Build-Hash, Inhalt im Bundle, HTTP 200)
          </div>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
          Nach jedem Deploy wird der Actions-Status über die GitHub-REST-API abgefragt
          (kein <code>gh</code>-CLI auf dem Rechner) und die Live-Seite gegen den lokalen Build
          verglichen. Repo: <code>{REPO}</code> · Live: <code>{LIVE}</code>
        </p>
      </Block>
    </SectionShell>
  )
}

function Block({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h3 className="flex items-center gap-2 text-sm font-bold mb-2.5" style={{ color: 'var(--text-primary)' }}>
        <Icon size={16} style={{ color: ACCENT }} /> {title}
      </h3>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</div>
    </section>
  )
}
