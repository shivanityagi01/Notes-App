import { formatDate, previewContent } from '../utils/noteHelpers'

function ActionButton({ label, onClick, children, danger = false }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

function NoteCard({
  note,
  onView,
  onEdit,
  onTogglePin,
  onArchive,
  onUnarchive,
  onMoveToTrash,
  onRestore,
  onDeleteForever,
  variant = 'notes',
}) {
  return (
    <article
      className="group flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
      onClick={() => onView(note)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onView(note)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View note ${note.title}`}
    >
      <div className="mb-3 flex min-w-0 shrink-0 items-start justify-between gap-3">
        <h3
          className="min-w-0 flex-1 overflow-hidden text-base font-semibold text-slate-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [overflow-wrap:anywhere] break-all"
          title={note.title}
        >
          {note.title}
        </h3>
        {note.pinned && variant !== 'trash' ? (
          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
            Pinned
          </span>
        ) : null}
      </div>

      <p
        className="mb-4 min-h-[3.75rem] min-w-0 shrink-0 overflow-hidden text-sm leading-relaxed text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [overflow-wrap:anywhere] break-words"
        title={note.content}
      >
        {previewContent(note.content, 160)}
      </p>

      {Array.isArray(note.tags) && note.tags.length > 0 ? (
        <div className="mb-4 flex max-h-14 min-w-0 shrink-0 flex-wrap gap-1.5 overflow-hidden">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="max-w-full truncate rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700"
              title={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto shrink-0 border-t border-slate-100 pt-3">
        <p className="mb-3 text-[11px] text-slate-400">Updated {formatDate(note.updatedAt)}</p>

        <div className="flex flex-wrap items-center gap-1">
          {variant === 'trash' ? (
            <>
              <ActionButton label="Restore note" onClick={() => onRestore(note.id)}>
                Restore
              </ActionButton>
              <ActionButton
                label="Delete note forever"
                onClick={() => onDeleteForever(note)}
                danger
              >
                Delete Forever
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton label="View note" onClick={() => onView(note)}>
                View
              </ActionButton>
              <ActionButton label="Edit note" onClick={() => onEdit(note)}>
                Edit
              </ActionButton>
              {variant !== 'archive' ? (
                <ActionButton
                  label={note.pinned ? 'Unpin note' : 'Pin note'}
                  onClick={() => onTogglePin(note.id)}
                >
                  {note.pinned ? 'Unpin' : 'Pin'}
                </ActionButton>
              ) : null}
              {variant === 'archive' ? (
                <ActionButton label="Unarchive note" onClick={() => onUnarchive(note.id)}>
                  Unarchive
                </ActionButton>
              ) : (
                <ActionButton label="Archive note" onClick={() => onArchive(note.id)}>
                  Archive
                </ActionButton>
              )}
              <ActionButton label="Move to trash" onClick={() => onMoveToTrash(note.id)} danger>
                Delete
              </ActionButton>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default NoteCard
