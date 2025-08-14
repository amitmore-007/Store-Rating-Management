import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useTheme } from '../../context/ThemeContext'
import { 
  Store, 
  Star, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Mail, 
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Eye,
  ArrowLeft,
  User
} from 'lucide-react'

const StoreOwnerDashboard = () => {
  const [stores, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)
  const [storeRatings, setStoreRatings] = useState([])
  const [loading, setLoading] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    fetchMyStores()
  }, [])

  const fetchMyStores = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/store/my-stores')
      setStores(response.data)
    } catch (error) {
      toast.error('Failed to fetch your stores')
    }
    setLoading(false)
  }

  const fetchStoreRatings = async (storeId) => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/store/${storeId}/ratings`)
      setStoreRatings(response.data)
      setSelectedStore(storeId)
    } catch (error) {
      toast.error('Failed to fetch store ratings')
    }
    setLoading(false)
  }

  const StarDisplay = ({ rating, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
            } transition-colors`}
          />
        ))}
      </div>
    )
  }

  const getSelectedStoreData = () => {
    return stores.find(store => store.id === selectedStore)
  }

  const selectedStoreData = getSelectedStoreData()

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-24 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Store Owner Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your stores and view customer feedback
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedStore ? (
            /* Stores Overview */
            <motion.div
              key="stores-overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {stores.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Store className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    No Stores Assigned
                  </h3>
                  <p className="text-lg mb-6 text-gray-400">
                    No stores are currently assigned to your account.
                  </p>
                  <p className="text-gray-500">
                    Please contact your system administrator to assign stores to your account.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Total Stores', 
                        value: stores.length, 
                        icon: Store, 
                        color: 'from-blue-500 to-cyan-500' 
                      },
                      { 
                        title: 'Average Rating', 
                        value: stores.length > 0 
                          ? (stores.reduce((sum, store) => sum + parseFloat(store.average_rating || 0), 0) / stores.length).toFixed(1)
                          : '0.0', 
                        icon: Star, 
                        color: 'from-yellow-500 to-orange-500' 
                      },
                      { 
                        title: 'Total Reviews', 
                        value: stores.reduce((sum, store) => sum + (store.total_ratings || 0), 0), 
                        icon: MessageCircle, 
                        color: 'from-green-500 to-emerald-500' 
                      }
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
                              <p className="text-3xl font-bold text-white">
                                {stat.value}
                              </p>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Stores Grid */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">
                      My Stores
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stores.map((store, index) => (
                        <motion.div
                          key={store.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                          onClick={() => fetchStoreRatings(store.id)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Store className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center space-x-1">
                              <BarChart3 className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-400">
                                Analytics
                              </span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold mb-2 text-white">
                            {store.name}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">
                                {store.email}
                              </span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                              <span className="text-sm text-gray-300">
                                {store.address}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-400">
                                Rating
                              </span>
                              <span className="text-lg font-bold text-white">
                                {parseFloat(store.average_rating || 0).toFixed(1)}/5
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <StarDisplay rating={Math.round(store.average_rating || 0)} />
                              <span className="text-sm text-gray-400">
                                {store.total_ratings || 0} reviews
                              </span>
                            </div>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* Store Details View */
            <motion.div
              key="store-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Back Button & Store Header */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStore(null)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Stores</span>
                </motion.button>
                
                {selectedStoreData && (
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedStoreData.name}
                    </h2>
                    <p className="text-gray-400">
                      Customer Reviews & Ratings
                    </p>
                  </div>
                )}
              </div>

              {/* Ratings List */}
              {storeRatings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-400">
                    This store hasn't received any customer reviews yet.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {storeRatings.map((rating, index) => (
                    <motion.div
                      key={rating.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">
                              {rating.user_name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <StarDisplay rating={rating.rating} size="sm" />
                              <span className="text-sm font-semibold text-white">
                                {rating.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {rating.comment && (
                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                          <div className="flex items-start space-x-2">
                            <MessageCircle className="w-4 h-4 mt-1 text-gray-400" />
                            <p className="text-gray-300">
                              "{rating.comment}"
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-center font-semibold text-white">
                  Loading...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StoreOwnerDashboard
                     