import { useEffect, useState, useCallback } from 'react'
import { facilityService, bookingService } from '../../services'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/LoadingSpinner'
import Badge from '../../components/Badge'
import Pagination from '../../components/Pagination'
import toast from 'react-hot-toast'
import { Search, X, MapPin, Users, CalendarDays } from 'lucide-react'

const EMPTY_BOOKING = { facilityId: '', startDate: '', endDate: '', startTime: '09:00', endTime: '17:00', purpose: '' }

export default function StaffFacilitiesPage() {
  const { user } = useAuth()
  const [data,    setData]    = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(0)
  const [search,  setSearch]  = useState('')
  const [viewFac, setViewFac] = useState(null)
  const [bookModal, setBookModal] = useState(false)
  const [form,    setForm]    = useState(EMPTY_BOOKING)
  const [saving,  setSaving]  = useState(false)
  const [errors,  setErrors]  = useState({})

  const load = useCallback(() => {
    setLoading(true)
    facilityService.getAll({ search: search || undefined, status: 'AVAILABLE', page, size: 9 })
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load facilities'))
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { load() }, [load])

  const openBook = (facility) => {
    setForm({ ...EMPTY_BOOKING, facilityId: facility.id })
    setErrors({})
    setBookModal(true)
  }

  const validate = () => {
    const e = {}
    if (!form.startDate) e.startDate = 'Start date required'
    if (!form.endDate)   e.endDate   = 'End date required'
    else if (form.endDate < form.startDate) e.endDate = 'End date cannot be before start date'
    if (!form.startTime) e.startTime = 'Start time required'
    if (!form.endTime)   e.endTime   = 'End time required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleBook = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await bookingService.create({
        facilityId: form.facilityId,
        startDate:  form.startDate,
        endDate:    form.endDate,
        startTime:  form.startTime,
        endTime:    form.endTime,
        purpose:    form.purpose,
      })
      toast.success('Booking request submitted!')
      setBookModal(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Available Facilities</h1>
        <p className="text-gray-400 text-sm mt-0.5">Browse and book available facilities</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input className="input pl-9 text-sm" placeholder="Search facilities…"
          value={search} onChange={e => { setSearch(e.target.value); setPage(0) }} />
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {data.content.length === 0
            ? <div className="text-center py-16 text-gray-500">No available facilities found.</div>
            : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {data.content.map(f => (
                  <div key={f.id}
                    className="card hover:border-gray-700 transition-all group flex flex-col">
                    {f.imageUrl && (
                      <div className="overflow-hidden rounded-xl mb-4 h-40 flex-shrink-0">
                        <img src={f.imageUrl} alt={f.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-white">{f.name}</h3>
                      <Badge value={f.status} />
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                      <MapPin size={12} />{f.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                      <Users size={12} />Capacity: {f.capacity}
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 flex-1">{f.description}</p>
                    <div className="mt-4 flex gap-2 pt-4 border-t border-gray-800">
                      <button onClick={() => setViewFac(f)}
                        className="btn-secondary flex-1 text-sm py-2">View Details</button>
                      <button onClick={() => openBook(f)}
                        className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-1.5">
                        <CalendarDays size={14} /> Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      {/* View modal */}
      {viewFac && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="font-bold text-white">{viewFac.name}</h2>
              <button onClick={() => setViewFac(null)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            {viewFac.imageUrl && (
              <img src={viewFac.imageUrl} alt={viewFac.name} className="w-full h-52 object-cover" />
            )}
            <div className="p-6 space-y-3 text-sm">
              <div className="flex items-center gap-2"><Badge value={viewFac.status} /></div>
              <p className="text-gray-400"><span className="text-gray-300 font-medium">Location: </span>{viewFac.location}</p>
              <p className="text-gray-400"><span className="text-gray-300 font-medium">Capacity: </span>{viewFac.capacity}</p>
              {viewFac.description && <p className="text-gray-400 leading-relaxed">{viewFac.description}</p>}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button onClick={() => setViewFac(null)} className="btn-secondary flex-1">Close</button>
              <button onClick={() => { setViewFac(null); openBook(viewFac) }}
                className="btn-primary flex-1 flex items-center justify-center gap-2">
                <CalendarDays size={14} /> Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking modal */}
      {bookModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="font-bold text-white">Book Facility</h2>
              <button onClick={() => setBookModal(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date *</label>
                  <input type="date" className={`input text-sm ${errors.startDate ? 'border-red-500' : ''}`}
                    value={form.startDate} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                  {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="label">End Date *</label>
                  <input type="date" className={`input text-sm ${errors.endDate ? 'border-red-500' : ''}`}
                    value={form.endDate} min={form.startDate || new Date().toISOString().split('T')[0]}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                  {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate}</p>}
                </div>
                <div>
                  <label className="label">Start Time *</label>
                  <input type="time" className={`input text-sm ${errors.startTime ? 'border-red-500' : ''}`}
                    value={form.startTime}
                    onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
                </div>
                <div>
                  <label className="label">End Time *</label>
                  <input type="time" className={`input text-sm ${errors.endTime ? 'border-red-500' : ''}`}
                    value={form.endTime}
                    onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Purpose</label>
                <textarea rows={3} className="input resize-none text-sm" placeholder="Meeting, training, etc."
                  value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button onClick={() => setBookModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleBook} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
