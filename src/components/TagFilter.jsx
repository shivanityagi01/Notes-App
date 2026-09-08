function TagFilter({ tags, selectedTag, onSelect }) {
  const options = ['All', ...tags]

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter notes by tag">
      {options.map((tag) => {
        const isActive = selectedTag === tag || (!selectedTag && tag === 'All')

        return (
          <button
            key={tag}
            type="button"
            onClick={() => onSelect(tag === 'All' ? 'All' : tag)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              isActive
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
            aria-pressed={isActive}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}

export default TagFilter
