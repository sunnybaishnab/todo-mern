import { Check, Clock3, RotateCcw } from 'lucide-react'
import './TaskItem.css'

function TaskItem({ isUpdating, onToggle, task }) {
  const actionLabel = task.completed ? 'Mark as pending' : 'Mark as complete'

  return (
    <article className={`task-row${task.completed ? ' is-complete' : ''}`}>
      <span className="task-check" aria-hidden="true">
        {task.completed && <Check size={16} strokeWidth={2.5} />}
      </span>

      <div className="task-copy">
        <h3 title={task.title}>{task.title}</h3>
        <div className="task-subline">
          <span className={`task-priority priority-${task.priority}`}>
            <span className="priority-dot" aria-hidden="true" />
            {task.priority}
          </span>
          <span className="task-duration">
            <Clock3 size={12} aria-hidden="true" />
            {task.duration} min
          </span>
        </div>
      </div>

      <span className="task-status">{task.completed ? 'Completed' : 'Pending'}</span>

      <button
        className="task-action"
        type="button"
        aria-label={actionLabel}
        title={actionLabel}
        disabled={isUpdating}
        onClick={() => onToggle(task)}
      >
        {task.completed ? (
          <RotateCcw size={14} aria-hidden="true" />
        ) : (
          <Check size={14} aria-hidden="true" />
        )}
        <span>{task.completed ? 'Undo' : 'Complete'}</span>
      </button>
    </article>
  )
}

export default TaskItem