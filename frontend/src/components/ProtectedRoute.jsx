import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ element }) {
  const { getAuthToken } = useAuth()
  
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />
  }
  
  return element
}
