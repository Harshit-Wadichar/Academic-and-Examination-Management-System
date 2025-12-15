import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="w-64 hidden lg:block pt-20 h-screen sticky top-16 px-4">
      <div className="space-y-4">
        <div className="text-xs text-slate-400 uppercase">Main</div>
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard" className="px-3 py-2 rounded-md hover:bg-slate-800/40">Dashboard</Link>
          <Link to="/syllabus" className="px-3 py-2 rounded-md hover:bg-slate-800/40">Syllabus</Link>
          <Link to="/hallticket" className="px-3 py-2 rounded-md hover:bg-slate-800/40">Hall Ticket</Link>
          <Link to="/seating" className="px-3 py-2 rounded-md hover:bg-slate-800/40">Seating</Link>
          <Link to="/events" className="px-3 py-2 rounded-md hover:bg-slate-800/40">Events</Link>
        </nav>

        {user?.role === 'admin' && (
          <>
            <div className="text-xs text-slate-400 uppercase mt-4">Admin</div>
            <nav className="flex flex-col gap-2">
              <Link to="/dashboard" className="px-3 py-2 rounded-md hover:bg-slate-800/40">User Management</Link>
              <Link to="/dashboard" className="px-3 py-2 rounded-md hover:bg-slate-800/40">Exam Control</Link>
            </nav>
          </>
        )}
      </div>
    </aside>
  )
}
