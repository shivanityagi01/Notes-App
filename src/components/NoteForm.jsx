import { useEffect, useState } from 'react'

const TITLE_WORD_LIMIT = 100
const CONTENT_WORD_LIMIT = 900
const TAG_WORD_LIMIT = 50

function normalizeTags(rawTags) {
  if (!Array.isArray(rawTags)) return []

  const unique = []
  rawTags.forEach((tag) => {
    const cleaned = typeof tag === 'string' ? tag.trim() : ''
    if (cleaned && !unique.some((item) => item.toLowerCase() === cleaned.toLowerCase())) {
      unique.push(cleaned)
    }
  })
  return unique
}

function countWords(text) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).filter(Boolean).length
}

function isWithinWordLimit(text, limit) {
  return countWords(text) <= limit
}

function WordCount({ count, limit }) {
  const remaining = limit - count
  const isOver = remaining < 0

  return (
    <p className={`mt-1 text-xs ${isOver ? 'text-red-600' : 'text-slate-400'}`}>
      {count}/{limit} words
    </p>
  )
}

function NoteForm({ isOpen, mode = 'create', initialNote = null, onSubmit, onCancel }) {
  const [title, setTitle] = useState(() =>
    mode === 'edit' && initialNote ? initialNote.title || '' : ''
  )
  const [content, setContent] = useState(() =>
    mode === 'edit' && initialNote ? initialNote.content || '' : ''
  )
  const [tags, setTags] = useState(() =>
    mode === 'edit' && initialNote ? normalizeTags(initialNote.tags) : []
  )
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const titleWordCount = countWords(title)
  const contentWordCount = countWords(content)
  const tagInputWordCount = countWords(tagInput)

  const handleTitleChange = (event) => {
    const nextValue = event.target.value
    if (!isWithinWordLimit(nextValue, TITLE_WORD_LIMIT)) return
    setTitle(nextValue)
    setErrors((current) => ({ ...current, title: undefined }))
  }

  const handleContentChange = (event) => {
    const nextValue = event.target.value
    if (!isWithinWordLimit(nextValue, CONTENT_WORD_LIMIT)) return
    setContent(nextValue)
    setErrors((current) => ({ ...current, content: undefined }))
  }

  const handleTagInputChange = (event) => {
    const nextValue = event.target.value
    if (!isWithinWordLimit(nextValue, TAG_WORD_LIMIT)) return
    setTagInput(nextValue)
    setErrors((current) => ({ ...current, tags: undefined }))
  }

  const addTag = () => {
    const nextTag = tagInput.trim()
    if (!nextTag) return

    if (!isWithinWordLimit(nextTag, TAG_WORD_LIMIT)) {
      setErrors((current) => ({
        ...current,
        tags: `Each tag can have at most ${TAG_WORD_LIMIT} words.`,
      }))
      return
    }

    setTags((current) => {
      if (current.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())) {
        return current
      }
      return [...current, nextTag]
    })
    setTagInput('')
    setErrors((current) => ({ ...current, tags: undefined }))
  }

  const removeTag = (tagToRemove) => {
    setTags((current) => current.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag()
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    const nextErrors = {}

    if (!trimmedTitle) {
      nextErrors.title = 'Title is required.'
    } else if (!isWithinWordLimit(trimmedTitle, TITLE_WORD_LIMIT)) {
      nextErrors.title = `Title cannot exceed ${TITLE_WORD_LIMIT} words.`
    }

    if (!trimmedContent) {
      nextErrors.content = 'Content is required.'
    } else if (!isWithinWordLimit(trimmedContent, CONTENT_WORD_LIMIT)) {
      nextErrors.content = `Description cannot exceed ${CONTENT_WORD_LIMIT} words.`
    }

    const invalidTag = tags.find((tag) => !isWithinWordLimit(tag, TAG_WORD_LIMIT))
    if (invalidTag) {
      nextErrors.tags = `Each tag can have at most ${TAG_WORD_LIMIT} words.`
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      title: trimmedTitle,
      content: trimmedContent,
      tags: normalizeTags(tags),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-form-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close note form"
        onClick={onCancel}
      />
      <div className="relative flex max-h-[92vh] w-full max-w-xl min-w-0 flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 id="note-form-title" className="min-w-0 truncate text-lg font-semibold text-slate-900">
            {mode === 'edit' ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-w-0 overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-6">
          <div className="min-w-0 space-y-4">
            <div className="min-w-0">
              <label htmlFor="note-title" className="mb-1.5 block text-sm font-medium text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter note title"
                className={`box-border w-full max-w-full min-w-0 overflow-x-auto rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition break-words focus:ring-2 ${
                  errors.title
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'
                }`}
              />
              <div className="mt-1 flex min-w-0 items-start justify-between gap-3">
                {errors.title ? (
                  <p className="min-w-0 flex-1 break-words text-xs text-red-600">{errors.title}</p>
                ) : (
                  <span />
                )}
                <WordCount count={titleWordCount} limit={TITLE_WORD_LIMIT} />
              </div>
            </div>

            <div className="min-w-0">
              <label htmlFor="note-content" className="mb-1.5 block text-sm font-medium text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="note-content"
                value={content}
                onChange={handleContentChange}
                placeholder="Write your note content"
                rows={6}
                className={`box-border w-full max-w-full min-w-0 resize-y overflow-x-hidden rounded-xl border bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 outline-none transition [overflow-wrap:anywhere] break-words whitespace-pre-wrap focus:ring-2 ${
                  errors.content
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'
                }`}
              />
              <div className="mt-1 flex min-w-0 items-start justify-between gap-3">
                {errors.content ? (
                  <p className="min-w-0 flex-1 break-words text-xs text-red-600">{errors.content}</p>
                ) : (
                  <span />
                )}
                <WordCount count={contentWordCount} limit={CONTENT_WORD_LIMIT} />
              </div>
            </div>

            <div className="min-w-0">
              <label htmlFor="note-tags" className="mb-1.5 block text-sm font-medium text-slate-700">
                Tags
              </label>
              <div className="flex min-w-0 gap-2">
                <input
                  id="note-tags"
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type a tag and press Enter"
                  className={`box-border w-full max-w-full min-w-0 overflow-x-auto rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition break-words focus:ring-2 ${
                    errors.tags
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Add
                </button>
              </div>
              <div className="mt-1 flex min-w-0 items-start justify-between gap-3">
                <p className="min-w-0 flex-1 break-words text-xs text-slate-400">
                  Optional. Max {TAG_WORD_LIMIT} words per tag. Press Enter or click Add.
                </p>
                <WordCount count={tagInputWordCount} limit={TAG_WORD_LIMIT} />
              </div>
              {errors.tags ? (
                <p className="mt-1 break-words text-xs text-red-600">{errors.tags}</p>
              ) : null}

              {tags.length > 0 ? (
                <div className="mt-3 flex min-w-0 flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex max-w-full min-w-0 items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 [overflow-wrap:anywhere] break-all"
                    >
                      <span className="min-w-0">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="shrink-0 rounded-full p-0.5 transition hover:bg-indigo-100"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              {mode === 'edit' ? 'Save Changes' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteForm
