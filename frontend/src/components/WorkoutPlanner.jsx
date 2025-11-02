import { useEffect, useState } from 'react'
import api from '../api'

export default function WorkoutPlanner() {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({ type: '', duration: '', notes: '', date: today })
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    const { data } = await api.get('/workouts')
    setItems(data.data)
  }
  useEffect(() => { load() }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const reset = () => setForm({ type: '', duration: '', notes: '', date: today })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.type || !form.duration) {
      setError('Type and duration are required')
      return
    }
    await api.post('/workouts', { ...form, duration: Number(form.duration), date: form.date })
    await load()
    reset()
  }

  const onDelete = async (id) => {
    await api.delete(`/workouts/${id}`)
    await load()
  }

  const onUpdate = async (id) => {
    const updated = { ...form }
    if (!updated.type || !updated.duration) {
      setError('Type and duration are required')
      return
    }
    updated.duration = Number(updated.duration)
    await api.put(`/workouts/${id}`, updated)
    await load()
    reset()
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-0 space-y-8">
      {/* Heading Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-700">Workout Plan</h1>
        <p className="text-gray-500 mt-2">
          Plan, track, and improve your fitness journey step by step 💪
        </p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Add Workout */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <h2 className="font-semibold text-xl text-blue-700 mb-4">Add Workout</h2>
          {error && <div className="mb-3 text-red-600 text-sm bg-red-50 px-3 py-2 rounded">{error}</div>}

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 rounded-xl px-4 py-2 outline-none transition-all"
              name="type"
              placeholder="Workout Type (e.g., Running)"
              value={form.type}
              onChange={onChange}
            />
            <input
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 rounded-xl px-4 py-2 outline-none transition-all"
              type="number"
              name="duration"
              placeholder="Duration (in minutes)"
              value={form.duration}
              onChange={onChange}
            />
            <textarea
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 rounded-xl px-4 py-2 outline-none transition-all"
              name="notes"
              placeholder="Notes or goals"
              value={form.notes}
              onChange={onChange}
              rows="3"
            />
            <input
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 rounded-xl px-4 py-2 outline-none transition-all"
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2 transition-colors">
              Save Workout
            </button>
          </form>
        </div>

        {/* Right: Workout List */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <h2 className="font-semibold text-xl text-blue-700 mb-4">Your Workouts</h2>
          <ul className="space-y-4 max-h-[500px] overflow-y-auto">
            {items.map(item => (
              <li
                key={item._id}
                className="border border-blue-100 hover:border-blue-300 p-4 rounded-xl bg-gradient-to-br from-white to-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="font-medium text-gray-800">
                  {item.type} • {item.duration} min
                </div>
                <div className="text-xs text-gray-500">
                  {item.date ? new Date(item.date).toLocaleDateString() : ''}
                </div>
                {item.notes && (
                  <div className="text-sm text-gray-600 mt-1 italic">“{item.notes}”</div>
                )}
                <div className="mt-2 flex gap-4 text-sm font-medium">
                  <button
                    onClick={() =>
                      setForm({
                        type: item.type,
                        duration: item.duration,
                        notes: item.notes || '',
                        date: item.date ? item.date.slice(0, 10) : today,
                      })
                    }
                    className="text-yellow-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onUpdate(item._id)}
                    className="text-blue-600 hover:underline"
                  >
                    💾 Update
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
            {!items.length && (
              <li className="text-sm text-gray-500 text-center py-8">
                No workouts yet. Start by adding one! 💪
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
