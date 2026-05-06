export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
      >
        ← Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
            ${i === page
              ? 'bg-primary-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  )
}
