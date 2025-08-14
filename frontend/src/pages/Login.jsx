import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, User, Shield, Store } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)
  const { login, user } = useAuth()
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      toast.success('Welcome back! 🎉')
      navigate('/dashboard')
    } else {
      toast.error(result.message)
    }
    
    setLoading(false)
  }

  const demoCredentials = [
    {
      role: 'System Admin',
      email: 'admin@roxiler.com',
      password: 'admin123',
      icon: Shield,
      color: 'from-red-500 to-pink-500'
    },
    {
      role: 'Store Owner',
      email: 'alicew@example.com',
      password: 'user123',
      icon: Store,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      role: 'Normal User',
      email: 'johnsmith@example.com',
      password: 'store123',
      icon: User,
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const fillDemoCredentials = (demo) => {
    setFormData({ email: demo.email, password: demo.password })
    toast.info(`Filled ${demo.role} credentials`)
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-50"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-pink-500 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-60" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left Side - Demo Credentials */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="p-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-r border-white/20"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Demo Access
                </h3>
                <p className="text-gray-300 text-sm">
                  Try different user roles instantly
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white mb-4">Quick Login Options:</h4>
                {demoCredentials.map((demo, index) => {
                  const IconComponent = demo.icon
                  return (
                    <motion.button
                      key={demo.role}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      onClick={() => fillDemoCredentials(demo)}
                      className="w-full p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 text-left hover:scale-[1.02] group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${demo.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white text-base">{demo.role}</p>
                          <p className="text-gray-400 text-sm">{demo.email}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-400 text-center">
                  💡 <strong>Tip:</strong> Click any demo credential above to auto-fill the login form and explore different user roles.
                </p>
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="p-8 flex flex-col justify-center"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-gray-300 text-lg">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="relative">
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="w-full pl-12 pr-14 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 text-lg"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Launch Your Success</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-8">
                <p className="text-gray-300 text-lg">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold hover:from-purple-300 hover:to-pink-300 transition-all duration-300"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
         