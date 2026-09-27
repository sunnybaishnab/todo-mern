import { Plus } from 'lucide-react'
import { useState } from 'react'
import './TaskForm.css'

function TaskForm({ isSubmitting, onSubmit }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [duration, setDuration] = useState('')
  const [validationMessage, setValidationMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const durationInMinutes = Number(duration)

    if (!trimmedTitle) {
      setValidationMessage('Enter a task title.')
      return
    }

    if (!duration || !Number.isFinite(durationInMinutes) || durationInMinutes <= 0) {
      setValidationMessage('Enter a duration greater than zero.')
      return
    }

    setValidationMessage('')
    const saved = await onSubmit({
      title: trimmedTitle,
      priority,
      duration: durationInMinutes,
    })

    if (saved) {
      setTitle('')
      setPriority('medium')
      setDuration('')
    }
  }

  return (
    <section className="task-form-panel" aria-labelledby="form-heading">
      <div className="form-heading">
        <h2 id="form-heading">Add a task</h2>
        <span className="form-kicker">NEW TASK</span>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="field title-field">
          <label htmlFor="task-title">Task</label>
          <input
            id="task-title"
            name="title"
            type="text"
            maxLength={120}
            placeholder="What needs your attention?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            name="priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="task-duration">Duration (min)</label>
          <input
            id="task-duration"
            name="duration"
            type="number"
            min="0.01"
            step="any"
            inputMode="decimal"
            placeholder="30"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            required
          />
        </div>

        <button className="add-task-button" type="submit" disabled={isSubmitting}>
          <Plus size={16} aria-hidden="true" />
          {isSubmitting ? 'Adding…' : 'Add task'}
        </button>

        {validationMessage && (
          <p className="form-error" role="alert">
            {validationMessage}
          </p>
        )}
      </form>
    </section>
  )
}

export default TaskForm