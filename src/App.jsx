import { useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import ConfirmModal from './components/ConfirmModal'
import Navbar from './components/Navbar'
import NoteForm from './components/NoteForm'
import NoteModal from './components/NoteModal'
import Sidebar from './components/Sidebar'
import Archive from './pages/Archive'
import Notes from './pages/Notes'
import Pinned from './pages/Pinned'
import Trash from './pages/Trash'
import { createId } from './utils/noteHelpers'
import { loadNotes, saveNotes } from './utils/storage'

function AppLayout() {
  const [notes, setNotes] = useState(() => loadNotes())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('All')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [editingNote, setEditingNote] = useState(null)

  const [viewingNoteId, setViewingNoteId] = useState(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [notePendingDelete, setNotePendingDelete] = useState(null)

  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  const viewingNote = useMemo(
    () => (viewingNoteId ? notes.find((note) => note.id === viewingNoteId) || null : null),
    [notes, viewingNoteId]
  )

  const updateNotes = useCallback((updater) => {
    setNotes((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      return next
    })
  }, [])

  const handleNavigate = useCallback(() => {
    setSidebarOpen(false)
    setSelectedTag('All')
  }, [])

  const handleCreateNote = useCallback((payload) => {
    const now = new Date().toISOString()
    const newNote = {
      id: createId(),
      title: payload.title,
      content: payload.content,
      tags: payload.tags,
      pinned: false,
      archived: false,
      trashed: false,
      createdAt: now,
      updatedAt: now,
    }

    updateNotes((current) => [newNote, ...current])
    setIsFormOpen(false)
    setEditingNote(null)
    setFormMode('create')
  }, [updateNotes])

  const handleUpdateNote = useCallback((payload) => {
    if (!editingNote) return

    updateNotes((current) =>
      current.map((note) =>
        note.id === editingNote.id
          ? {
              ...note,
              title: payload.title,
              content: payload.content,
              tags: payload.tags,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    )

    setIsFormOpen(false)
    setEditingNote(null)
    setFormMode('create')
    setViewingNoteId(null)
  }, [editingNote, updateNotes])

  const openCreateForm = useCallback(() => {
    setFormMode('create')
    setEditingNote(null)
    setIsFormOpen(true)
  }, [])

  const openEditForm = useCallback((note) => {
    setFormMode('edit')
    setEditingNote(note)
    setIsFormOpen(true)
    setViewingNoteId(null)
  }, [])

  const handleView = useCallback((note) => {
    setViewingNoteId(note.id)
  }, [])

  const handleTogglePin = useCallback((id) => {
    updateNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              pinned: !note.pinned,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    )
  }, [updateNotes])

  const handleArchive = useCallback((id) => {
    updateNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              archived: true,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    )
  }, [updateNotes])

  const handleUnarchive = useCallback((id) => {
    updateNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              archived: false,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    )
  }, [updateNotes])

  const handleMoveToTrash = useCallback((id) => {
    updateNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              trashed: true,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    )
  }, [updateNotes])

  const handleRestore = useCallback((id) => {
    updateNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              trashed: false,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    )
  }, [updateNotes])

  const requestDeleteForever = useCallback((note) => {
    setNotePendingDelete(note)
    setConfirmOpen(true)
  }, [])

  const confirmDeleteForever = useCallback(() => {
    if (!notePendingDelete) return

    updateNotes((current) => current.filter((note) => note.id !== notePendingDelete.id))
    setConfirmOpen(false)
    setNotePendingDelete(null)

    if (viewingNoteId === notePendingDelete.id) {
      setViewingNoteId(null)
    }
  }, [notePendingDelete, updateNotes, viewingNoteId])

  const noteHandlers = useMemo(
    () => ({
      onView: handleView,
      onEdit: openEditForm,
      onTogglePin: handleTogglePin,
      onArchive: handleArchive,
      onUnarchive: handleUnarchive,
      onMoveToTrash: handleMoveToTrash,
      onRestore: handleRestore,
      onDeleteForever: requestDeleteForever,
    }),
    [
      handleView,
      openEditForm,
      handleTogglePin,
      handleArchive,
      handleUnarchive,
      handleMoveToTrash,
      handleRestore,
      requestDeleteForever,
    ]
  )

  const outletContext = useMemo(
    () => ({
      notes,
      searchQuery,
      selectedTag,
      setSelectedTag,
      noteHandlers,
    }),
    [notes, searchQuery, selectedTag, noteHandlers]
  )

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewNote={openCreateForm}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet context={outletContext} />
          </div>
        </main>
      </div>

      <NoteForm
        key={isFormOpen ? (formMode === 'edit' ? editingNote?.id || 'edit' : 'create') : 'closed'}
        isOpen={isFormOpen}
        mode={formMode}
        initialNote={editingNote}
        onCancel={() => {
          setIsFormOpen(false)
          setEditingNote(null)
          setFormMode('create')
        }}
        onSubmit={formMode === 'edit' ? handleUpdateNote : handleCreateNote}
      />

      <NoteModal
        note={viewingNote}
        isOpen={Boolean(viewingNote)}
        onClose={() => setViewingNoteId(null)}
        onEdit={openEditForm}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete permanently?"
        message="This action cannot be undone. The note will be permanently removed."
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel"
        danger
        onCancel={() => {
          setConfirmOpen(false)
          setNotePendingDelete(null)
        }}
        onConfirm={confirmDeleteForever}
      />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Notes />} />
          <Route path="/pinned" element={<Pinned />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
