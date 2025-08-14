import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { ArrowRight, User, ShieldCheck, Store } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        switch (user.role) {
          case 'system_admin':
            navigate('/admin')
            break
          case 'normal_user':
            navigate('/user')
            break
          case 'store_owner':
            navigate('/store')
            break
          default:
            break
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [user, navigate])

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Loading...
          </div>
        </motion.div>
      </div>
    )
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case 'system_admin':
        return ShieldCheck
      case 'store_owner':
        return Store
      default:
        return User
    }
  }

  const getRoleColor = () => {
    switch (user.role) {
      case 'system_admin':
        return 'from-red-500 to-pink-500'
      case 'store_owner':
        return 'from-blue-500 to-indigo-500'
      default:
        return 'from-green-500 to-emerald-500'
    }
  }

  const RoleIcon = getRoleIcon()

  return (
    <div className={`min-h-screen pt-24 px-6 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${getRoleColor()} flex items-center justify-center shadow-2xl`}
          >
            <RoleIcon className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Welcome back, {user.name}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            You're logged in as <span className="font-semibold text-purple-500">
              {user.role.replace('_', ' ')}
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className={`p-8 rounded-3xl ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-2xl mb-8`}
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={`w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full`}
              />
              <span className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Redirecting to your dashboard...
              </span>
            </div>
            
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex justify-center"
          >
            <button
              onClick={() => {
                switch (user.role) {
                  case 'system_admin':
                    navigate('/admin')
                    break
                  case 'normal_user':
                    navigate('/user')
                    break
                  case 'store_owner':
                    navigate('/store')
                    break
                  default:
                    break
                }
              }}
              className="group flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
