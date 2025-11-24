import React, { memo, useMemo } from 'react';
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
} from 'react-icons/hi';

const AnalyticsComponent = () => {
  // Mock analytics data - replace with actual API call
  const analytics = useMemo(
    () => ({
      totalUsers: 1247,
      newUsersThisMonth: 89,
      activeUsers: 892,
      totalSimulations: 12,
      totalResources: 48,
      totalCompletions: 4923,
      averageCompletionRate: 78.5,
      engagementRate: 65.2,
      dailyActiveUsers: 456,
      weeklyActiveUsers: 1234,
      monthlyActiveUsers: 1890,
      userGrowth: 12.5,
      completionGrowth: 8.3,
      resourceDownloads: 15234,
      averageSessionTime: 24.5,
    }),
    [],
  );

  const statsCards = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      change: `+${analytics.userGrowth}%`,
      trend: 'up',
      icon: HiUsers,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Active Users',
      value: analytics.activeUsers.toLocaleString(),
      change: `+${analytics.engagementRate}%`,
      trend: 'up',
      icon: HiTrendingUp,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Total Completions',
      value: analytics.totalCompletions.toLocaleString(),
      change: `+${analytics.completionGrowth}%`,
      trend: 'up',
      icon: HiLightningBolt,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Resource Downloads',
      value: analytics.resourceDownloads.toLocaleString(),
      change: '+15.2%',
      trend: 'up',
      icon: HiBookOpen,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const activityStats = [
    {
      label: 'Daily Active Users',
      value: analytics.dailyActiveUsers.toLocaleString(),
      percentage: 36.6,
      color: 'bg-blue-500',
    },
    {
      label: 'Weekly Active Users',
      value: analytics.weeklyActiveUsers.toLocaleString(),
      percentage: 99.0,
      color: 'bg-green-500',
    },
    {
      label: 'Monthly Active Users',
      value: analytics.monthlyActiveUsers.toLocaleString(),
      percentage: 100,
      color: 'bg-purple-500',
    },
  ];

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Mobile Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold transition-all shadow-lg"
      >
        <HiArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </motion.button>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs sm:text-sm font-bold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <HiTrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <HiTrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-200"
        >
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            User Activity
          </h3>
          <div className="space-y-4 sm:space-y-5">
            {activityStats.map((activity, index) => (
              <div key={activity.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">{activity.label}</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{activity.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activity.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.15 }}
                    className={`h-full rounded-full ${activity.color}`}
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{activity.percentage}% of total users</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-200"
        >
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
            Performance Metrics
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <HiChartBar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-700">Avg Completion Rate</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{analytics.averageCompletionRate}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <HiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-700">Engagement Rate</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{analytics.engagementRate}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <HiClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-700">Avg Session Time</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{analytics.averageSessionTime} min</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-blue-100"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <HiLightningBolt className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Simulations</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{analytics.totalSimulations}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white to-emerald-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-emerald-100"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <HiBookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Resources</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{analytics.totalResources}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-white to-amber-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-amber-100"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <HiUsers className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">New Users (Month)</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{analytics.newUsersThisMonth}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(AnalyticsComponent);
