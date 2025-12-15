import { useCallback } from 'react'
import { getToken } from '../services/storage.service.js'

export default function useApi() {
  const base = import.meta.env.VITE_API_URL || '/api'

  const request = useCallback(async (path, opts = {}) => {
    const token = getToken()
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(base + path, { ...opts, headers })
    const contentType = res.headers.get('content-type') || ''
    let data = null
    if (contentType.includes('application/json')) data = await res.json()
    else data = await res.text()
    if (!res.ok) throw data
    return data
  }, [base])

  return { request }
}
