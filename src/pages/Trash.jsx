import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import NotesList from '../components/NotesList'
import {
  filterBySearch,
  filterByTag,
  getAllTags,
  getTrashedNotes,
  sortNotes,
} from '../utils/noteHelpers'

function Trash() {
  const {
    notes,
    searchQuery,
    selectedTag,
    setSelectedTag,
    noteHandlers,
  } = useOutletContext()

  const trashedNotes = useMemo(() => getTrashedNotes(notes), [notes])

  const filteredNotes = useMemo(() => {
    const searched = filterBySearch(trashedNotes, searchQuery)
    const tagged = filterByTag(searched, selectedTag)
    return sortNotes(tagged)
  }, [trashedNotes, searchQuery, selectedTag])

  const availableTags = useMemo(() => getAllTags(trashedNotes), [trashedNotes])

  return (
    <NotesList
      title="Trash"
      description="Deleted notes stay here until you restore or permanently remove them."
      notes={filteredNotes}
      availableTags={availableTags}
      selectedTag={selectedTag}
      onSelectTag={setSelectedTag}
      searchQuery={searchQuery}
      emptyTitle="Trash is empty"
      emptyDescription="Deleted notes will appear here."
      emptyIcon="trash"
      variant="trash"
      handlers={noteHandlers}
    />
  )
}

export default Trash
