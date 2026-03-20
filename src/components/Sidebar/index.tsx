import { Home, BarChart2, User, Calendar, Zap, Bell, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { icon: Home, active: false },
  { icon: BarChart2, active: true },
  { icon: User, active: false },
  { icon: Calendar, active: false },
  { icon: Zap, active: false },
  { icon: Bell, active: false },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-14 bg-white border-r border-gray-100 flex flex-col items-center py-4 z-10">
      <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mb-6 shrink-0">
        S
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ icon: Icon, active }, i) => (
          <button
            key={i}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              active
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-3">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold">
          U
        </div>
      </div>
    </aside>
  )
}
