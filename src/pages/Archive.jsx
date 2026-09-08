import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import NotesList from '../components/NotesList'
import {
  filterBySearch,
  filterByTag,
  getAllTags,
  getArchivedNotes,
  sortNotes,
} from '../utils/noteHelpers'

function Archive() {
  const {
    notes,
    searchQuery,
    selectedTag,
    setSelectedTag,
    noteHandlers,
  } = useOutletContext()

  const archivedNotes = useMemo(() => getArchivedNotes(notes), [notes])

  const filteredNotes = useMemo(() => {
    const searched = filterBySearch(archivedNotes, searchQuery)
    const tagged = filterByTag(searched, selectedTag)
    return sortNotes(tagged)
  }, [archivedNotes, searchQuery, selectedTag])

  const availableTags = useMemo(() => getAllTags(archivedNotes), [archivedNotes])

  return (
    <NotesList
      title="Archive"
      description="Notes you have archived for later."
      notes={filteredNotes}
      availableTags={availableTags}
      selectedTag={selectedTag}
      onSelectTag={setSelectedTag}
      searchQuery={searchQuery}
      emptyTitle="No archived notes"
      emptyDescription="Archive a note to store it here without deleting it."
      emptyIcon="archive"
      variant="archive"
      handlers={noteHandlers}
    />
  )
}

export default Archive
