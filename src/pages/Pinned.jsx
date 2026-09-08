import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import NotesList from '../components/NotesList'
import {
  filterBySearch,
  filterByTag,
  getAllTags,
  getPinnedNotes,
  sortNotes,
} from '../utils/noteHelpers'

function Pinned() {
  const {
    notes,
    searchQuery,
    selectedTag,
    setSelectedTag,
    noteHandlers,
  } = useOutletContext()

  const pinnedNotes = useMemo(() => getPinnedNotes(notes), [notes])

  const filteredNotes = useMemo(() => {
    const searched = filterBySearch(pinnedNotes, searchQuery)
    const tagged = filterByTag(searched, selectedTag)
    return sortNotes(tagged)
  }, [pinnedNotes, searchQuery, selectedTag])

  const availableTags = useMemo(() => getAllTags(pinnedNotes), [pinnedNotes])

  return (
    <NotesList
      title="Pinned"
      description="Your most important notes, pinned for quick access."
      notes={filteredNotes}
      availableTags={availableTags}
      selectedTag={selectedTag}
      onSelectTag={setSelectedTag}
      searchQuery={searchQuery}
      emptyTitle="No pinned notes"
      emptyDescription="Pin a note from the Notes page to see it here."
      emptyIcon="pin"
      variant="notes"
      handlers={noteHandlers}
    />
  )
}

export default Pinned
