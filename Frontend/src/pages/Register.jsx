import { useState } from 'react'
import Card from '../components/common/UI/Card.jsx'
import Button from '../components/common/UI/Button.jsx'

export default function Register() {
  const [form] = useState({ name: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [info] = useState('Registration is disabled. Implement later.')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('Registration is disabled. Please add backend integration later.')
  }

  return (
    <div className="mt-12 flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {error && <div className="mb-4 p-3 bg-rose-900/30 text-rose-300 rounded-md text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              readOnly
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              readOnly
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              readOnly
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none transition"
            >
              <option value="student">Student</option>
            </select>
          </div>
          <Button className="w-full">Register</Button>
        </form>
        <p className="text-sm text-slate-400 mt-4">{info}</p>
      </Card>
    </div>
  )
}
