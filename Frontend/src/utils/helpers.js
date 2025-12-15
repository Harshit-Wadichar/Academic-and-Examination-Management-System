export function classNames(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function formatDate(d) {
  try {
    const date = new Date(d)
    return date.toLocaleString()
  } catch { return d }
}
