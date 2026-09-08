const STORAGE_KEY = 'notes-app-data'

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (note) =>
        note &&
        typeof note === 'object' &&
        typeof note.id === 'string' &&
        typeof note.title === 'string'
    )
  } catch {
    return []
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error('Failed to save notes to localStorage:', error)
  }
}

export { STORAGE_KEY }
