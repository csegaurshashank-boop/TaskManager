// src/components/Sidebar.jsx
// Sidebar navigation — shows different links based on role + dark mode toggle

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Nav link class helper — active link gets blue highlight
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`

  return (
    <aside className="w-56 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
      {/* Logo / App name */}
      <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">TaskFlow</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Team Collaboration</p>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.name}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          user?.role === 'admin'
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
            : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
        }`}>
          {user?.role}
        </span>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <NavLink to="/dashboard" className={linkClass}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/projects" className={linkClass}>
          📁 Projects
        </NavLink>
        <NavLink to="/tasks" className={linkClass}>
          ✅ Tasks
        </NavLink>
      </nav>

      {/* Dark mode toggle + Logout */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <>
              <span className="text-lg">☀️</span>
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <span className="text-lg">🌙</span>
              <span>Dark Mode</span>
            </>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}