import React, { createContext, useState, useCallback } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('authToken')
  })
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || ''
  })

  const login = useCallback(async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }
      
      const data = await response.json()
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('username', data.username)
      setIsAuthenticated(true)
      setUsername(data.username)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    setIsAuthenticated(false)
    setUsername('')
  }, [])

  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return null

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000

      if (payload.exp && payload.exp < currentTime) {
        // Token is expired, clear it
        logout()
        return null
      }

      return token
    } catch (err) {
      // Invalid token format, clear it
      logout()
      return null
    }
  }, [logout])

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, getAuthToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
