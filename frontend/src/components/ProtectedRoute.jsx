import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth()
  const { isDarkMode } = useTheme()
  const location = useLocation()

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Loading...
          </div>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login with the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'system_admin' ? '/admin' 
                       : user.role === 'store_owner' ? '/store' 
                       : '/user'
    return <Navigate to={redirectPath} replace />
  }

  return children
}

export default ProtectedRoute
