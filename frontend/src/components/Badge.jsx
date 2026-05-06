const STATUS_STYLES = {
  // Facility
  AVAILABLE:    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  UNAVAILABLE:  'bg-gray-500/15  text-gray-400   border border-gray-500/30',
  MAINTENANCE:  'bg-amber-500/15  text-amber-400  border border-amber-500/30',
  // Bookings
  PENDING:      'bg-amber-500/15  text-amber-400  border border-amber-500/30',
  APPROVED:     'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  REJECTED:     'bg-red-500/15    text-red-400    border border-red-500/30',
  CANCELLED:    'bg-gray-500/15   text-gray-400   border border-gray-500/30',
  // Issues
  OPEN:         'bg-red-500/15    text-red-400    border border-red-500/30',
  IN_PROGRESS:  'bg-blue-500/15   text-blue-400   border border-blue-500/30',
  RESOLVED:     'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  CLOSED:       'bg-gray-500/15   text-gray-400   border border-gray-500/30',
  // Priorities
  LOW:          'bg-gray-500/15   text-gray-400   border border-gray-500/30',
  MEDIUM:       'bg-amber-500/15  text-amber-400  border border-amber-500/30',
  HIGH:         'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  CRITICAL:     'bg-red-500/15    text-red-400    border border-red-500/30',
}

export default function Badge({ value }) {
  const cls = STATUS_STYLES[value] ?? 'bg-gray-700 text-gray-300'
  const label = value?.replace('_', ' ')
  return <span className={`badge ${cls}`}>{label}</span>
}
