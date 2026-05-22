// src/components/TaskCard.jsx
// Single task card with status badge and status update dropdown

import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

// Status badge colors (light + dark variants)
const statusStyles = {
  todo: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  in_progress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export default function TaskCard({ task, onStatusChange }) {
  const { user } = useAuth()

  const handleStatusChange = async (e) => {
    try {
      await api.patch(`/tasks/${task.id}/status`, { status: e.target.value })
      onStatusChange() // re-fetch tasks from parent
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update status')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Task title */}
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{task.title}</h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        {/* Assigned to */}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          👤 {task.assigned_to_name || 'Unassigned'}
        </span>

        {/* Due date */}
        {task.due_date && (
          <span className="text-xs text-gray-500 dark:text-gray-400">📅 {task.due_date}</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        {/* Status badge */}
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>

        {/* Status dropdown — visible to all, but backend enforces ownership */}
        <select
          defaultValue={task.status}
          onChange={handleStatusChange}
          className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  )
}