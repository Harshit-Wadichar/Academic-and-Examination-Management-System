import { setToken, setUser, clearAll } from './storage.service.js'

export async function login({ email, password }) {
  // placeholder simple mock: in real app call backend
  if (email === 'admin@aems.local' && password === 'admin') {
    const user = { id: '1', name: 'Admin', role: 'admin', email }
    setToken('demo-admin-token')
    setUser(user)
    return { user }
  }
  if (email && password) {
    const user = { id: '2', name: 'Student User', role: 'student', email }
    setToken('demo-student-token')
    setUser(user)
    return { user }
  }
  throw { message: 'Invalid credentials' }
}

export function logout() {
  clearAll()
}
