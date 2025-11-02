import { motion } from "framer-motion"
import { Droplets, Dumbbell, Utensils, Moon } from "lucide-react"

export default function HealthTips() {
  const tips = [
    {
      title: 'Hydration matters',
      text: 'Drink 2–3 liters of water daily to stay refreshed and support metabolism.',
      img: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1600&auto=format&fit=crop', // people hydrating together
      icon: <Droplets className="w-6 h-6 text-sky-500" />,
      color: 'from-sky-100 to-white'
    },
    {
      title: 'Move every hour',
      text: 'Stand, stretch, or walk for a few minutes each hour to boost energy and reduce stiffness.',
      img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1600&auto=format&fit=crop', // male + female stretching in gym
      icon: <Dumbbell className="w-6 h-6 text-blue-600" />,
      color: 'from-blue-100 to-white'
    },
    {
  title: 'Protein at each meal',
  text: 'Include lean proteins like eggs, fish, or lentils for better muscle recovery and fullness.',
  img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1000&q=80',
  icon: <Utensils className="w-6 h-6 text-indigo-600" />,
  color: 'from-indigo-100 to-white'
},
    {
      title: 'Sleep 7–9 hours',
      text: 'A calm, dark environment improves sleep quality and boosts overall well-being.',
      img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop', // serene man & woman sleeping
      icon: <Moon className="w-6 h-6 text-blue-800" />,
      color: 'from-blue-50 to-white'
    },
  ]

  return (
    <div className="space-y-10 p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=2000&auto=format&fit=crop"
          alt="Health lifestyle banner"
          className="w-full h-56 object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start px-8 bg-gradient-to-t from-black/50 to-transparent">
          <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">
            Workout Plan
          </h1>
          <p className="text-white/90 mt-2 text-sm md:text-base max-w-lg">
            Build strength, stay active, and fuel your health every day.
          </p>
        </div>
      </header>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {tips.map((tip, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`rounded-2xl overflow-hidden shadow-md bg-gradient-to-b ${tip.color} hover:shadow-xl hover:scale-[1.02] transition-transform duration-300`}
          >
            <div className="relative">
              <img src={tip.img} alt={tip.title} className="w-full h-44 object-cover" />
              <div className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow-sm backdrop-blur-md">
                {tip.icon}
              </div>
            </div>

            <div className="p-5">
              <h2 className="font-semibold text-xl mb-2 text-gray-800 flex items-center gap-2">
                {tip.title}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">{tip.text}</p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-100 to-sky-100 rounded-xl p-6 text-center shadow"
      >
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          🌱 Small Steps, Big Change
        </h3>
        <p className="text-gray-600 text-sm">
          Consistency beats intensity. Follow these small steps daily — your body and mind will thank you.
        </p>
      </motion.div>
    </div>
  )
}
