interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2
          className="text-2xl md:text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
