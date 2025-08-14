import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { API_ENDPOINTS, apiCall } from '../../utils/api'
import { useTheme } from '../../context/ThemeContext'
import { 
  Store, 
  Star, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Mail, 
  TrendingUp,
  Heart,
  Award,
  X,
  CheckCircle,
  Sparkles
} from 'lucide-react'

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('stores')
  const [stores, setStores] = useState([])
  const [myRatings, setMyRatings] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    if (activeTab === 'stores') {
      fetchStores()
    } else if (activeTab === 'my-ratings') {
      fetchMyRatings()
    }
  }, [activeTab])

  const fetchStores = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.USER_STORES)
      setStores(response)
    } catch (error) {
      toast.error('Failed to fetch stores')
    }
  }

  const fetchMyRatings = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.USER_MY_RATINGS)
      setMyRatings(response)
    } catch (error) {
      toast.error('Failed to fetch your ratings')
    }
  }

  const handleRateStore = (store) => {
    setSelectedStore(store)
    setRating(store.user_rating || 0)
    setComment('')
  }

  const submitRating = async () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setLoading(true)
    try {
      await apiCall(API_ENDPOINTS.USER_RATINGS, {
        method: 'POST',
        body: JSON.stringify({
          storeId: selectedStore.id,
          rating,
          comment
        })
      })
      setShowSuccessModal(true)
      setSelectedStore(null)
      setRating(0)
      setComment('')
      fetchStores()
      if (activeTab === 'my-ratings') fetchMyRatings()
    } catch (error) {
      toast.error(error.message || 'Failed to submit rating')
    }
    setLoading(false)
  }

  const StarRating = ({ value, onChange, readonly = false, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    }

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <motion.button
            key={star}
            type="button"
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            className={`${sizeClasses[size]} transition-all duration-200 ${
              star <= value 
                ? 'text-yellow-400' 
                : 'text-gray-600'
            } ${!readonly ? 'hover:text-yellow-300 cursor-pointer' : 'cursor-default'}`}
            onClick={() => !readonly && onChange && onChange(star)}
            disabled={readonly}
          >
            <Star className="w-full h-full fill-current" />
          </motion.button>
        ))}
      </div>
    )
  }

  const tabs = [
    { id: 'stores', label: 'Rate Stores', icon: Store },
    { id: 'my-ratings', label: 'My Ratings', icon: Award }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-24 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
          <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            User Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Discover and rate amazing stores
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg inline-flex"
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'stores' && (
            <motion.div
              key="stores"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {stores.map((store, index) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    {store.user_rating && (
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        <span className="text-sm font-medium text-gray-400">
                          Rated
                        </span>
                      </div>
                    )}
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

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-400">
                        Average Rating
                      </p>
                      <div className="flex items-center space-x-2">
                        <StarRating value={Math.round(store.average_rating)} readonly size="sm" />
                        <span className="text-sm font-semibold text-white">
                          ({store.total_ratings} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {store.user_rating && (
                    <div className="p-3 rounded-2xl mb-4 bg-white/10 backdrop-blur-md border border-white/10">
                      <p className="text-sm font-medium mb-1 text-gray-400">
                        Your Rating
                      </p>
                      <div className="flex items-center space-x-2">
                        <StarRating value={store.user_rating} readonly size="sm" />
                        <span className="text-sm font-semibold text-white">
                          {store.user_rating}/5
                        </span>
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRateStore(store)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {store.user_rating ? 'Update Rating' : 'Rate Store'}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'my-ratings' && (
            <motion.div
              key="my-ratings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {myRatings.map((ratingItem, index) => (
                <motion.div
                  key={ratingItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {ratingItem.store_name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {new Date(ratingItem.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <StarRating value={ratingItem.rating} readonly />
                    <p className="text-lg font-semibold mt-2 text-white">
                      {ratingItem.rating}/5 Stars
                    </p>
                  </div>

                  {ratingItem.comment && (
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-4">
                      <div className="flex items-start space-x-2">
                        <MessageCircle className="w-4 h-4 mt-1 text-gray-400" />
                        <p className="text-gray-300">
                          {ratingItem.comment}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {myRatings.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-16 text-gray-400"
                >
                  <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-semibold mb-2">No ratings yet</p>
                  <p>Start rating stores to see your reviews here!</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rating Modal */}
        <AnimatePresence>
          {selectedStore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedStore(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Rate {selectedStore.name}
                  </h3>
                  <button
                    onClick={() => setSelectedStore(null)}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      Your Rating
                    </label>
                    <div className="flex justify-center">
                      <StarRating value={rating} onChange={setRating} size="lg" />
                    </div>
                    {rating > 0 && (
                      <p className="text-center mt-2 font-semibold text-white">
                        {rating} out of 5 stars
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">
                      Comment (Optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 resize-none"
                      placeholder="Share your experience with this store..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={submitRating}
                      disabled={loading || rating === 0}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? 'Submitting...' : 'Submit Rating'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStore(null)}
                      className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
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
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-black mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                >
                  Rating Submitted!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 mb-6"
                >
                  Thank you for sharing your feedback! Your rating helps other users make better decisions.
                </motion.p>
                
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSuccessModal(false)}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4" />
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

export default UserDashboard
