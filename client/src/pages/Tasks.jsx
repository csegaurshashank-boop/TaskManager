// src/pages/Tasks.jsx
// Task list with create task (admin) and status update (all)

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import TaskCard from '../components/TaskCard'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Tasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('all')

  const [newTask, setNewTask] = useState({
    title: '', description: '', project_id: '', assigned_to: '', due_date: ''
  })

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch projects (for create task dropdown)
  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      setProjects(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTasks()
    if (user?.role === 'admin') fetchProjects()
  }, [])

  // When project changes, load that project's members for assignment dropdown
  const handleProjectChange = async (projectId) => {
    setNewTask({ ...newTask, project_id: projectId, assigned_to: '' })
    try {
      const res = await api.get(`/projects/${projectId}/members`)
      setMembers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      await api.post('/tasks', newTask)
      setNewTask({ title: '', description: '', project_id: '', assigned_to: '', due_date: '' })
      setShowCreate(false)
      fetchTasks()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create task')
    }
  }

  // Filter tasks by status
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter)

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tasks</h2>

          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              + New Task
            </button>
          )}
        </div>

        {/* Create Task Form — admin only */}
        {showCreate && user?.role === 'admin' && (
          <form onSubmit={handleCreateTask} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6 space-y-3 transition-colors duration-300">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Create Task</h3>

            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />

            <textarea
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />

            {/* Project selection */}
            <select
              value={newTask.project_id}
              onChange={e => handleProjectChange(e.target.value)}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Assign to member */}
            {members.length > 0 && (
              <select
                value={newTask.assigned_to}
                onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Assign to member</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                ))}
              </select>
            )}

            <div className="flex gap-3 items-center">
              <label className="text-sm text-gray-600 dark:text-gray-400">Due date:</label>
              <input
                type="date"
                value={newTask.due_date}
                onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                Create Task
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Status filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'todo', 'in_progress', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Task grid */}
        {loading ? (
          <p className="text-gray-400">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-gray-400 text-center mt-12">No tasks found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} onStatusChange={fetchTasks} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}