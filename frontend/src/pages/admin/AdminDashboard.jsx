import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useTheme } from '../../context/ThemeContext'
import { 
  BarChart3, 
  Users, 
  Store, 
  UserPlus, 
  Building2, 
  Star, 
  TrendingUp, 
  Mail, 
  MapPin, 
  Shield, 
  User,
  Calendar,
  Activity,
  CheckCircle,
  Sparkles,
  Crown
} from 'lucide-react'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [successType, setSuccessType] = useState('')
  const { isDarkMode } = useTheme()

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'normal_user'
  })
  const [storeForm, setStoreForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerEmail: ''
  })

  const [activityData, setActivityData] = useState({
    dailyStats: [],
    monthlyGrowth: {},
    recentActivity: []
  })
  const [activityTab, setActivityTab] = useState('overview')

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats()
    } else if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'stores') {
      fetchStores()
    }
  }, [activeTab])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard')
      setStats(response.data)
      await fetchActivityData()
    } catch (error) {
      toast.error('Failed to fetch dashboard stats')
    }
  }

  const fetchActivityData = async () => {
    try {
      const response = await axios.get('/api/admin/activity')
      const data = response.data

      // Process daily stats for chart
      const dailyStats = data.dailyStats.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: parseInt(day.users) || 0,
        stores: parseInt(day.stores) || 0,
        ratings: parseInt(day.ratings) || 0,
        total: (parseInt(day.users) || 0) + (parseInt(day.stores) || 0) + (parseInt(day.ratings) || 0)
      }))

      // Process monthly growth
      const monthlyGrowth = {
        users: { 
          current: data.monthlyGrowth.current_users || 0, 
          growth: data.monthlyGrowth.user_growth || 0 
        },
        stores: { 
          current: data.monthlyGrowth.current_stores || 0, 
          growth: data.monthlyGrowth.store_growth || 0 
        },
        ratings: { 
          current: data.monthlyGrowth.current_ratings || 0, 
          growth: data.monthlyGrowth.rating_growth || 0 
        }
      }

      // Process recent activity
      const recentActivity = data.recentActivity.map(activity => ({
        ...activity,
        icon: activity.type
      }))

      // Process platform health
      const platformHealth = {
        userEngagement: Math.round(data.platformHealth.user_engagement || 0),
        storeActivity: Math.round(data.platformHealth.store_activity || 0),
        ratingSatisfaction: Math.round(data.platformHealth.rating_satisfaction || 0),
        systemPerformance: Math.round(data.platformHealth.system_performance || 85)
      }

      setActivityData({
        dailyStats,
        monthlyGrowth,
        recentActivity,
        topStores: data.topStores || [],
        ratingDistribution: data.ratingDistribution || [],
        platformHealth
      })

    } catch (error) {
      console.error('Failed to fetch activity data:', error)
      // Fallback to empty data
      setActivityData({
        dailyStats: [],
        monthlyGrowth: { users: { current: 0, growth: 0 }, stores: { current: 0, growth: 0 } },
        recentActivity: [],
        topStores: [],
        ratingDistribution: [],
        platformHealth: { userEngagement: 0, storeActivity: 0, ratingSatisfaction: 0, systemPerformance: 85 }
      })
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users')
      setUsers(response.data)
    } catch (error) {
      toast.error('Failed to fetch users')
    }
  }

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/admin/stores')
      setStores(response.data)
    } catch (error) {
      toast.error('Failed to fetch stores')
    }
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/admin/users', userForm)
      setSuccessMessage(`User "${userForm.name}" has been successfully created! They can now access the platform with their credentials.`)
      setSuccessType('user')
      setShowSuccessModal(true)
      setUserForm({ name: '', email: '', password: '', address: '', role: 'normal_user' })
      if (activeTab === 'users') fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user')
    }
    setLoading(false)
  }

  const handleStoreSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/admin/stores', storeForm)
      setSuccessMessage(`Store "${storeForm.name}" has been successfully created! It's now available for customers to rate and review.`)
      setSuccessType('store')
      setShowSuccessModal(true)
      setStoreForm({ name: '', email: '', address: '', ownerEmail: '' })
      if (activeTab === 'stores') fetchStores()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create store')
    }
    setLoading(false)
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'stores', label: 'Stores', icon: Store },
    { id: 'add-user', label: 'Add User', icon: UserPlus },
    { id: 'add-store', label: 'Add Store', icon: Building2 }
  ]

  const roleColors = {
    system_admin: 'from-red-500 to-pink-500',
    store_owner: 'from-blue-500 to-indigo-500',
    normal_user: 'from-green-500 to-emerald-500'
  }

  const roleIcons = {
    system_admin: Shield,
    store_owner: Store,
    normal_user: User
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-24 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-purple-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
            System Administrator
          </h1>
          <p className="text-gray-300 text-lg">
            Manage users, stores, and system overview
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
                  { title: 'Total Stores', value: stats.totalStores || 0, icon: Store, color: 'from-purple-500 to-pink-500' },
                  { title: 'Total Ratings', value: stats.totalRatings || 0, icon: Star, color: 'from-orange-500 to-red-500' }
                ].map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">
                            {stat.title}
                          </p>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="text-3xl font-bold text-white"
                          >
                            {stat.value}
                          </motion.p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Activity Chart Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Activity Chart */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">
                        System Activity
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      {['overview', 'growth'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActivityTab(tab)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                            activityTab === tab
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activityTab === 'overview' ? (
                    /* Daily Activity Chart */
                    <div className="space-y-4">
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-gray-300">Users</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-gray-300">Stores</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-gray-300">Ratings</span>
                        </div>
                      </div>
                      
                      <div className="h-64 bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="h-full flex items-end justify-between space-x-2">
                          {activityData.dailyStats.map((day, index) => {
                            const maxValue = Math.max(
                              ...activityData.dailyStats.map(d => Math.max(d.users, d.stores, d.total/2)),
                              5 // Minimum scale
                            )
                            
                            const userHeight = Math.max((day.users / maxValue) * 100, 2)
                            const storeHeight = Math.max((day.stores / maxValue) * 100, 2)
                            const ratingHeight = Math.max(((day.total - day.users - day.stores) / maxValue) * 100, 2)
                            
                            return (
                              <div
                                key={day.date}
                                className="flex-1 flex flex-col items-center space-y-2 group"
                              >
                                {/* Chart Bars */}
                                <div className="w-full flex justify-center space-x-1 items-end h-48">
                                  {/* Users Bar */}
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${userHeight}%` }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md min-h-[4px] relative group/bar"
                                    style={{ height: `${userHeight}%` }}
                                  >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                      Users: {day.users}
                                    </div>
                                  </motion.div>
                                  
                                  {/* Stores Bar */}
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${storeHeight}%` }}
                                    transition={{ delay: index * 0.1 + 0.1, duration: 0.6 }}
                                    className="w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md min-h-[4px] relative group/bar"
                                    style={{ height: `${storeHeight}%` }}
                                  >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                      Stores: {day.stores}
                                    </div>
                                  </motion.div>
                                  
                                  {/* Ratings Bar */}
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${ratingHeight}%` }}
                                    transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                                    className="w-6 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-md min-h-[4px] relative group/bar"
                                    style={{ height: `${ratingHeight}%` }}
                                  >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                      Ratings: {day.ratings}
                                    </div>
                                  </motion.div>
                                </div>
                                
                                {/* Date Label */}
                                <div className="text-xs text-gray-400 text-center">
                                  {day.date}
                                </div>
                                
                                {/* Hover Card */}
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileHover={{ opacity: 1, scale: 1 }}
                                  className="absolute bottom-full mb-2 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                                >
                                  <div className="text-xs text-white space-y-1">
                                    <p className="font-semibold">{day.date}</p>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                      <span>Users: {day.users}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                      <span>Stores: {day.stores}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                      <span>Ratings: {Math.max(day.total - day.users - day.stores, 0)}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                            )
                          })}
                        </div>
                        
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs text-gray-400 -ml-8">
                          <span>High</span>
                          <span>Med</span>
                          <span>Low</span>
                          <span>0</span>
                        </div>
                      </div>
                      
                      <div className="text-center text-sm text-gray-400">
                        Daily activity over the last 7 days (Real Data)
                      </div>
                    </div>
                  ) : (
                    /* Growth Metrics */
                    <div className="space-y-6">
                      {/* Monthly Growth Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">Users This Month</p>
                              <p className="text-2xl font-bold text-white">
                                {activityData.monthlyGrowth.users?.current || 0}
                              </p>
                            </div>
                            <div className={`flex items-center space-x-1 ${
                              parseFloat(activityData.monthlyGrowth.users?.growth || 0) >= 0 
                                ? 'text-green-400' : 'text-red-400'
                            }`}>
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-sm font-semibold">
                                {activityData.monthlyGrowth.users?.growth || 0}%
                              </span>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">Stores This Month</p>
                              <p className="text-2xl font-bold text-white">
                                {activityData.monthlyGrowth.stores?.current || 0}
                              </p>
                            </div>
                            <div className={`flex items-center space-x-1 ${
                              parseFloat(activityData.monthlyGrowth.stores?.growth || 0) >= 0 
                                ? 'text-green-400' : 'text-red-400'
                            }`}>
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-sm font-semibold">
                                {activityData.monthlyGrowth.stores?.growth || 0}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Performance Chart */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Platform Performance</h4>
                        <div className="h-40 bg-white/5 rounded-2xl p-4 border border-white/10">
                          <div className="h-full flex items-end justify-between">
                            {[
                              { name: 'User\nRegistrations', value: 85, color: 'from-blue-500 to-blue-400' },
                              { name: 'Store\nCreations', value: 65, color: 'from-purple-500 to-purple-400' },
                              { name: 'Rating\nActivity', value: 92, color: 'from-yellow-500 to-yellow-400' },
                              { name: 'Platform\nEngagement', value: 78, color: 'from-green-500 to-green-400' }
                            ].map((metric, index) => (
                              <motion.div
                                key={metric.name}
                                initial={{ height: 0 }}
                                animate={{ height: `${metric.value}%` }}
                                transition={{ delay: index * 0.2, duration: 0.8 }}
                                className="flex flex-col items-center space-y-2 group"
                              >
                                <motion.div
                                  className={`w-12 bg-gradient-to-t ${metric.color} rounded-t-lg min-h-[8px] relative`}
                                  style={{ height: `${metric.value}%` }}
                                >
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {metric.value}%
                                  </div>
                                </motion.div>
                                <div className="text-xs text-gray-400 text-center whitespace-pre-line">
                                  {metric.name}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* System Health Metrics with Real Data */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-300">System Health Indicators</h4>
                        <div className="space-y-3">
                        {[
                          {
                            label: 'User Engagement', 
                            value: activityData.platformHealth?.userEngagement || 0, 
                            color: 'from-green-500 to-emerald-500' 
                          },
                          { 
                            label: 'Store Activity', 
                            value: activityData.platformHealth?.storeActivity || 0, 
                            color: 'from-blue-500 to-cyan-500' 
                          },
                          { 
                            label: 'Rating Satisfaction', 
                            value: activityData.platformHealth?.ratingSatisfaction || 0, 
                            color: 'from-purple-500 to-pink-500' 
                          },
                          { 
                            label: 'System Performance', 
                            value: activityData.platformHealth?.systemPerformance || 85, 
                            color: 'from-yellow-500 to-orange-500' 
                          }
                        ].map((health, index) => (
                          <div key={health.label} className="flex items-center justify-between">
                            <span className="text-sm text-gray-400 w-32">{health.label}</span>
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(health.value, 100)}%` }}
                                  transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                                  className={`h-full bg-gradient-to-r ${health.color} rounded-full relative`}
                                >
                                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                                </motion.div>
                              </div>
                              <span className="text-sm font-semibold text-white w-12 text-right">
                                {health.value}%
                              </span>
                            </div>
                          </div>
                        ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Activity Feed */}
                <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <Activity className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold text-white">
                      Recent Activity
                    </h3>
                  </div>

                  <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                    {activityData.recentActivity.length > 0 ? (
                      activityData.recentActivity.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'user' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : activity.type === 'store'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          }`}>
                            {activity.type === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : activity.type === 'store' ? (
                              <Store className="w-4 h-4 text-white" />
                            ) : (
                              <Star className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {activity.subtitle}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.time).toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">
                  All Users
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-4 font-semibold text-gray-300">User</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Role</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Address</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => {
                      const RoleIcon = roleIcons[user.role] || User
                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                                roleColors[user.role] || 'from-gray-500 to-gray-600'
                              } flex items-center justify-center`}>
                                <RoleIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-white">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                              roleColors[user.role] || 'from-gray-500 to-gray-600'
                            } text-white`}>
                              {user.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300">
                            {user.address || 'N/A'}
                          </td>
                          <td className="p-4 text-gray-300">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'stores' && (
            <motion.div
              key="stores"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Store className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">
                  All Stores
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-4 font-semibold text-gray-300">Store</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Address</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Rating</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Reviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map((store, index) => (
                      <motion.tr
                        key={store.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <Store className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {store.name}
                              </p>
                              <p className="text-sm text-gray-400">
                                {store.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">
                          {store.address || 'N/A'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-semibold text-white">
                              {parseFloat(store.average_rating || 0).toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">
                          {store.total_ratings || 0}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {stores.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No stores found. Create your first store!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'add-user' && (
            <motion.div
              key="add-user"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl max-w-2xl mx-auto"
            >
              <div className="flex items-center space-x-3 mb-8">
                <UserPlus className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-bold text-white">
                  Add New User
                </h3>
              </div>

              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleUserSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold mb-3 text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    required
                    minLength="6"
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all duration-300"
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold mb-3 text-gray-300">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
                    <textarea
                      value={userForm.address}
                      onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                      rows="3"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all duration-300 resize-none"
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold mb-3 text-gray-300">
                    Role
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all duration-300"
                  >
                    <option value="normal_user" className="bg-gray-800">Normal User</option>
                    <option value="store_owner" className="bg-gray-800">Store Owner</option>
                    <option value="system_admin" className="bg-gray-800">System Admin</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Creating User...' : 'Create User'}
                </motion.button>
              </motion.form>
            </motion.div>
          )}

          {activeTab === 'add-store' && (
            <motion.div
              key="add-store"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl max-w-2xl mx-auto"
            >
              <div className="flex items-center space-x-3 mb-8">
                <Building2 className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">
                  Add New Store
                </h3>
              </div>

              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleStoreSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Store Name
                    </label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={storeForm.name}
                        onChange={(e) => setStoreForm({...storeForm, name: e.target.value})}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Enter store name"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Store Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={storeForm.email}
                        onChange={(e) => setStoreForm({...storeForm, email: e.target.value})}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Enter store email"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold mb-3 text-gray-300">
                    Store Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
                    <textarea
                      value={storeForm.address}
                      onChange={(e) => setStoreForm({...storeForm, address: e.target.value})}
                      rows="3"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 resize-none"
                      placeholder="Enter store address"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold mb-3 text-gray-300">
                    Owner Email (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={storeForm.ownerEmail}
                      onChange={(e) => setStoreForm({...storeForm, ownerEmail: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                      placeholder="Email of store owner user"
                    />
                  </div>
                  <p className="text-xs mt-2 text-gray-500">
                    Leave empty if no specific owner, or enter email of existing store owner user
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Creating Store...' : 'Create Store'}
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSuccessModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    successType === 'user' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                >
                  {successType === 'user' ? (
                    <UserPlus className="w-10 h-10 text-white" />
                  ) : (
                    <Building2 className="w-10 h-10 text-white" />
                  )}
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-2xl font-black mb-3 bg-gradient-to-r ${
                    successType === 'user' 
                      ? 'from-green-400 to-emerald-400' 
                      : 'from-blue-400 to-purple-400'
                  } bg-clip-text text-transparent`}
                >
                  {successType === 'user' ? 'User Created!' : 'Store Created!'}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 mb-6"
                >
                  {successMessage}
                </motion.p>
                
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSuccessModal(false)}
                  className={`px-8 py-3 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto ${
                    successType === 'user' 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600'
                  }`}
                >
                  {successType === 'user' ? (
                    <Crown className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Awesome!</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AdminDashboard
