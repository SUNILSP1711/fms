import { useEffect, useState, useCallback } from 'react'
import { facilityService } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import Badge from '../../components/Badge'
import Pagination from '../../components/Pagination'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Search, X, MapPin, Users } from 'lucide-react'

const EMPTY = { name: '', description: '', location: '', capacity: 1, status: 'AVAILABLE', imageUrl: '' }

export default function FacilitiesPage() {
  const [data,    setData]    = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(0)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('')
  const [modal,   setModal]   = useState(null)   // null | 'add' | 'edit' | 'view'
  const [selected, setSelected] = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [saving,  setSaving]  = useState(false)
  const [errors,  setErrors]  = useState({})

  const load = useCallback(() => {
    setLoading(true)
    facilityService.getAll({ search: search || undefined, status: status || undefined, page, size: 9 })
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load facilities'))
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { load() }, [load])

  const openAdd  = ()       => { setForm(EMPTY); setErrors({}); setModal('add') }
  const openEdit = (f)      => { setForm({ ...f, imageUrl: f.imageUrl || '' }); setSelected(f); setErrors({}); setModal('edit') }
  const openView = (f)      => { setSelected(f); setModal('view') }
  const closeModal = ()     => { setModal(null); setSelected(null) }

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Name is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.capacity || form.capacity < 1) e.capacity = 'Capacity must be ≥ 1'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (modal === 'add') {
        await facilityService.create(form)
        toast.success('Facility created!')
      } else {
        await facilityService.update(selected.id, form)
        toast.success('Facility updated!')
      }
      closeModal(); load()
    } catch (err) {
      const msg = err.response?.data?.message || 'Save failed'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this facility?')) return
    try {
      await facilityService.delete(id)
      toast.success('Facility deleted')
      load()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Facilities</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage all facility listings</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Facility
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input className="input pl-9 text-sm" placeholder="Search name or location…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(0) }} />
        </div>
        <select className="input w-auto text-sm"
          value={status} onChange={e => { setStatus(e.target.value); setPage(0) }}>
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="UNAVAILABLE">Unavailable</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? <LoadingSpinner /> : (
        <>
          {data.content.length === 0
            ? <div className="text-center py-16 text-gray-500">No facilities found.</div>
            : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {data.content.map(f => (
                  <div key={f.id} className="card hover:border-gray-700 transition-all group">
                    <div className="cursor-pointer" onClick={() => openView(f)}>
                      {f.imageUrl && (
                        <img src={f.imageUrl} alt={f.name}
                          className="w-full h-40 object-cover rounded-xl mb-4 group-hover:opacity-90 transition-opacity" />
                      )}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-white leading-tight">{f.name}</h3>
                        <Badge value={f.status} />
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                        <MapPin size={12} /> {f.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                        <Users size={12} /> Capacity: {f.capacity}
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-2">{f.description}</p>
                    </div>

                    {/* Actions row */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(f); }}
                        className="flex items-center gap-1.5 text-xs btn-secondary px-3 py-1.5 flex-1 justify-center">
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }}
                        className="flex items-center gap-1.5 text-xs btn-danger px-3 py-1.5 flex-1 justify-center">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg
                          max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="font-bold text-white text-lg">
                {modal === 'add' ? 'Add Facility' : 'Edit Facility'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { id: 'name', label: 'Name *', type: 'text', placeholder: 'Conference Room A' },
                { id: 'location', label: 'Location *', type: 'text', placeholder: 'Building A, Floor 2' },
                { id: 'imageUrl', label: 'Image URL', type: 'text', placeholder: 'https://…' },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label className="label">{label}</label>
                  <input id={id} type={type} placeholder={placeholder} className={`input ${errors[id] ? 'border-red-500' : ''}`}
                    value={form[id]} onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))} />
                  {errors[id] && <p className="text-red-400 text-xs mt-1">{errors[id]}</p>}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Capacity *</label>
                  <input type="number" min={1} className={`input ${errors.capacity ? 'border-red-500' : ''}`}
                    value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} />
                  {errors.capacity && <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>}
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="AVAILABLE">Available</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea rows={3} className="input resize-none" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg
                          max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="font-bold text-white text-lg">{selected.name}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            {selected.imageUrl && (
              <img src={selected.imageUrl} alt={selected.name} className="w-full h-52 object-cover" />
            )}
            <div className="p-6 space-y-3 text-sm">
              <div className="flex items-center gap-2"><Badge value={selected.status} /></div>
              <p className="text-gray-400"><span className="text-gray-300 font-medium">Location:</span> {selected.location}</p>
              <p className="text-gray-400"><span className="text-gray-300 font-medium">Capacity:</span> {selected.capacity}</p>
              {selected.description && <p className="text-gray-400">{selected.description}</p>}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button onClick={closeModal} className="btn-secondary flex-1">Close</button>
              <button onClick={() => openEdit(selected)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Pencil size={14} /> Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
