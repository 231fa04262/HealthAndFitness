import { useEffect, useState } from 'react'
import api from '../api'

export default function ProgressTracker() {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({ weight: '', workoutDone: false, date: today })
  const [items, setItems] = useState([])

  const load = async () => {
    const { data } = await api.get('/progress')
    setItems(data.data)
  }
  useEffect(() => { load() }, [])

  const onChange = (e) => {
    const { name, type, checked, value } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const reset = () => setForm({ weight: '', workoutDone: false, date: today })

  const onSubmit = async (e) => {
    e.preventDefault()
    await api.post('/progress', { 
      weight: form.weight ? Number(form.weight) : undefined, 
      workoutDone: form.workoutDone, 
      date: form.date 
    })
    await load(); reset()
  }

  const onDelete = async (id) => { await api.delete(`/progress/${id}`); await load() }

  const onUpdate = async (id) => {
    await api.put(`/progress/${id}`, { 
      weight: form.weight ? Number(form.weight) : undefined, 
      workoutDone: form.workoutDone, 
      date: form.date 
    })
    await load(); reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        💪 Progress Tracker
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Log Progress Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-blue-200 transition-shadow duration-300">
          <h2 className="font-semibold text-lg text-blue-700 mb-4">Log Your Progress</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              className="w-full border border-blue-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              type="number"
              step="0.1"
              name="weight"
              placeholder="Weight (kg)"
              value={form.weight}
              onChange={onChange}
            />
            <label className="flex items-center gap-2 text-sm text-blue-700 font-medium">
              <input
                type="checkbox"
                name="workoutDone"
                checked={form.workoutDone}
                onChange={onChange}
                className="accent-blue-600 w-4 h-4"
              />
              Workout done today
            </label>
            <input
              className="w-full border border-blue-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2 shadow-md transition-all">
              Save Progress
            </button>
          </form>
        </div>

        {/* Progress Logs */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-blue-200 transition-shadow duration-300">
          <h2 className="font-semibold text-lg text-blue-700 mb-4">Your Logs</h2>
          <ul className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {items.length ? (
              items.map(item => (
                <li
                  key={item._id}
                  className="border border-blue-100 rounded-xl p-4 hover:shadow-md hover:shadow-blue-100 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-blue-700">
                      {item.weight ? `${item.weight} kg` : '—'}
                    </div>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        item.workoutDone
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {item.workoutDone ? 'Workout Done' : 'Rest Day'}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {item.date ? new Date(item.date).toLocaleDateString() : ''}
                  </div>

                  <div className="mt-3 flex gap-3 text-sm">
                    <button
                      onClick={() => onDelete(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        setForm({
                          weight: item.weight || '',
                          workoutDone: !!item.workoutDone,
                          date: item.date ? item.date.slice(0, 10) : today,
                        })
                      }
                      className="text-gray-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onUpdate(item._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Update
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500 text-center py-6">
                No progress logs yet 📅
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
