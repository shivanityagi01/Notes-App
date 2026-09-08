export function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

export function filterBySearch(notes, searchQuery) {
  const query = searchQuery.trim().toLowerCase()
  if (!query) return notes

  return notes.filter((note) => {
    const title = note.title?.toLowerCase() || ''
    const content = note.content?.toLowerCase() || ''
    return title.includes(query) || content.includes(query)
  })
}

export function filterByTag(notes, selectedTag) {
  if (!selectedTag || selectedTag === 'All') return notes
  return notes.filter((note) => Array.isArray(note.tags) && note.tags.includes(selectedTag))
}

export function getActiveNotes(notes) {
  return notes.filter((note) => !note.trashed && !note.archived)
}

export function getPinnedNotes(notes) {
  return notes.filter((note) => note.pinned && !note.trashed && !note.archived)
}

export function getArchivedNotes(notes) {
  return notes.filter((note) => note.archived && !note.trashed)
}

export function getTrashedNotes(notes) {
  return notes.filter((note) => note.trashed)
}

export function getAllTags(notes) {
  const tagSet = new Set()

  notes.forEach((note) => {
    if (Array.isArray(note.tags)) {
      note.tags.forEach((tag) => {
        if (typeof tag === 'string' && tag.trim()) {
          tagSet.add(tag.trim())
        }
      })
    }
  })

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
}

export function formatDate(dateString) {
  if (!dateString) return ''

  try {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export function previewContent(content, maxLength = 120) {
  if (!content) return ''
  const normalized = content.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength).trim()}…`
}
