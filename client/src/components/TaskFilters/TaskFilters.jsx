import './TaskFilters.css'

function TaskFilters({ activeFilter, tasks, onChange }) {
  const completedCount = tasks.filter((task) => task.completed).length
  const filters = [
    { id: 'all', label: 'All', count: tasks.length },
    { id: 'pending', label: 'Pending', count: tasks.length - completedCount },
    { id: 'completed', label: 'Completed', count: completedCount },
  ]

  return (
    <div className="task-filters" role="group" aria-label="Filter tasks">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className="filter-button"
          type="button"
          aria-pressed={activeFilter === filter.id}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
          <span className="filter-count">{filter.count}</span>
        </button>
      ))}
    </div>
  )
}

export default TaskFilters