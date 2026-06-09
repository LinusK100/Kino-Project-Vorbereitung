import type { Priority } from '@/types'

interface BadgePriorityProps {
  priority: Priority;
}

const labels: Record<Priority, string> = {
  high: 'Hoch',
  medium: 'Mittel',
  low: 'Niedrig',
}

export function BadgePriority({ priority }: BadgePriorityProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium badge-${priority}`}
    >
      {labels[priority]}
    </span>
  )
}
