import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

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

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (userData) => {
    try {
      // Frontend validation
      const nameError = validateName(userData.name)
      if (nameError) return { success: false, message: nameError }

      const emailError = validateEmail(userData.email)
      if (emailError) return { success: false, message: emailError }

      const passwordError = validatePassword(userData.password)
      if (passwordError) return { success: false, message: passwordError }

      const addressError = validateAddress(userData.address)
      if (addressError) return { success: false, message: addressError }

      await axios.post('/api/auth/register', userData)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
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
