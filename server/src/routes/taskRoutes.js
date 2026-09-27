import { Router } from 'express'
import {
	createTask,
	deleteTask,
	getDailyProgress,
	getTasks,
	updateTask,
} from '../controllers/taskController.js'

const router = Router()

router.get('/', getTasks)
router.get('/progress/daily', getDailyProgress)
router.post('/', createTask)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router