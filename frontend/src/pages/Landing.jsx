import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { Star, Users, Store, Shield, ArrowRight, Sparkles, Heart, Video, LineChart, Crown, GraduationCap , CheckCircle, Zap, TrendingUp, LogIn, UserPlus } from 'lucide-react'

const Landing = () => {
  const { isDarkMode } = useTheme()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const features = [
    {
      icon: Heart,
      title: "Smart Rating System",
      description: "Easy and intuitive rating system for stores with detailed feedback options"
    },
    {
      icon: Video,
      title: "Real-time Updates",
      description: "Get instant notifications and updates on store ratings and reviews"
    },
    {
      icon: LineChart,
      title: "Performance Tracking",
      description: "Track store performance with comprehensive rating analytics and insights"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security with advanced admin controls and data protection"
    }
  ]

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

      {/* Hero Section */}
      <motion.section 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="animate-fade-in">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 sm:mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                NEXT-GEN
              </span>
              <span className="block text-white">
                STORE
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                PLATFORM
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Where innovation meets excellence. Modern platform for store management and customer feedback with comprehensive rating system.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto my-12 sm:my-16">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-400 mb-2">25K+</div>
              <div className="text-gray-400 text-xs sm:text-sm md:text-base">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-400 mb-2">150K+</div>
              <div className="text-gray-400 text-xs sm:text-sm md:text-base">Reviews Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-400 text-xs sm:text-sm md:text-base">System Reliability</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <Link to="/login" className="group relative overflow-hidden w-full sm:w-auto">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-0.5 rounded-2xl">
                <div className="bg-black px-6 sm:px-8 py-3 sm:py-4 rounded-2xl flex items-center justify-center space-x-3 group-hover:bg-gradient-to-r group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition-all duration-300">
                  <Sparkles className="text-lg sm:text-xl group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-base sm:text-lg font-semibold">Launch Your Success</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
            </Link>
            
            <Link to="/register" className="group relative overflow-hidden w-full sm:w-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-0.5 rounded-2xl">
                <div className="bg-black px-6 sm:px-8 py-3 sm:py-4 rounded-2xl flex items-center justify-center space-x-3 group-hover:bg-gradient-to-r group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-300">
                  <Crown className="text-lg sm:text-xl group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-base sm:text-lg font-semibold">Join Elite Network</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
            </Link>
          </motion.div>

          {/* Features Preview */}
          <motion.div variants={itemVariants} className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto md:mx-0">
                <Heart className="text-xl sm:text-2xl text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center md:text-left">Smart Rating System</h3>
              <p className="text-gray-300 text-sm sm:text-base text-center md:text-left">Easy and intuitive rating system for stores with detailed customer feedback options.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto md:mx-0">
                <Video className="text-xl sm:text-2xl text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center md:text-left">Real-time Updates</h3>
              <p className="text-gray-300 text-sm sm:text-base text-center md:text-left">Get instant notifications and updates on store ratings and customer reviews.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto md:mx-0">
                <LineChart className="text-xl sm:text-2xl text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent text-center md:text-left">Performance Tracking</h3>
              <p className="text-gray-300 text-sm sm:text-base text-center md:text-left">Track store performance with comprehensive rating statistics and customer insights.</p>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowRight className="text-xl sm:text-2xl text-gray-400 rotate-90" />
        </div>
      </motion.section>

      {/* Start Your Journey Section */}
      <motion.section 
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Get Started
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Choose your role and access powerful features designed for your needs
            </p>
          </motion.div>

          {/* Login Options */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 mb-16 sm:mb-20">
            
            {/* Regular User */}
            <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-500">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="text-2xl sm:text-3xl text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Customer</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8">Rate and review stores, share your experiences</p>
              </div>
              
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                  <h4 className="text-green-400 font-semibold mb-3 text-sm sm:text-base">How to get started:</h4>
                  <ol className="space-y-2 text-gray-300 text-xs sm:text-sm">
                    <li>1. Create your customer account</li>
                    <li>2. Browse available stores</li>
                    <li>3. Rate stores and leave reviews</li>
                    <li>4. Help others with your feedback</li>
                  </ol>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/login" className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-center text-sm sm:text-base">
                  <LogIn className="inline w-4 h-4 mr-2" />
                  Login
                </Link>
                <Link to="/register" className="flex-1 border border-green-500/50 text-green-400 py-3 px-4 sm:px-6 rounded-xl font-semibold hover:bg-green-500/10 transition-all duration-300 text-center text-sm sm:text-base">
                  <UserPlus className="inline w-4 h-4 mr-2" />
                  Register
                </Link>
              </div>
            </motion.div>
            
            {/* Store Owner */}
            <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-500" style={{ animationDelay: '0.1s' }}>
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Store className="text-2xl sm:text-3xl text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Store Owner</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8">Manage your store and view customer feedback</p>
              </div>
              
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4">
                  <h4 className="text-purple-400 font-semibold mb-3 text-sm sm:text-base">How to get started:</h4>
                  <ol className="space-y-2 text-gray-300 text-xs sm:text-sm">
                    <li>1. Register your store owner account</li>
                    <li>2. Complete your store profile</li>
                    <li>3. Start receiving customer ratings</li>
                    <li>4. Monitor customer feedback</li>
                  </ol>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/login" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-center text-sm sm:text-base">
                  <LogIn className="inline w-4 h-4 mr-2" />
                  Login
                </Link>
                <Link to="/register" className="flex-1 border border-purple-500/50 text-purple-400 py-3 px-4 sm:px-6 rounded-xl font-semibold hover:bg-purple-500/10 transition-all duration-300 text-center text-sm sm:text-base">
                  <UserPlus className="inline w-4 h-4 mr-2" />
                  Register
                </Link>
              </div>
            </motion.div>
            
            {/* Admin */}
            <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-500" style={{ animationDelay: '0.2s' }}>
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Shield className="text-2xl sm:text-3xl text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Administrator</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8">Full platform control with management tools</p>
              </div>
              
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                  <h4 className="text-blue-400 font-semibold mb-3 text-sm sm:text-base">Admin access includes:</h4>
                  <ol className="space-y-2 text-gray-300 text-xs sm:text-sm">
                    <li>1. User and store management</li>
                    <li>2. System monitoring & reports</li>
                    <li>3. Security and access controls</li>
                    <li>4. Platform configuration settings</li>
                  </ol>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/login" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center text-sm sm:text-base">
                  <Crown className="inline w-4 h-4 mr-2" />
                  Admin Login
                </Link>
                <div className="flex-1 bg-gray-600/20 text-gray-500 py-3 px-4 sm:px-6 rounded-xl font-semibold text-center text-sm sm:text-base cursor-not-allowed">
                  <Shield className="inline w-4 h-4 mr-2" />
                  Invitation Only
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Platform Impact Section */}
      <motion.section 
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-8 sm:p-16">
            <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Platform Impact
              </h2>
              <p className="text-lg sm:text-xl text-gray-300">Real-time statistics showcasing our global impact</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <motion.div variants={itemVariants} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                  <Users className="text-xl sm:text-2xl text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-purple-400 mb-2">50K+</div>
                <p className="text-gray-300 font-semibold text-sm sm:text-base">Active Users</p>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                  <Store className="text-xl sm:text-2xl text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-blue-400 mb-2">2.5K+</div>
                <p className="text-gray-300 font-semibold text-sm sm:text-base">Stores</p>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                  <Star className="text-xl sm:text-2xl text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-green-400 mb-2">15K+</div>
                <p className="text-gray-300 font-semibold text-sm sm:text-base">Reviews</p>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                  <TrendingUp className="text-xl sm:text-2xl text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-yellow-400 mb-2">98%</div>
                <p className="text-gray-300 font-semibold text-sm sm:text-base">Satisfaction</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer Section */}
      <footer className="relative z-10 py-12 px-4 sm:px-6 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Store className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              StoreVault
            </span>
          </div>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Revolutionizing store management with AI-powered solutions. Connecting businesses with their customers like never before.
          </p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a>
          </div>
          <p className="text-gray-500 text-sm mt-6">© 2024 StoreVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
