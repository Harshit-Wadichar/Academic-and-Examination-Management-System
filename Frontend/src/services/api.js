const base = import.meta.env.VITE_API_URL || '/api'

export async function apiFetch(path, opts = {}) {
  const res = await fetch(base + path, opts)
  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json() : await res.text()
  if (!res.ok) throw data
  return data
}

export default { apiFetch }
