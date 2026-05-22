// src/components/ProtectedRoute.jsx
// Redirects unauthenticated users to /login

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user } = useAuth()
  // If no user in context/localStorage, send to login
  return user ? <Outlet /> : <Navigate to="/login" replace />
}