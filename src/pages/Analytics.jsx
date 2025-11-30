import React, { memo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HiUsers,
  HiTrendingUp,
  HiTrendingDown,
  HiChartBar,
  HiLightningBolt,
  HiBookOpen,
  HiClock,
  HiArrowLeft,
  HiRefresh,
  HiBadgeCheck,
  HiStar,
} from 'react-icons/hi';
import { API_BASE_URL, getAuthHeaders } from '../config/api.js';

const AnalyticsComponent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overviewData, setOverviewData] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [gamificationData, setGamificationData] = useState(null);

  // Fetch all analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all analytics in parallel
      const [overviewRes, quizRes, gamificationRes] = await Promise.all([
        fetch(`${API_BASE_URL}/analytics/overview`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/analytics/quizzes`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/analytics/gamification`, { headers: getAuthHeaders() }),
      ]);

      const [overview, quiz, gamification] = await Promise.all([
        overviewRes.json(),
        quizRes.json(),
        gamificationRes.json(),
      ]);

      if (overview.success) setOverviewData(overview.data);
      if (quiz.success) setQuizData(quiz.data);
      if (gamification.success) setGamificationData(gamification.data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleBack = () => {
    window.history.back();
  };

  const handleRefresh = () => {
    fetchAnalytics();
  };

  // Calculate derived metrics
  const statsCards = overviewData ? [
    {
      title: 'Total Users',
      value: overviewData.totalUsers?.toLocaleString() || '0',
      change: overviewData.weeklyGrowth ? `+${overviewData.weeklyGrowth.toFixed(1)}%` : '+0%',
      trend: (overviewData.weeklyGrowth || 0) >= 0 ? 'up' : 'down',
      icon: HiUsers,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Active Users (Today)',
      value: overviewData.activeUsersToday?.toLocaleString() || '0',
      change: overviewData.monthlyGrowth ? `+${overviewData.monthlyGrowth.toFixed(1)}%` : '+0%',
      trend: (overviewData.monthlyGrowth || 0) >= 0 ? 'up' : 'down',
      icon: HiTrendingUp,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Total Quiz Attempts',
      value: overviewData.totalQuizzesTaken?.toLocaleString() || '0',
      change: '+0%',
      trend: 'up',
      icon: HiLightningBolt,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Premium Subscribers',
      value: overviewData.premiumSubscribers?.toLocaleString() || '0',
      change: '+0%',
      trend: 'up',
      icon: HiStar,
      color: 'from-amber-500 to-orange-600',
    },
  ] : [];

  const activityStats = overviewData ? [
    {
      label: 'Daily Active Users',
      value: overviewData.activeUsersToday?.toLocaleString() || '0',
      percentage: overviewData.totalUsers ? (overviewData.activeUsersToday / overviewData.totalUsers) * 100 : 0,
      color: 'bg-blue-500',
    },
    {
      label: 'Weekly Active Users',
      value: overviewData.activeUsersWeek?.toLocaleString() || '0',
      percentage: overviewData.totalUsers ? (overviewData.activeUsersWeek / overviewData.totalUsers) * 100 : 0,
      color: 'bg-green-500',
    },
    {
      label: 'Monthly Active Users',
      value: overviewData.activeUsersMonth?.toLocaleString() || '0',
      percentage: overviewData.totalUsers ? (overviewData.activeUsersMonth / overviewData.totalUsers) * 100 : 0,
      color: 'bg-purple-500',
    },
  ] : [];

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      {/* Mobile Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl text-white font-semibold transition-all shadow-lg text-sm sm:text-base"
      >
        <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Back</span>
      </motion.button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-[10px] sm:text-xs md:text-sm text-white/70 mt-1">Real-time insights and metrics</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRefresh}
          disabled={loading}
          className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <HiRefresh className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base"
        >
          {error}
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main Stats Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-bold ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <HiTrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    ) : (
                      <HiTrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Activity Overview */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-200"
          >
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
              <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              <span>User Activity</span>
            </h3>
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              {activityStats.map((activity, index) => (
                <div key={activity.label}>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700">{activity.label}</span>
                    <span className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-900">{activity.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 md:h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(activity.percentage, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.15 }}
                      className={`h-full rounded-full ${activity.color}`}
                    />
                  </div>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-0.5 sm:mt-1">{activity.percentage.toFixed(1)}% of total users</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-200"
          >
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
              <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
              <span>Performance Metrics</span>
            </h3>
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <HiChartBar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700">Average XP</p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{overviewData?.avgXP || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <HiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700">Active Streak Users</p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{overviewData?.activeStreakUsers?.toLocaleString() || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <HiClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700">Weekly Growth</p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                    {overviewData?.weeklyGrowth ? `${overviewData.weeklyGrowth.toFixed(1)}%` : '0%'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Quiz Analytics */}
      {!loading && quizData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-200"
        >
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
            <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            <span>Quiz Analytics</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Total Quizzes</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{quizData.totalQuizzes || 0}</p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Published Quizzes</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{quizData.publishedQuizzes || 0}</p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Average Score</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{quizData.avgScore ? `${quizData.avgScore.toFixed(1)}%` : '0%'}</p>
            </div>
          </div>
          {quizData.popularQuizzes && quizData.popularQuizzes.length > 0 && (
            <div className="mt-4 sm:mt-5 md:mt-6">
              <h4 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-2 sm:mb-3">Most Popular Quizzes</h4>
              <div className="space-y-2">
                {quizData.popularQuizzes.slice(0, 5).map((quiz, index) => (
                  <div key={quiz.quizId} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900 truncate">{quiz.quizTitle || 'Unknown Quiz'}</p>
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">{quiz.attempts} attempts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-900">{quiz.avgScore?.toFixed(1) || 0}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Gamification Analytics */}
      {!loading && gamificationData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-200"
          >
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
              <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
              <span>Gamification Stats</span>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50">
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700">Average Streak</span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{gamificationData.avgStreak?.toFixed(1) || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50">
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700">Max Streak</span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{gamificationData.maxStreak || 0}</span>
              </div>
              {gamificationData.medalStats && gamificationData.medalStats.length > 0 && (
                <div className="pt-2 sm:pt-3 border-t border-gray-200">
                  <h4 className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-900 mb-2 sm:mb-3">Top Medals</h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    {gamificationData.medalStats.slice(0, 5).map((medal, index) => (
                      <div key={medal._id || index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2">
                          <HiBadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                          <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900 truncate">{medal.name}</span>
                        </div>
                        <span className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-900">{medal.usersUnlocked || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {gamificationData.topUsers && gamificationData.topUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-200"
            >
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                <span>Top Users by XP</span>
              </h3>
              <div className="space-y-2">
                {gamificationData.topUsers.map((user, index) => (
                  <div key={user._id || index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900 truncate">{user.name || user.email || 'Unknown User'}</p>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">Streak: {user.streak || 0}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">{user.xp?.toLocaleString() || 0}</p>
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Content Statistics */}
      {!loading && overviewData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-blue-100"
          >
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <HiLightningBolt className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Simulations</p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{overviewData.totalSimulationsDone || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-white to-emerald-50 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-emerald-100"
          >
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <HiBookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">Quiz Attempts</p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{overviewData.totalQuizzesTaken?.toLocaleString() || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-white to-amber-50 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-amber-100"
          >
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <HiUsers className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">Monthly Growth</p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  {overviewData.monthlyGrowth ? `${overviewData.monthlyGrowth.toFixed(1)}%` : '0%'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default memo(AnalyticsComponent);
