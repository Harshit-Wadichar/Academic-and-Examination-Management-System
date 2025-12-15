import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { useContext } from 'react'
import { ThemeContext } from '../../../context/ThemeContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useContext(ThemeContext)

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-slate-900/60 border-b border-slate-800 fixed top-0 z-40">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-semibold tracking-tight">AEMS</Link>
        <nav className="hidden md:flex gap-3 text-sm text-slate-300">
          <Link to="/syllabus" className="hover:text-white transition">Syllabus</Link>
          <Link to="/events" className="hover:text-white transition">Events</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggle} className="px-3 py-1 rounded-md bg-slate-800/40">{dark ? 'Dark' : 'Light'}</button>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm">{user.name}</span>
            <button onClick={logout} className="text-sm px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-500">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="px-3 py-1 rounded-md bg-indigo-600">Login</Link>
        )}
      </div>
    </header>
  )
}
