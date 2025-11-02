import { useEffect, useMemo, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [workouts, setWorkouts] = useState([])
  const [diets, setDiets] = useState([])
  const [progress, setProgress] = useState([])
  const [weekly, setWeekly] = useState({ goal: user?.weeklyGoal ?? 3, days: user?.weeklyDays ?? [] })

  useEffect(() => {
    const load = async () => {
      try {
        const [w, d, p] = await Promise.all([
          api.get('/workouts'),
          api.get('/diets'),
          api.get('/progress'),
        ])
        setWorkouts(w.data.data.slice(0, 3))
        setDiets(d.data.data.slice(0, 3))
        setProgress(p.data.data.slice(0, 3))
      } catch {
        // ignore errors here, ProtectedRoute ensures auth
      }
    }
    load()
  }, [])

  // Build last 7 days data for simple charts
  const last7 = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0,10);
      return { key, label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
    });
    const workoutByDay = Object.fromEntries(days.map(d => [d.key, 0]));
    const caloriesByDay = Object.fromEntries(days.map(d => [d.key, 0]));
    const weightByDay = Object.fromEntries(days.map(d => [d.key, null]));
    workouts.forEach(w => { const k = (w.date||'').slice(0,10); if (k in workoutByDay) workoutByDay[k] += w.duration || 0; });
    diets.forEach(di => { const k = (di.date||'').slice(0,10); if (k in caloriesByDay) caloriesByDay[k] += di.totalCalories || 0; });
    progress.forEach(p => { const k = (p.date||'').slice(0,10); if (k in weightByDay) weightByDay[k] = p.weight ?? weightByDay[k]; });
    return { days, workoutByDay, caloriesByDay, weightByDay };
  }, [workouts, diets, progress])

  // Weekly completion: count unique weekdays with workouts in current week
  const weeklyCompletion = useMemo(() => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay()) // Sunday
    const end = new Date(start)
    end.setDate(start.getDate() + 7)
    const set = new Set()
    workouts.forEach(w => {
      const d = new Date(w.date || w.createdAt)
      if (d >= start && d < end) set.add(d.getDay())
    })
    return set.size
  }, [workouts])

  function BarChart({ values, max, labels, unit }) {
    const safeMax = Math.max(max, 1)
    return (
      <div className="flex items-end gap-2 h-32">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="bg-blue-600 w-6 rounded" style={{ height: `${(v / safeMax) * 100}%` }} />
            <div className="text-[10px] text-gray-600">{labels[i]}</div>
          </div>
        ))}
      </div>
    )
  }

  function LineSpark({ values }) {
    const w = 160, h = 64
    const pts = values.map((v, i) => [ (i/(values.length-1||1)) * w, v ])
    const valid = values.filter(v => v !== null)
    const min = valid.length ? Math.min(...valid) : 0
    const max = valid.length ? Math.max(...valid) : 1
    const norm = (v) => max === min ? h/2 : h - ((v - min)/(max - min)) * h
    const d = pts.map((p, i) => `${i?'L':'M'} ${p[0].toFixed(2)} ${norm(values[i] ?? min).toFixed(2)}`).join(' ')
    return (
      <svg width={w} height={h} className="bg-gray-50 rounded">
        <path d={d} stroke="#16a34a" fill="none" strokeWidth="2" />
      </svg>
    )
  }

  const avatar = user?.profilePic

  return (
    <div>
      <header className="relative overflow-hidden rounded-xl mb-6">
        <img src="https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=2000&auto=format&fit=crop" alt="Dashboard banner" className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-end">
          <div className="p-4">
            <div className="flex items-center gap-3">
              {avatar && <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full border border-white/50" />}
              <h1 className="text-white text-2xl font-semibold">Welcome, {user?.username || user?.email}</h1>
            </div>
            <p className="text-white/90">Track your workouts, diet, and progress.</p>
          </div>
        </div>
      </header>

      {/* Weekly Goal Section
      <section className="bg-white p-4 rounded shadow mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Week Goal</h2>
          <Link to="/profile" className="text-blue-600 text-sm">Edit</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {['S','M','T','W','T','F','S'].map((lbl, i) => (
              <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-full text-sm border ${weekly.days?.includes(i) ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700'}`}>{lbl}</div>
            ))}
          </div>
          <div className="text-sm text-gray-700">{weeklyCompletion}/{weekly.goal} this week</div>
        </div>
      </section> */}

      {/* Weekly Goal Section */}
      <section className="bg-white p-4 rounded shadow mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Week Goal</h2>
          <Link to="/profile" className="text-blue-600 text-sm">Edit</Link>
        </div>

        {(() => {
          // Get all days with workouts this week
          const now = new Date();
          const start = new Date(now);
          start.setDate(now.getDate() - now.getDay()); // Sunday
          const end = new Date(start);
          end.setDate(start.getDate() + 7);
          const completedDays = new Set();

          workouts.forEach(w => {
            const d = new Date(w.date || w.createdAt);
            if (d >= start && d < end) completedDays.add(d.getDay());
          });

          return (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((lbl, i) => {
                  const isGoal = weekly.days?.includes(i);
                  const isDone = completedDays.has(i);

            // Choose color: green if done, pink if goal but not done, gray otherwise
            const baseClass = isDone
              ? 'bg-green-500 text-white border-green-500'
              : isGoal
              ? 'bg-pink-500 text-white border-pink-500'
              : 'bg-white text-gray-700';

            return (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm border ${baseClass}`}
              >
                {lbl}
                </div>
              );
            })}
          </div>
          <div className="text-sm text-gray-700">
            {Array.from(completedDays).length}/{weekly.goal} this week
          </div>
        </div>
      );
    })()}
  </section>


      <div className="grid md:grid-cols-3 gap-4">
        <section className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Recent Workouts</h2>
            <Link to="/workouts" className="text-blue-600 text-sm">View all</Link>
          </div>
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-1">Minutes (last 7 days)</div>
            <BarChart
              values={last7.days.map(d => last7.workoutByDay[d.key])}
              labels={last7.days.map(d => d.label)}
              max={Math.max(...last7.days.map(d => last7.workoutByDay[d.key]))}
              unit="min"
            />
          </div>
          <ul className="space-y-2">
            {workouts.map(w => (
              <li key={w._id} className="text-sm">{w.type} — {w.duration} min <span className="text-gray-500">({w.date ? new Date(w.date).toLocaleDateString() : ''})</span></li>
            ))}
            {!workouts.length && <li className="text-sm text-gray-500">No workouts yet</li>}
          </ul>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Recent Diets</h2>
            <Link to="/diet" className="text-blue-600 text-sm">View all</Link>
          </div>
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-1">Calories (last 7 days)</div>
            <BarChart
              values={last7.days.map(d => last7.caloriesByDay[d.key])}
              labels={last7.days.map(d => d.label)}
              max={Math.max(...last7.days.map(d => last7.caloriesByDay[d.key]))}
              unit="kcal"
            />
          </div>
          <ul className="space-y-2">
            {diets.map(d => (
              <li key={d._id} className="text-sm">{d.totalCalories} kcal <span className="text-gray-500">({d.date ? new Date(d.date).toLocaleDateString() : ''})</span></li>
            ))}
            {!diets.length && <li className="text-sm text-gray-500">No diet logs yet</li>}
          </ul>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Recent Progress</h2>
            <Link to="/progress" className="text-blue-600 text-sm">View all</Link>
          </div>
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-1">Weight trend</div>
            <LineSpark values={last7.days.map(d => last7.weightByDay[d.key])} />
          </div>
          <ul className="space-y-2">
            {progress.map(p => (
              <li key={p._id} className="text-sm">{p.weight ? `${p.weight} kg` : '—'} • {p.workoutDone ? 'Workout done' : 'Rest'} <span className="text-gray-500">({p.date ? new Date(p.date).toLocaleDateString() : ''})</span></li>
            ))}
            {!progress.length && <li className="text-sm text-gray-500">No progress logs yet</li>}
          </ul>
        </section>
      </div>
    </div>
  )
}