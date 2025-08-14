import React, { createContext, useContext, useState, useEffect } from 'react'
import { API_ENDPOINTS, apiCall } from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Validation functions
const validateName = (name) => {
  if (name.length < 3) return 'Name must be at least 3 characters'
  if (name.length > 60) return 'Name cannot exceed 60 characters'
  return null
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Please enter a valid email address'
  return null
}

const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (password.length > 16) return 'Password cannot exceed 16 characters'
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter'
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include at least one special character'
  return null
}

const validateAddress = (address) => {
  if (address.length > 400) return 'Address cannot exceed 400 characters'
  return null
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('token')
    if (!savedToken) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await apiCall(API_ENDPOINTS.ME)
      setUser(data)
      setToken(savedToken)
    } catch (err) {
      localStorage.removeItem('token')
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiCall(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      localStorage.setItem('token', data.token)
      setUser(data.user)
      setToken(data.token)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiCall(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      localStorage.setItem('token', data.token)
      setUser(data.user)
      setToken(data.token)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
    setError(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      token,
      login,
      register,
      logout,
      validateName,
      validateEmail,
      validatePassword,
      validateAddress
    }}>
      {children}
    </AuthContext.Provider>
  )
}

