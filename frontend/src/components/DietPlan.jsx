import { useEffect, useState } from 'react'
import api from '../api'

export default function DietPlan() {
  const today = new Date().toISOString().slice(0, 10)
  const [meals, setMeals] = useState([{ name: '', calories: '' }])
  const [totalCalories, setTotalCalories] = useState('')
  const [date, setDate] = useState(today)
  const [items, setItems] = useState([])

  const load = async () => {
    const { data } = await api.get('/diets')
    setItems(data.data)
  }
  useEffect(() => { load() }, [])

  const updateMeal = (idx, key, value) => {
    const copy = meals.slice()
    copy[idx][key] = value
    setMeals(copy)
  }
  const addMeal = () => setMeals([...meals, { name: '', calories: '' }])
  const removeMeal = (idx) => setMeals(meals.filter((_, i) => i !== idx))

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      meals: meals.filter(m => m.name).map(m => ({ name: m.name, calories: Number(m.calories || 0) })),
      totalCalories: totalCalories ? Number(totalCalories) : meals.reduce((s, m) => s + Number(m.calories || 0), 0),
      date
    }
    await api.post('/diets', payload)
    setMeals([{ name: '', calories: '' }])
    setTotalCalories('')
    setDate(today)
    await load()
  }

  const onDelete = async (id) => {
    await api.delete(`/diets/${id}`)
    await load()
  }

  const onUpdate = async (id) => {
    const payload = {
      meals: meals.filter(m => m.name).map(m => ({ name: m.name, calories: Number(m.calories || 0) })),
      totalCalories: totalCalories ? Number(totalCalories) : meals.reduce((s, m) => s + Number(m.calories || 0), 0),
      date
    }
    await api.put(`/diets/${id}`, payload)
    setMeals([{ name: '', calories: '' }])
    setTotalCalories('')
    setDate(today)
    await load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        🥗 Diet Plan Tracker
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Diet Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-blue-200 transition-shadow duration-300">
          <h2 className="font-semibold text-lg text-blue-700 mb-4">Log Your Diet</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            {meals.map((m, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  className="flex-1 border border-blue-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Meal name"
                  value={m.name}
                  onChange={(e) => updateMeal(idx, 'name', e.target.value)}
                />
                <input
                  className="w-32 border border-blue-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  type="number"
                  placeholder="Calories"
                  value={m.calories}
                  onChange={(e) => updateMeal(idx, 'calories', e.target.value)}
                />
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 font-bold"
                  onClick={() => removeMeal(idx)}
                >
                  ×
                </button>
              </div>
            ))}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addMeal}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-xl font-medium hover:bg-blue-200 transition-colors"
              >
                + Add Meal
              </button>
              <input
                className="border border-blue-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                type="number"
                placeholder="Total calories (optional)"
                value={totalCalories}
                onChange={(e) => setTotalCalories(e.target.value)}
              />
            </div>

            <input
              className="w-full border border-blue-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2 shadow-md transition-all">
              Save Diet Log
            </button>
          </form>
        </div>

        {/* Diet List */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-blue-200 transition-shadow duration-300">
          <h2 className="font-semibold text-lg text-blue-700 mb-4">Your Diet Logs</h2>
          <ul className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {items.length ? (
              items.map((item) => (
                <li
                  key={item._id}
                  className="border border-blue-100 rounded-xl p-4 hover:shadow-md hover:shadow-blue-100 transition-all"
                >
                  <div className="font-medium text-blue-700">
                    Total: {item.totalCalories} kcal
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.date ? new Date(item.date).toLocaleDateString() : ''}
                  </div>
                  <ul className="text-sm text-gray-700 list-disc ml-5 mt-1">
                    {item.meals?.map((m, i) => (
                      <li key={i}>
                        {m.name} — {m.calories} kcal
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex gap-3 text-sm">
                    <button
                      onClick={() => onDelete(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => onUpdate(item._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Update with form
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500 text-center py-6">
                No diet logs yet 🍽️
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
