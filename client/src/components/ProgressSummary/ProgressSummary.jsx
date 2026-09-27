import { CalendarDays } from 'lucide-react'
import './ProgressSummary.css'

function ProgressSummary({ dailyProgress }) {
  const today = new Date().toISOString().slice(0, 10)
  const progressByDate = new Map(dailyProgress.map((day) => [day.date, day]))
  const todayProgress = progressByDate.get(today) ?? {
    total: 0,
    completed: 0,
    percentage: 0,
  }

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${today}T00:00:00.000Z`)
    date.setUTCDate(date.getUTCDate() - (6 - index))
    const dateKey = date.toISOString().slice(0, 10)

    return {
      date: dateKey,
      percentage: progressByDate.get(dateKey)?.percentage ?? 0,
      weekday: new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        timeZone: 'UTC',
      }).format(date),
    }
  })

  return (
    <section className="progress-panel" aria-labelledby="progress-title">
      <div className="progress-heading">
        <div>
          <p className="progress-kicker">DAILY RHYTHM</p>
          <h2 id="progress-title">Progress</h2>
        </div>
        <span className="progress-date-icon">
          <CalendarDays size={17} aria-hidden="true" />
        </span>
      </div>

      <div className="today-progress">
        <div
          className="progress-ring"
          style={{ '--progress': `${todayProgress.percentage}%` }}
          role="img"
          aria-label={`${todayProgress.percentage}% of today's tasks completed`}
        >
          <span>{todayProgress.percentage}%</span>
        </div>
        <div className="today-copy">
          <span>Today</span>
          <strong>
            {todayProgress.completed} of {todayProgress.total} complete
          </strong>
        </div>
      </div>

      <div className="history-heading">
        <strong>Last seven days</strong>
        <span>UTC</span>
      </div>

      <div
        className="progress-chart"
        role="img"
        aria-label="Task completion percentage for the last seven UTC days"
      >
        {lastSevenDays.map((day) => (
          <div
            className={`chart-day${day.date === today ? ' today' : ''}`}
            key={day.date}
            title={`${day.date}: ${day.percentage}% complete`}
          >
            <div className="chart-track">
              <span
                className="chart-fill"
                style={{ height: `${Math.max(day.percentage, 3)}%` }}
              />
            </div>
            <span>{day.weekday}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProgressSummary