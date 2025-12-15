import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/common/UI/Card.jsx'
import Button from '../components/common/UI/Button.jsx'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const nav = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, call backend to register
    console.log('Register:', form)
    nav('/login')
  }

  return (
    <div className="mt-12 flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none transition"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="seating_manager">Seating Manager</option>
              <option value="club_coordinator">Club Coordinator</option>
            </select>
          </div>
          <Button className="w-full">Register</Button>
        </form>
      </Card>
    </div>
  )
}
