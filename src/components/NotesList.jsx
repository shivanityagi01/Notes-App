import EmptyState from './EmptyState'
import NoteCard from './NoteCard'
import TagFilter from './TagFilter'

function NotesList({
  title,
  description,
  notes,
  availableTags,
  selectedTag,
  onSelectTag,
  searchQuery,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  variant = 'notes',
  handlers,
}) {
  const hasFilters = Boolean(searchQuery.trim()) || (selectedTag && selectedTag !== 'All')

  let emptyStateTitle = emptyTitle
  let emptyStateDescription = emptyDescription
  let emptyStateIcon = emptyIcon

  if (notes.length === 0 && hasFilters) {
    emptyStateTitle = 'No matching notes'
    emptyStateDescription = 'Try adjusting your search or tag filter.'
    emptyStateIcon = 'search'
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>

      {availableTags.length > 0 || selectedTag !== 'All' ? (
        <TagFilter tags={availableTags} selectedTag={selectedTag} onSelect={onSelectTag} />
      ) : null}

      {notes.length === 0 ? (
        <EmptyState
          title={emptyStateTitle}
          description={emptyStateDescription}
          icon={emptyStateIcon}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {notes.map((note) => (
            <div key={note.id} className="min-w-0">
              <NoteCard note={note} variant={variant} {...handlers} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default NotesList
