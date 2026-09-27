import {
  AlertCircle,
  CheckCheck,
  Clock3,
  ListTodo,
  RefreshCw,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import ProgressSummary from '../ProgressSummary/ProgressSummary.jsx'
import TaskFilters from '../TaskFilters/TaskFilters.jsx'
import TaskForm from '../TaskForm/TaskForm.jsx'
import TaskList from '../TaskList/TaskList.jsx'
import {
  createTask,
  getDailyProgress,
  getTasks,
  updateTask,
} from '../../services/taskApi.js'
import './Dashboard.css'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})

function formatPlannedTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  return `${minutes} min`
}

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [dailyProgress, setDailyProgress] = useState([])
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [updatingTaskIds, setUpdatingTaskIds] = useState(() => new Set())
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadDashboard() {
      setError('')

      try {
        const [taskData, progressData] = await Promise.all([
          getTasks('all'),
          getDailyProgress(),
        ])

        if (isCurrentRequest) {
          setTasks(taskData)
          setDailyProgress(progressData)
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setError(requestError.message)
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      }
    }

    void loadDashboard()

    return () => {
      isCurrentRequest = false
    }
  }, [reloadKey])

  async function handleCreateTask(taskDetails) {
    setIsCreating(true)
    setError('')

    try {
      await createTask(taskDetails)
      setFilter('all')
      setReloadKey((currentKey) => currentKey + 1)
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    } finally {
      setIsCreating(false)
    }
  }

  async function handleToggleTask(task) {
    setUpdatingTaskIds((currentIds) => new Set(currentIds).add(task._id))
    setError('')

    try {
      await updateTask(task._id, { completed: !task.completed })
      setReloadKey((currentKey) => currentKey + 1)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUpdatingTaskIds((currentIds) => {
        const nextIds = new Set(currentIds)
        nextIds.delete(task._id)
        return nextIds
      })
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const plannedMinutes = tasks.reduce((total, task) => total + task.duration, 0)
  const highPriorityCount = tasks.filter((task) => task.priority === 'high').length
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'pending') {
      return !task.completed
    }

    if (filter === 'completed') {
      return task.completed
    }

    return true
  })
  const emptyMessage = {
    all: 'Your task list is clear.',
    pending: 'No pending tasks.',
    completed: 'No completed tasks yet.',
  }[filter]

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Daymark home">
          <span className="brand-mark">
            <CheckCheck size={18} aria-hidden="true" />
          </span>
          <span>DAYMARK</span>
        </a>
        <div className="topbar-meta">
          <span className="workspace-label">
            <span className="workspace-dot" aria-hidden="true" />
            Personal workspace
          </span>
          <span className="topbar-date">{dateFormatter.format(new Date())}</span>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="page-intro">
          <div>
            <p className="eyebrow">{dateFormatter.format(new Date())}</p>
            <h1>
              Today, <span>in focus.</span>
            </h1>
          </div>
          <div className="intro-note" aria-label={`${completedCount} of ${tasks.length} tasks complete`}>
            <span className="intro-note-label">Your progress</span>
            <strong>{completedCount}/{tasks.length}</strong>
            <span>complete</span>
          </div>
        </section>

        <section className="metric-strip" aria-label="Task overview">
          <div className="metric">
            <span className="metric-icon green">
              <ListTodo size={17} aria-hidden="true" />
            </span>
            <div className="metric-copy">
              <span>Tasks in list</span>
              <strong>{tasks.length}</strong>
            </div>
          </div>
          <div className="metric">
            <span className="metric-icon coral">
              <CheckCheck size={17} aria-hidden="true" />
            </span>
            <div className="metric-copy">
              <span>High priority</span>
              <strong>{highPriorityCount}</strong>
            </div>
          </div>
          <div className="metric">
            <span className="metric-icon blue">
              <Clock3 size={17} aria-hidden="true" />
            </span>
            <div className="metric-copy">
              <span>Time planned</span>
              <strong>{formatPlannedTime(plannedMinutes)}</strong>
            </div>
          </div>
        </section>

        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={17} aria-hidden="true" />
            <span>{error}</span>
            <button
              className="retry-button"
              type="button"
              onClick={() => setReloadKey((currentKey) => currentKey + 1)}
            >
              <RefreshCw size={13} aria-hidden="true" />
              Retry
            </button>
          </div>
        )}

        <TaskForm isSubmitting={isCreating} onSubmit={handleCreateTask} />

        <div className="dashboard-grid">
          <section className="task-section" aria-labelledby="tasks-heading">
            <div className="section-heading">
              <div className="section-title-wrap">
                <h2 id="tasks-heading">Your tasks</h2>
                <span className="section-count">{visibleTasks.length} shown</span>
              </div>
            </div>

            <TaskFilters activeFilter={filter} tasks={tasks} onChange={setFilter} />
            <TaskList
              emptyMessage={emptyMessage}
              isLoading={isLoading}
              onToggle={handleToggleTask}
              tasks={visibleTasks}
              updatingTaskIds={updatingTaskIds}
            />
          </section>

          <ProgressSummary dailyProgress={dailyProgress} />
        </div>
      </main>
    </div>
  )
}

export default Dashboard