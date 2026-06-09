interface WhiteboardCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function WhiteboardCard({ children, className = '', style }: WhiteboardCardProps) {
  return (
    <div
      className={`rounded-xl p-4 card-shadow ${className}`}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', ...style }}
    >
      {children}
    </div>
  )
}
