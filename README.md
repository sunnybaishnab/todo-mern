# MERN To-Do List

A beginner-friendly task tracker built with MongoDB, Express, React, and Node.js. The frontend and backend live in separate directories and communicate through a JSON REST API.

## Requirements

- Node.js LTS and npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## Project layout

Each React component has its own folder with its JSX and stylesheet:

```text
client/src/
├── components/
│   ├── Dashboard/Dashboard.jsx + Dashboard.css
│   ├── ProgressSummary/ProgressSummary.jsx + ProgressSummary.css
│   ├── TaskFilters/TaskFilters.jsx + TaskFilters.css
│   ├── TaskForm/TaskForm.jsx + TaskForm.css
│   ├── TaskItem/TaskItem.jsx + TaskItem.css
│   └── TaskList/TaskList.jsx + TaskList.css
├── services/taskApi.js
├── App.jsx
└── main.jsx
```

The server follows MVC responsibilities: `models/Task.js` is the Mongoose Model, `controllers/taskController.js` handles and validates requests, and `routes/taskRoutes.js` maps HTTP paths to controllers. Since this is a JSON API, controllers return JSON instead of rendering Express templates; React components provide the View. The small `services/taskService.js` module keeps database operations separate from HTTP handling. `config/db.js` connects Mongoose, `middleware/errorHandler.js` formats API errors, `app.js` configures Express, and `server.js` starts the server.

## Configure and run

From this directory, install each app's dependencies:

```sh
cd server
npm install
cp .env.example .env
npm run dev
```

Keep the backend running. In a second terminal, from this directory:

```sh
cd client
npm install
cp .env.example .env
npm run dev
```

Vite prints the client URL, normally `http://localhost:5173`. The API listens on `http://localhost:5000`. The `.env` files are local configuration and must not be committed. If MongoDB is hosted remotely, set `MONGODB_URI` in `server/.env` to that connection string.

## API

Create a task:

```sh
curl -i -X POST http://localhost:5000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Learn React","priority":"high","duration":60}'
```

List all tasks:

```sh
curl http://localhost:5000/api/tasks
```

The task API provides:

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks?status=all\|pending\|completed` | List or filter tasks |
| `PATCH` | `/api/tasks/:id` | Complete or reopen a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/tasks/progress/daily` | Get daily completion totals |

For example, complete a task with `curl -X PATCH http://localhost:5000/api/tasks/TASK_ID -H 'Content-Type: application/json' -d '{"completed":true}'`. The API rejects invalid input and returns errors as `{ "success": false, "message": "..." }`.

The dashboard loads saved tasks, supports all/pending/completed views, and updates completion through the API. Refreshing the page reloads task data from MongoDB.

## Date assumption for daily progress

Daily progress uses UTC calendar days. A day's total counts tasks created on that UTC date, and completed counts currently completed tasks from that same group. Historical completion share therefore reflects current task status, not completion events on that date.