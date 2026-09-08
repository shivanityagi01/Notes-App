import { useEffect } from 'react'
import { formatDate } from '../utils/noteHelpers'

function NoteModal({ note, isOpen, onClose, onEdit }) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !note) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close note details"
        onClick={onClose}
      />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl min-w-0 flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {note.pinned ? (
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  Pinned
                </span>
              ) : null}
              {note.archived ? (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  Archived
                </span>
              ) : null}
            </div>
            <h2
              id="note-modal-title"
              className="max-h-24 overflow-y-auto break-words [overflow-wrap:anywhere] text-xl font-semibold text-slate-900"
            >
              {note.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="min-w-0 overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-6">
          <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-relaxed text-slate-700">
            {note.content}
          </p>

          {Array.isArray(note.tags) && note.tags.length > 0 ? (
            <div className="mt-6 flex min-w-0 flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="max-w-full break-all rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 [overflow-wrap:anywhere]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6 space-y-1 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <p>Created: {formatDate(note.createdAt)}</p>
            <p>Updated: {formatDate(note.updatedAt)}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(note)}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Edit Note
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default NoteModal
