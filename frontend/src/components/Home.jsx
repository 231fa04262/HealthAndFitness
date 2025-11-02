import { Link, Navigate } from 'react-router-dom'

export default function Home() {
  const isAuthed = !!localStorage.getItem('token')
  if (isAuthed) return <Navigate to="/dashboard" replace />
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl">
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop" alt="Fitness hero" className="w-full h-72 object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="max-w-3xl px-6">
            <h1 className="text-white text-4xl font-bold mb-3">Track workouts, diet, and progress</h1>
            <p className="text-white/90 mb-5">Your all-in-one Health and Fitness companion. Plan better. Live healthier.</p>
            <div className="flex gap-3">
              <Link to="/login" className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Login</Link>
              <Link to="/register" className="px-5 py-2 bg-white text-gray-900 rounded shadow hover:bg-gray-100">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop'
        ].map((src, i) => (
          <div key={i} className="overflow-hidden rounded-xl shadow">
            <img src={src} alt="feature" className="w-full h-48 object-cover hover:scale-105 transition-transform" />
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[{
          title: 'Plan Workouts',
          text: 'Set type, duration, and notes. Track progress by date.'
        }, {
          title: 'Log Diet',
          text: 'Record meals and calories. See daily totals quickly.'
        }, {
          title: 'See Progress',
          text: 'Visualize weight and workout adherence over time.'
        }].map((c, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-semibold mb-1">{c.title}</h3>
            <p className="text-gray-600 text-sm">{c.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}


