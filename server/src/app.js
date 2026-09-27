import cors from 'cors'
import express from 'express'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import taskRoutes from './routes/taskRoutes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use('/api/tasks', taskRoutes)
app.use(notFound)
app.use(errorHandler)

export default app