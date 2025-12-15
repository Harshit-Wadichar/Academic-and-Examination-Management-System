export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-slate-700 animate-spin" />
    </div>
  )
}
