import { useEffect } from 'react'

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 max-w-2xl w-full p-6">
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">{children}</div>
      </div>
    </div>
  )
}
