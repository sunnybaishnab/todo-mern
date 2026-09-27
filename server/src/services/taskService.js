import Task from '../models/Task.js'

export function createTask(taskDetails) {
  return Task.create(taskDetails)
}

export function getTasks(status = 'all') {
  const filter = {}

  if (status === 'pending') {
    filter.completed = false
  } else if (status === 'completed') {
    filter.completed = true
  }

  return Task.find(filter).sort({ createdAt: -1 })
}

export async function updateTaskCompletion(id, completed) {
  const task = await Task.findById(id)

  if (!task) {
    return null
  }

  if (task.completed !== completed) {
    task.completed = completed
    task.completedAt = completed ? new Date() : null
    await task.save()
  }

  return task
}

export function deleteTask(id) {
  return Task.findByIdAndDelete(id)
}

export function getDailyProgress() {
  return Task.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
            timezone: 'UTC',
          },
        },
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: ['$completed', 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ])
}