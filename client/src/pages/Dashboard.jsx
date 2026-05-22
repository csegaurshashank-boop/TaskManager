// src/pages/Dashboard.jsx
// Dashboard with stats cards and recent tasks

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

// Stat card component
function StatCard({ label, value, color, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tasks/dashboard')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Page header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome back, {user?.name} 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Here's an overview of your tasks
          </p>
        </div>

        {/* Stats cards */}
        {loading ? (
          <p className="text-gray-400">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Tasks"    value={stats?.total}       color="text-blue-600 dark:text-blue-400"   icon="📋" />
            <StatCard label="Completed"      value={stats?.completed}   color="text-green-600 dark:text-green-400"  icon="✅" />
            <StatCard label="In Progress"    value={stats?.in_progress} color="text-yellow-600 dark:text-yellow-400" icon="⏳" />
            <StatCard label="Overdue"        value={stats?.overdue}     color="text-red-600 dark:text-red-400"    icon="🔴" />
          </div>
        )}

        {/* Role-specific tip */}
        <div className={`rounded-xl p-4 text-sm ${
          user?.role === 'admin'
            ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700'
            : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700'
        }`}>
          {user?.role === 'admin' ? (
            <p>🛡️ <strong>Admin:</strong> You can create projects, add members, and assign tasks from the sidebar.</p>
          ) : (
            <p>👤 <strong>Member:</strong> Check your assigned tasks and update their status from the Tasks page.</p>
          )}
        </div>
      </main>
    </div>
  )
}