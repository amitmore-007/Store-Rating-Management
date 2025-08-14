import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun, User, LogOut, Menu, X, Sparkles, LayoutDashboard } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowUserDropdown(false)
  }

  const getRoleDashboard = () => {
    switch (user?.role) {
      case 'system_admin':
        return '/admin'
      case 'normal_user':
        return '/user'
      case 'store_owner':
        return '/store'
      default:
        return '/dashboard'
    }
  }

  const isHomePage = location.pathname === '/'

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHomePage 
          ? 'bg-transparent backdrop-blur-md border-b border-white/10' 
          : isDarkMode 
            ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700' 
            : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
      } shadow-lg`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Sparkles className={`w-8 h-8 ${
                isHomePage ? 'text-white' : isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <div className="absolute inset-0 w-8 h-8 bg-purple-400 rounded-full opacity-20 group-hover:animate-ping" />
            </motion.div>
            <motion.span 
              className={`text-2xl font-bold bg-gradient-to-r ${
                isDarkMode ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-600'
              } bg-clip-text text-transparent`}
            >
              Roxiler
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
              } shadow-lg hover:shadow-xl`}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {user ? (
              /* User Menu */
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                      : 'bg-white hover:bg-gray-50 text-gray-900'
                  } shadow-lg hover:shadow-xl border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${
                    isDarkMode ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-600'
                  }`}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.role?.replace('_', ' ') || 'User'}
                    </p>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      } overflow-hidden`}
                    >
                      <Link
                        to={getRoleDashboard()}
                        onClick={() => setShowUserDropdown(false)}
                        className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-gray-700 text-white' 
                            : 'hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-red-900/20 text-red-400' 
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      isHomePage
                        ? 'text-white border border-white/30 hover:bg-white/10'
                        : isDarkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg ${
                isHomePage ? 'text-white' : isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden overflow-hidden ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-2xl mt-4 mb-6 shadow-2xl`}
            >
              <div className="p-6 space-y-4">
                {user ? (
                  <>
                    <div className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user?.role?.replace('_', ' ') || 'User'}
                      </p>
                    </div>
                    <Link
                      to={getRoleDashboard()}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                        isDarkMode 
                          ? 'text-white hover:bg-gray-700' 
                          : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                        isDarkMode 
                          ? 'text-white hover:bg-gray-700' 
                          : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:bg-gray-700' 
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span>Switch to {isDarkMode ? 'Light' : 'Dark'} Mode</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
