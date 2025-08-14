import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Mail, Lock, User, MapPin, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle, Crown } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})
  const { register, user, validateName, validateEmail, validatePassword, validateAddress } = useAuth()
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return validateName(value)
      case 'email':
        return validateEmail(value)
      case 'password':
        return validatePassword(value)
      case 'address':
        return validateAddress(value)
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : null
      default:
        return null
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Real-time validation
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    const addressError = validateAddress(formData.address)
    const confirmPasswordError = formData.password !== formData.confirmPassword ? 'Passwords do not match' : null

    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      address: addressError,
      confirmPassword: confirmPasswordError
    }

    setErrors(newErrors)

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== null)) {
      toast.error('Please fix the form errors before submitting')
      return
    }

    setLoading(true)

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address
    })
    
    if (result.success) {
      toast.success('Account created successfully! 🎉')
      navigate('/dashboard')
    } else {
      toast.error(result.message)
    }
    
    setLoading(false)
  }

  const nextStep = () => {
    if (currentStep === 1) {
      const nameError = validateName(formData.name)
      const emailError = validateEmail(formData.email)
      const addressError = validateAddress(formData.address)
      
      if (nameError || emailError || addressError) {
        toast.error('Please fix the errors before proceeding')
        return
      }
    }
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/\d/)) strength++
    if (password.match(/[^A-Za-z0-9]/)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

  const stepContent = [
    {
      title: "Personal Information",
      description: "Let's start with your basic details",
      icon: User
    },
    {
      title: "Security Setup",
      description: "Create a strong password for your account",
      icon: Lock
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-50"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-pulse opacity-30"></div>
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
            {/* Left Side - Progress Steps */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-r border-white/20 flex flex-col justify-center"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Crown className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Registration Progress
                </h3>
                <p className="text-gray-300 text-sm">
                  Complete the steps to join our network
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-6">
                {stepContent.map((step, index) => {
                  const StepIcon = step.icon
                  const stepNumber = index + 1
                  const isActive = currentStep === stepNumber
                  const isCompleted = currentStep > stepNumber

                  return (
                    <motion.div
                      key={stepNumber}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`flex items-start space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                        isActive ? 'bg-white/20 border border-white/30' : 
                        isCompleted ? 'bg-green-500/10 border border-green-500/30' : 
                        'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' :
                        isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                        'bg-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <StepIcon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-base mb-1 transition-colors duration-300 ${
                          isActive ? 'text-white' : 
                          isCompleted ? 'text-green-400' :
                          'text-gray-400'
                        }`}>
                          Step {stepNumber}: {step.title}
                        </h4>
                        <p className={`text-sm transition-colors duration-300 ${
                          isActive ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-400 text-center">
                  🔒 <strong>Secure:</strong> Your information is encrypted and protected with enterprise-grade security.
                </p>
              </div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="p-8 flex flex-col justify-center"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Join Elite Network
                </h2>
                <p className="text-gray-300 text-lg">
                  {stepContent[currentStep - 1]?.title || "Create your account"}
                </p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="relative">
                        <label className="block text-sm font-semibold mb-3 text-gray-300">
                          Full Name <span className="text-blue-400">(3-60 characters)</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                              errors.name 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-white/20 focus:border-blue-500 focus:ring-blue-500/20'
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-semibold mb-3 text-gray-300">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                              errors.email 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-white/20 focus:border-blue-500 focus:ring-blue-500/20'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-semibold mb-3 text-gray-300">
                          Address <span className="text-blue-400">(Max 400 characters)</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-5 w-5 h-5 text-blue-400" />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            rows="3"
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 resize-none ${
                              errors.address 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-white/20 focus:border-blue-500 focus:ring-blue-500/20'
                            }`}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          {errors.address ? (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-red-400 text-sm"
                            >
                              {errors.address}
                            </motion.p>
                          ) : (
                            <span></span>
                          )}
                          <span className="text-xs text-gray-400">
                            {formData.address.length}/400
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="relative">
                        <label className="block text-sm font-semibold mb-3 text-gray-300">
                          Password <span className="text-purple-400">(8-16 chars, 1 uppercase, 1 special)</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                            className={`w-full pl-12 pr-14 py-4 bg-white/10 backdrop-blur-md border text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                              errors.password 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-white/20 focus:border-purple-500 focus:ring-purple-500/20'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.password}
                          </motion.p>
                        )}

                        {/* Password Strength Indicator */}
                        {formData.password && !errors.password && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3"
                          >
                            <div className="flex space-x-1 mb-2">
                              {[0, 1, 2, 3].map((index) => (
                                <div
                                  key={index}
                                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                    index < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-400">
                              Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Too weak'}
                            </p>
                          </motion.div>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-semibold mb-3 text-gray-300">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            className={`w-full pl-12 pr-14 py-4 bg-white/10 backdrop-blur-md border text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                              errors.confirmPassword 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-white/20 focus:border-purple-500 focus:ring-purple-500/20'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex space-x-4 pt-4">
                  {currentStep > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-4 px-6 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold hover:bg-white/20 transition-all duration-300"
                    >
                      Previous
                    </motion.button>
                  )}
                  
                  {currentStep < 2 ? (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={nextStep}
                      className="group flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading || formData.password !== formData.confirmPassword}
                      className="group flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 text-lg"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <Crown className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                          <span>Join Elite Network</span>
                          <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </form>

              {/* Sign In Link */}
              <div className="text-center mt-8">
                <p className="text-gray-300 text-lg">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold hover:from-blue-300 hover:to-purple-300 transition-all duration-300"
                  >
                    Sign in
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

export default Register
