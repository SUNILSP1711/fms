import { useEffect, useState, useCallback } from 'react'
import { bookingService } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import Badge from '../../components/Badge'
import Pagination from '../../components/Pagination'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Eye, X, XCircle } from 'lucide-react'

export default function StaffBookingsPage() {
  const [data,    setData]    = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(0)
  const [modal,   setModal]   = useState(null)
  const [selected, setSelected] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    bookingService.getMy({ page, size: 10 })
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await bookingService.updateStatus(id, 'CANCELLED')
      toast.success('Booking cancelled')
      load(); setModal(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed')
    }
  }

  const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="text-gray-400 text-sm mt-0.5">View and manage your facility booking requests</p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {data.content.length === 0
            ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg mb-2">No bookings yet</p>
                <p className="text-sm">Go to Facilities to book a room.</p>
              </div>
            )
            : (
              <div className="space-y-3">
                {data.content.map(b => (
                  <div key={b.id}
                    className="card hover:border-gray-700 transition-all flex flex-wrap
                               items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{b.facility?.name}</p>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {fmt(b.startDate)} → {fmt(b.endDate)}
                        &nbsp;·&nbsp;{b.startTime} – {b.endTime}
                      </p>
                      {b.purpose && <p className="text-gray-500 text-xs mt-1 truncate">{b.purpose}</p>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge value={b.status} />
                      <button onClick={() => { setSelected(b); setModal('view') }}
                        className="text-gray-400 hover:text-white transition-colors">
                        <Eye size={17} />
                      </button>
                      {b.status === 'PENDING' && (
                        <button onClick={() => handleCancel(b.id)}
                          className="text-red-400 hover:text-red-300 transition-colors" title="Cancel">
                          <XCircle size={17} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Detail modal */}
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
              <Row label="Location"   value={selected.facility?.location} />
              <Row label="Start Date" value={fmt(selected.startDate)} />
              <Row label="End Date"   value={fmt(selected.endDate)} />
              <Row label="Time"       value={`${selected.startTime} – ${selected.endTime}`} />
              <Row label="Purpose"    value={selected.purpose || '—'} />
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-28">Status</span>
                <Badge value={selected.status} />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button onClick={() => setModal(null)} className="btn-secondary flex-1">Close</button>
              {selected.status === 'PENDING' && (
                <button onClick={() => handleCancel(selected.id)}
                  className="btn-danger flex-1 flex items-center justify-center gap-2">
                  <XCircle size={15} /> Cancel Booking
                </button>
              )}
            </div>
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
