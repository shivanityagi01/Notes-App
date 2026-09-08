import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import NotesList from '../components/NotesList'
import {
  filterBySearch,
  filterByTag,
  getActiveNotes,
  getAllTags,
  sortNotes,
} from '../utils/noteHelpers'

function Notes() {
  const {
    notes,
    searchQuery,
    selectedTag,
    setSelectedTag,
    noteHandlers,
  } = useOutletContext()

  const activeNotes = useMemo(() => getActiveNotes(notes), [notes])

  const filteredNotes = useMemo(() => {
    const searched = filterBySearch(activeNotes, searchQuery)
    const tagged = filterByTag(searched, selectedTag)
    return sortNotes(tagged)
  }, [activeNotes, searchQuery, selectedTag])

  const availableTags = useMemo(() => getAllTags(activeNotes), [activeNotes])

  return (
    <NotesList
      title="Notes"
      description="All your active notes in one place."
      notes={filteredNotes}
      availableTags={availableTags}
      selectedTag={selectedTag}
      onSelectTag={setSelectedTag}
      searchQuery={searchQuery}
      emptyTitle="No notes yet"
      emptyDescription="Create your first note to get started."
      emptyIcon="notes"
      variant="notes"
      handlers={noteHandlers}
    />
  )
}

export default Notes
