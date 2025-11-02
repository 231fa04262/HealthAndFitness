import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import WorkoutPlanner from './components/WorkoutPlanner.jsx'
import DietPlan from './components/DietPlan.jsx'
import ProgressTracker from './components/ProgressTracker.jsx'
import HealthTips from './components/HealthTips.jsx'
import Home from './components/Home.jsx'
import Profile from './components/Profile.jsx'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function Navbar() {
  const navigate = useNavigate()
  const isAuthed = !!localStorage.getItem('token')
  const onLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">Health and Fitness</Link>
        <div className="flex items-center gap-4">
          {!isAuthed && (
            <>
              <Link className="hover:text-blue-600" to="/">Home</Link>
              <Link className="px-3 py-1 rounded bg-blue-600 text-white" to="/login">Login</Link>
            </>
          )}
          {isAuthed && (
            <>
              <Link className="hover:text-blue-600" to="/dashboard">Dashboard</Link>
              <Link className="hover:text-blue-600" to="/workouts">Workouts</Link>
              <Link className="hover:text-blue-600" to="/diet">Diet</Link>
              <Link className="hover:text-blue-600" to="/progress">Progress</Link>
              <Link className="hover:text-blue-600" to="/tips">Tips</Link>
              <Link className="hover:text-blue-600" to="/profile">Profile</Link>
              <button onClick={onLogout} className="text-red-600 hover:underline">Logout</button>
            </>
          )}
          {!isAuthed && (
            <Link className="hover:text-blue-600" to="/register">Register</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute><WorkoutPlanner /></ProtectedRoute>} />
          <Route path="/diet" element={<ProtectedRoute><DietPlan /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressTracker /></ProtectedRoute>} />
          <Route path="/tips" element={<ProtectedRoute><HealthTips /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}


