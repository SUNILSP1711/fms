import { useEffect, useState, useCallback } from 'react'
import { issueService, facilityService } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import Badge from '../../components/Badge'
import Pagination from '../../components/Pagination'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Plus, Eye, X, Trash2 } from 'lucide-react'

const EMPTY = { facilityId: '', title: '', description: '', priority: 'MEDIUM' }

export default function StaffIssuesPage() {
  const [data,      setData]      = useState({ content: [], totalPages: 0 })
  const [facilities, setFacilities] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [page,      setPage]      = useState(0)
  const [modal,     setModal]     = useState(null)
  const [selected,  setSelected]  = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)
  const [errors,    setErrors]    = useState({})

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      issueService.getMy({ page, size: 10 }),
      facilityService.getAll({ page: 0, size: 100 }),
    ]).then(([i, f]) => {
      setData(i.data)
      setFacilities(f.data.content)
    }).catch(() => toast.error('Failed to load'))
     .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const e = {}
    if (!form.facilityId)       e.facilityId   = 'Select a facility'
    if (!form.title.trim())     e.title        = 'Title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await issueService.create({
        facilityId:  +form.facilityId,
        title:       form.title.trim(),
        description: form.description.trim(),
        priority:    form.priority,
      })
      toast.success('Issue reported!')
      setModal(null); setForm(EMPTY); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submit failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this issue?')) return
    try {
      await issueService.delete(id)
      toast.success('Issue deleted'); load()
    } catch { toast.error('Delete failed') }
  }

  const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'

  return (
    <div className="page-enter space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Issues</h1>
          <p className="text-gray-400 text-sm mt-0.5">Report and track facility issues</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setErrors({}); setModal('add') }}
          className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Report Issue
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {data.content.length === 0
            ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg mb-2">No issues reported</p>
                <p className="text-sm">Click "Report Issue" to raise a new one.</p>
              </div>
            )
            : (
              <div className="space-y-3">
                {data.content.map(i => (
                  <div key={i.id}
                    className="card hover:border-gray-700 transition-all flex flex-wrap
                               items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{i.title}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{i.facility?.name} · {fmt(i.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge value={i.priority} />
                      <Badge value={i.status} />
                      <button onClick={() => { setSelected(i); setModal('view') }}
                        className="text-gray-400 hover:text-white ml-1">
                        <Eye size={17} />
                      </button>
                      {(i.status === 'OPEN') && (
                        <button onClick={() => handleDelete(i.id)}
                          className="text-red-400 hover:text-red-300">
                          <Trash2 size={17} />
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

      {/* Report Issue Modal */}
      {modal === 'add' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md
                          max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="font-bold text-white">Report Issue</h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Facility *</label>
                <select className={`input text-sm ${errors.facilityId ? 'border-red-500' : ''}`}
                  value={form.facilityId}
                  onChange={e => setForm(f => ({ ...f, facilityId: e.target.value }))}>
                  <option value="">Select facility…</option>
                  {facilities.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                {errors.facilityId && <p className="text-red-400 text-xs mt-1">{errors.facilityId}</p>}
              </div>
              <div>
                <label className="label">Title *</label>
                <input type="text" className={`input text-sm ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Brief description of the issue"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="label">Priority</label>
                <select className="input text-sm" value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea rows={4} className={`input resize-none text-sm ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe the issue in detail…"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Submitting…' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
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
              <Row label="Reported"  value={fmt(selected.createdAt)} />
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-28">Priority</span><Badge value={selected.priority} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-28">Status</span><Badge value={selected.status} />
              </div>
              <div>
                <p className="text-gray-500 mb-1">Description</p>
                <p className="text-gray-300 leading-relaxed">{selected.description}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800">
              <button onClick={() => setModal(null)} className="btn-secondary w-full">Close</button>
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
