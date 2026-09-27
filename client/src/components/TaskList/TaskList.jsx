import { ClipboardList, LoaderCircle } from 'lucide-react'
import TaskItem from '../TaskItem/TaskItem.jsx'
import './TaskList.css'

function TaskList({ emptyMessage, isLoading, onToggle, tasks, updatingTaskIds }) {
  if (isLoading) {
    return (
      <div className="empty-state" role="status">
        <LoaderCircle className="loading-icon" size={22} aria-hidden="true" />
        <strong>Loading tasks</strong>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={22} aria-hidden="true" />
        <strong>{emptyMessage}</strong>
      </div>
    )
  }

  return (
    <div className="task-list" aria-live="polite">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          isUpdating={updatingTaskIds.has(task._id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

export default TaskList