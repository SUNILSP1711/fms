export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner" />
          <p className="text-gray-400 text-sm">Loading…</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center items-center py-12">
      <div className="spinner" />
    </div>
  )
}
