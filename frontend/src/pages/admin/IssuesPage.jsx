import { useEffect, useState, useCallback } from 'react'
import { issueService } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import Badge from '../../components/Badge'
import Pagination from '../../components/Pagination'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Eye, X } from 'lucide-react'

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

export default function IssuesPage() {
  const [data,    setData]    = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(0)
  const [status,  setStatus]  = useState('')
  const [modal,   setModal]   = useState(null)
  const [selected, setSelected] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    issueService.getAll({ status: status || undefined, page, size: 10 })
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load issues'))
      .finally(() => setLoading(false))
  }, [status, page])

  useEffect(() => { load() }, [load])

  const handleStatus = async (id, newStatus) => {
    try {
      await issueService.updateStatus(id, newStatus)
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`)
      load(); setModal(null)
    } catch { toast.error('Update failed') }
  }

  const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy, HH:mm') : '—'

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Issues</h1>
        <p className="text-gray-400 text-sm mt-0.5">Track and resolve reported facility issues</p>
      </div>

      <div className="flex gap-3">
        <select className="input w-auto text-sm"
          value={status} onChange={e => { setStatus(e.target.value); setPage(0) }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {data.content.length === 0
            ? <div className="text-center py-16 text-gray-500">No issues found.</div>
            : (
              <div className="card p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      {['Title', 'Facility', 'Reporter', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {data.content.map(i => (
                      <tr key={i.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-4 text-white font-medium max-w-[180px] truncate">{i.title}</td>
                        <td className="px-5 py-4 text-gray-300">{i.facility?.name}</td>
                        <td className="px-5 py-4 text-gray-400">{i.reporter?.name}</td>
                        <td className="px-5 py-4"><Badge value={i.priority} /></td>
                        <td className="px-5 py-4"><Badge value={i.status} /></td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                          {i.createdAt ? format(new Date(i.createdAt), 'dd MMM') : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => { setSelected(i); setModal('view') }}
                            className="text-gray-400 hover:text-white transition-colors">
                            <Eye size={16} />
                          </button>
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
              <h2 className="font-bold text-white truncate">{selected.title}</h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white ml-4">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <Row label="Facility"  value={selected.facility?.name} />
              <Row label="Reporter"  value={`${selected.reporter?.name} (${selected.reporter?.email})`} />
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-28">Priority</span><Badge value={selected.priority} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-28">Status</span><Badge value={selected.status} />
              </div>
              <Row label="Reported"  value={fmt(selected.createdAt)} />
              <div>
                <p className="text-gray-500 mb-1">Description</p>
                <p className="text-gray-300 leading-relaxed">{selected.description}</p>
              </div>
            </div>
            {/* Status update */}
            <div className="p-6 border-t border-gray-800">
              <p className="text-xs text-gray-500 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.filter(s => s !== selected.status).map(s => (
                  <button key={s} onClick={() => handleStatus(selected.id, s)}
                    className="btn-secondary text-xs px-3 py-1.5">
                    → {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
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
