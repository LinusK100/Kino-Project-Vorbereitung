import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidUpdate(prev: Props) {
    if (prev.children !== this.props.children && this.state.error) {
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-2xl p-6 max-w-xl" style={{ background: 'var(--card-bg)', border: '1px solid #a1354455' }}>
          <div className="flex items-center gap-2 mb-2" style={{ color: '#a13544' }}>
            <AlertTriangle size={20} />
            <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>Abschnitt konnte nicht geladen werden</h2>
          </div>
          <pre className="text-xs whitespace-pre-wrap mt-2 p-3 rounded-lg overflow-auto" style={{ background: 'var(--bg-whiteboard)', color: 'var(--text-secondary)' }}>
            {this.state.error.message}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
