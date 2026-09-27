import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'

const port = process.env.PORT || 5000

try {
  await connectDB()
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
} catch (error) {
  console.error(`Could not start the server: ${error.message}`)
  process.exit(1)
}