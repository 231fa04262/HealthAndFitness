import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', password: '', age: '', weight: '', height: '', goals: '', profilePic: ''
  })
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.email || !form.password) {
      setError('Username, email and password are required')
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        height: form.height ? Number(form.height) : undefined,
      }
      const { data } = await api.post('/auth/register', payload)
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      if (file && ['image/jpeg', 'image/jpg'].includes(file.type)) {
        const formData = new FormData()
        formData.append('photo', file)
        try {
          const uploadRes = await api.post('/auth/profile/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          const newPic = uploadRes?.data?.data?.profilePic
          if (newPic) {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            localStorage.setItem('user', JSON.stringify({ ...user, profilePic: newPic }))
          }
        } catch (_) { /* ignore upload error */ }
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Create Your Account</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full border border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 outline-none" name="username" placeholder="Username" value={form.username} onChange={onChange} />
          <input className="w-full border border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 outline-none" type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} />
          <input className="w-full border border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 outline-none" type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} />

          <div className="grid grid-cols-3 gap-3">
            <input className="border border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 outline-none" type="number" name="age" placeholder="Age" value={form.age} onChange={onChange} />
            <input className="border border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 outline-none" type="number" step="0.1" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={onChange} />
            <input className="border border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 outline-none" type="number" step="0.1" name="height" placeholder="Height (cm)" value={form.height} onChange={onChange} />
          </div>

          <textarea className="w-full border border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 outline-none" name="goals" placeholder="Your fitness goals..." value={form.goals} onChange={onChange} />

          <div>
            <label className="text-sm text-blue-700 block mb-1 font-medium">Upload Profile Picture (.jpg/.jpeg)</label>
            <input type="file" accept="image/jpeg,image/jpg" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
          </div>

          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-medium rounded-lg py-2 shadow-md disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  )
}
