import { useState } from 'react'
import Card from '../components/common/UI/Card.jsx'
import Button from '../components/common/UI/Button.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('Authentication is currently disabled. Implement later.')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('Login is disabled. Please implement auth later.')
  }

  return (
    <div className="mt-12 flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <div className="mb-4 p-3 bg-rose-900/30 text-rose-300 rounded-md text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          <Button className="w-full">Login</Button>
        </form>
        <p className="text-sm text-slate-400 mt-4">{info}</p>
      </Card>
    </div>
  )
}
