import { useEffect, useState, useCallback } from 'react'
import { bookingService } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import Badge from '../../components/Badge'
import Pagination from '../../components/Pagination'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Search, CheckCircle, XCircle, X, Eye } from 'lucide-react'

export default function BookingsPage() {
  const [data,    setData]    = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(0)
  const [status,  setStatus]  = useState('')
  const [modal,   setModal]   = useState(null)
  const [selected, setSelected] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    bookingService.getAll({ status: status || undefined, page, size: 10 })
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [status, page])

  useEffect(() => { load() }, [load])

  const handleStatus = async (id, newStatus) => {
    try {
      await bookingService.updateStatus(id, newStatus)
      toast.success(`Booking ${newStatus.toLowerCase()}`)
      load()
      setModal(null)
    } catch {
      toast.error('Action failed')
    }
  }

  const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Review and approve facility booking requests</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3">
        <select className="input w-auto text-sm"
          value={status} onChange={e => { setStatus(e.target.value); setPage(0) }}>
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {data.content.length === 0
            ? <div className="text-center py-16 text-gray-500">No bookings found.</div>
            : (
              <div className="card p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      {['Facility', 'Booked By', 'Dates', 'Purpose', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {data.content.map(b => (
                      <tr key={b.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-4 text-white font-medium">{b.facility?.name}</td>
                        <td className="px-5 py-4 text-gray-300">{b.user?.name}</td>
                        <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                          {fmt(b.startDate)} → {fmt(b.endDate)}
                        </td>
                        <td className="px-5 py-4 text-gray-400 max-w-[160px] truncate">{b.purpose || '—'}</td>
                        <td className="px-5 py-4"><Badge value={b.status} /></td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button title="View" onClick={() => { setSelected(b); setModal('view') }}
                              className="text-gray-400 hover:text-white transition-colors">
                              <Eye size={16} />
                            </button>
                            {b.status === 'PENDING' && (
                              <>
                                <button title="Approve" onClick={() => handleStatus(b.id, 'APPROVED')}
                                  className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                  <CheckCircle size={16} />
                                </button>
                                <button title="Reject" onClick={() => handleStatus(b.id, 'REJECTED')}
                                  className="text-red-400 hover:text-red-300 transition-colors">
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Detail Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="font-bold text-white">Booking Details</h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <Row label="Facility"   value={selected.facility?.name} />
              <Row label="Booked By"  value={`${selected.user?.name} (${selected.user?.email})`} />
              <Row label="Start Date" value={fmt(selected.startDate)} />
              <Row label="End Date"   value={fmt(selected.endDate)} />
              <Row label="Time"       value={`${selected.startTime} – ${selected.endTime}`} />
              <Row label="Purpose"    value={selected.purpose || '—'} />
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-28">Status</span>
                <Badge value={selected.status} />
              </div>
            </div>
            {selected.status === 'PENDING' && (
              <div className="flex gap-3 p-6 border-t border-gray-800">
                <button onClick={() => handleStatus(selected.id, 'REJECTED')}
                  className="btn-danger flex-1 flex items-center justify-center gap-2">
                  <XCircle size={15} /> Reject
                </button>
                <button onClick={() => handleStatus(selected.id, 'APPROVED')}
                  className="btn-success flex-1 flex items-center justify-center gap-2">
                  <CheckCircle size={15} /> Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 w-28 flex-shrink-0">{label}</span>
      <span className="text-gray-200">{value}</span>
    </div>
  )
}
