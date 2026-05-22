// src/pages/Projects.jsx
// Project list + create/add member (admin) or view-only (member)

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Projects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Create project form state
  const [showCreate, setShowCreate] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })

  // Add member form state
  const [addMemberProjectId, setAddMemberProjectId] = useState(null)
  const [memberEmail, setMemberEmail] = useState('')
  const [message, setMessage] = useState('')

  // Members dropdown state
  const [membersList, setMembersList] = useState([])
  const [membersLoading, setMembersLoading] = useState(false)

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      setProjects(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all users with role "member" for the dropdown
  const fetchMembers = async () => {
    setMembersLoading(true)
    try {
      const res = await api.get('/auth/members')
      setMembersList(res.data)
    } catch (err) {
      console.error('Failed to fetch members:', err)
    } finally {
      setMembersLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      await api.post('/projects', newProject)
      setNewProject({ name: '', description: '' })
      setShowCreate(false)
      fetchProjects()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create project')
    }
  }

  // When admin clicks "+ Add member", fetch the members list
  const handleOpenAddMember = (projectId) => {
    setAddMemberProjectId(projectId)
    setMemberEmail('')
    setMessage('')
    fetchMembers()
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!memberEmail) {
      setMessage('Please select a member')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    try {
      const res = await api.post(`/projects/${addMemberProjectId}/members`, { email: memberEmail })
      setMessage(res.data.message)
      setMemberEmail('')
      setAddMemberProjectId(null)
      fetchProjects()  // refresh member count
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to add member')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Projects</h2>

          {/* Only admin sees Create Project button */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + New Project
            </button>
          )}
        </div>

        {/* Create Project Form */}
        {showCreate && user?.role === 'admin' && (
          <form onSubmit={handleCreateProject} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 space-y-3 transition-colors duration-300">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Create Project</h3>
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <textarea
              placeholder="Description (optional)"
              value={newProject.description}
              onChange={e => setNewProject({ ...newProject, description: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                Create
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Project list */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-400 text-center mt-12">No projects yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div key={project.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm transition-colors duration-300">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.description}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  👥 {project.members.length} member(s)
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  📅 {new Date(project.created_at).toLocaleDateString()}
                </p>

                {/* Add member — admin only, with dropdown */}
                {user?.role === 'admin' && (
                  <div className="mt-3">
                    {addMemberProjectId === project.id ? (
                      <form onSubmit={handleAddMember} className="flex gap-2 items-center">
                        <select
                          value={memberEmail}
                          onChange={e => setMemberEmail(e.target.value)}
                          required
                          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-100"
                        >
                          <option value="" disabled>
                            {membersLoading ? 'Loading members...' : '-- Select a Member --'}
                          </option>
                          {membersList.map(member => (
                            <option key={member.id} value={member.email}>
                              {member.name} ({member.email})
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">
                          Add
                        </button>
                        <button type="button" onClick={() => setAddMemberProjectId(null)} className="text-xs text-gray-400 hover:text-red-500">
                          ✕
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => handleOpenAddMember(project.id)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                      >
                        + Add member
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Feedback message */}
        {message && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
            {message}
          </div>
        )}
      </main>
    </div>
  )
}