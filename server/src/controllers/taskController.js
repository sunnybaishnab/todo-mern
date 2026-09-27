import * as taskService from '../services/taskService.js'

const allowedPriorities = ['low', 'medium', 'high']
const allowedStatuses = ['all', 'pending', 'completed']

export async function createTask(req, res, next) {
  try {
    const { title, priority, duration } = req.body ?? {}

    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Task title is required' })
    }

    if (title.trim().length > 120) {
      return res.status(400).json({
        success: false,
        message: 'Task title must be 120 characters or fewer',
      })
    }

    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be low, medium, or high',
      })
    }

    if (duration === undefined || duration === null || duration === '') {
      return res.status(400).json({ success: false, message: 'Task duration is required' })
    }

    if (typeof duration !== 'number' || !Number.isFinite(duration) || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be a positive number',
      })
    }

    const task = await taskService.createTask({
      title: title.trim(),
      priority,
      duration,
    })

    return res.status(201).json(task)
  } catch (error) {
    return next(error)
  }
}

export async function getTasks(req, res, next) {
  try {
    const status = req.query.status ?? 'all'

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be all, pending, or completed',
      })
    }

    const tasks = await taskService.getTasks(status)
    return res.json(tasks)
  } catch (error) {
    return next(error)
  }
}

export async function updateTask(req, res, next) {
  try {
    const { completed } = req.body ?? {}

    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Completed must be true or false',
      })
    }

    const task = await taskService.updateTaskCompletion(req.params.id, completed)

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' })
    }

    return res.json(task)
  } catch (error) {
    return next(error)
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await taskService.deleteTask(req.params.id)

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' })
    }

    return res.status(204).end()
  } catch (error) {
    return next(error)
  }
}

export async function getDailyProgress(req, res, next) {
  try {
    const dailyTotals = await taskService.getDailyProgress()
    const progress = dailyTotals.map(({ _id, total, completed }) => ({
      date: _id,
      total,
      completed,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    }))

    return res.json(progress)
  } catch (error) {
    return next(error)
  }
}