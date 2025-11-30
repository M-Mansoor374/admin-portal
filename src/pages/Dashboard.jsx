import React, { memo, useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  HiUsers,
  HiBookOpen,
  HiLightningBolt,
  HiChartBar,
  HiSpeakerphone,
  HiCog,
  HiLogout,
  HiBell,
  HiMenu,
  HiX,
  HiHome,
  HiCheckCircle,
  HiExclamation,
  HiInformationCircle,
  HiXCircle,
  HiOutlineUserAdd,
  HiAcademicCap,
  HiBadgeCheck,
  HiFire,
  HiSparkles,
} from 'react-icons/hi';
import Users from './Users';
import Resources from './Resources';
import Simulations from './Simulations';
import Analytics from './Analytics';
import Announcements from './Announcements';
import Quizzes from './Quizzes';
import Medals from './Medals';
import Settings from './Settings';

const adminNavItems = [
  { id: 'overview', label: 'Overview', icon: HiHome, component: null },
  { id: 'users', label: 'User Management', icon: HiUsers, component: Users },
  { id: 'quizzes', label: 'Quiz Management', icon: HiAcademicCap, component: Quizzes },
  { id: 'simulations', label: 'Simulation Management', icon: HiLightningBolt, component: Simulations },
  { id: 'resources', label: 'Resource Management', icon: HiBookOpen, component: Resources },
  { id: 'medals', label: 'Medals & Rewards', icon: HiBadgeCheck, component: Medals },
  { id: 'analytics', label: 'Analytics', icon: HiChartBar, component: Analytics },
  { id: 'announcements', label: 'Announcements', icon: HiSpeakerphone, component: Announcements },
  { id: 'settings', label: 'Settings', icon: HiCog, component: Settings },
];

const guestNavLinks = [
  { id: 'home', label: 'Home', path: '/', hash: null },
  { id: 'features', label: 'Features / Explore', path: '/', hash: '#features' },
  { id: 'resources', label: 'Resources', path: '/resources', hash: null },
  { id: 'about', label: 'About', path: '/', hash: '#about' },
  { id: 'support', label: 'Contact / Support', path: '/', hash: '#support' },
];

const AdminDashboardComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeModule, setActiveModule] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  
  // Mock notifications - replace with actual API call
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New User Registration',
      message: '5 new users registered in the last hour',
      type: 'info',
      read: false,
      timestamp: '2 minutes ago',
      action: 'users',
    },
    {
      id: 2,
      title: 'System Alert',
      message: 'High server load detected. Consider scaling resources.',
      type: 'warning',
      read: false,
      timestamp: '15 minutes ago',
      action: 'analytics',
    },
    {
      id: 3,
      title: 'Resource Update',
      message: 'New resource "College Application Guide" has been added',
      type: 'success',
      read: false,
      timestamp: '1 hour ago',
      action: 'resources',
    },
    {
      id: 4,
      title: 'User Report',
      message: 'A user has reported an issue with quiz functionality',
      type: 'error',
      read: true,
      timestamp: '3 hours ago',
      action: 'users',
    },
    {
      id: 5,
      title: 'Weekly Analytics',
      message: 'Weekly analytics report is ready for review',
      type: 'info',
      read: true,
      timestamp: '1 day ago',
      action: 'analytics',
    },
  ]);

  // Check if user is admin - redirect if not
  useEffect(() => {
    const userRole = sessionStorage.getItem('acceptopia-admin-role');
    const isAuthenticated = sessionStorage.getItem('acceptopia-admin-authenticated') === 'true';
    
    if (!isAuthenticated || userRole !== 'admin') {
      navigate('/admin-login', { replace: true });
    }
  }, [navigate]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Mock admin data - replace with actual auth context
  const adminName = useMemo(() => {
    const role = sessionStorage.getItem('acceptopia-admin-role');
    return role === 'admin' ? 'Admin User' : 'User';
  }, []);

  const activeComponent = useMemo(() => {
    const item = adminNavItems.find((item) => item.id === activeModule);
    return item?.component || null;
  }, [activeModule]);

  const handleLogout = () => {
    sessionStorage.removeItem('acceptopia-admin-authenticated');
    sessionStorage.removeItem('acceptopia-admin-role');
    navigate('/admin-login', { replace: true });
  };

  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);
    setIsMobileMenuOpen(false);
    setIsNotificationOpen(false);
  };

  const handleGuestLinkClick = (link) => {
    setIsMobileMenuOpen(false);
    
    // If link has a hash (like #features), handle navigation and scrolling
    if (link.hash) {
      if (location.pathname !== '/') {
        // Navigate to homepage first, then scroll after navigation
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(link.hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        // Already on homepage, just scroll
        const element = document.querySelector(link.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const handleMarkAsRead = (notificationId) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      ),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification.id);
    setIsNotificationOpen(false);
    if (notification.action) {
      handleModuleChange(notification.action);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <HiExclamation className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <HiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <HiInformationCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Overview stats - replace with actual data from MongoDB aggregations
  const overviewStats = useMemo(
    () => ({
      totalUsers: 1247,
      activeUsersToday: 892,
      totalQuizzesTaken: 15432,
      totalSimulationsDone: 8521,
      totalResources: 48,
      activeStreakUsers: 567,
      premiumSubscribers: 234,
      avgXP: 1850,
      weeklyGrowth: 12.5, // percentage
      monthlyGrowth: 18.3, // percentage
      totalQuizzes: 12,
      totalSimulations: 12,
      totalMedals: 24,
    }),
    [],
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-500/30 via-cyan-500/25 to-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 left-1/2 w-[500px] h-[500px] -translate-x-1/2 bg-gradient-to-br from-purple-500/25 via-fuchsia-500/20 to-rose-500/25 rounded-full blur-3xl"
        />
      </div>

      {/* Sidebar - Desktop Only */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? '280px' : '80px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl z-40"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50"
              >
                <HiChartBar className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                Admin Panel
              </span>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20"
            aria-label="Toggle sidebar"
          >
            <HiMenu className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {adminNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleModuleChange(item.id)}
                whileHover={{ scale: 1.05, x: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 border border-white/30'
                    : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-semibold">{item.label}</span>}
              </motion.button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20">
          <motion.button
            whileHover={{ scale: 1.05, x: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 hover:from-red-500/30 hover:to-rose-500/30 border border-red-500/30 hover:border-red-500/50 backdrop-blur-sm transition-all duration-200"
          >
            <HiLogout className="w-5 h-5" />
            {isSidebarOpen && <span className="font-semibold">Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[80px]'} pb-16 lg:pb-0`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-slate-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-xl border-b border-white/20 shadow-2xl">
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-8 py-3 sm:py-4 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white shadow-lg transition-all"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <HiX className="w-5 h-5 sm:w-6 sm:h-6" /> : <HiMenu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </motion.button>
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent truncate"
              >
                {adminNavItems.find((item) => item.id === activeModule)?.label || 'Admin Dashboard'}
              </motion.h1>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
              {/* Notification Button - Hidden on mobile, shown in hamburger */}
              <div className="relative hidden sm:block" ref={notificationRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 transition-all shadow-lg"
                  aria-label="Notifications"
                >
                  <HiBell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1 shadow-lg border-2 border-slate-900"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-16 sm:top-14 sm:mt-2 w-auto sm:w-96 max-w-[calc(100vw-1rem)] bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 z-[9999] max-h-[calc(100vh-5rem)] sm:max-h-[85vh] overflow-hidden flex flex-col"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <HiBell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                              <p className="text-[10px] sm:text-xs text-gray-600">{unreadCount} unread</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {unreadCount > 0 && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleMarkAllAsRead}
                              className="text-[10px] sm:text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                            >
                              Mark all
                            </motion.button>
                          )}
                          <button
                            onClick={() => setIsNotificationOpen(false)}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
                            aria-label="Close notifications"
                          >
                            <HiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="overflow-y-auto flex-1 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {notifications.length === 0 ? (
                          <div className="p-6 sm:p-8 text-center text-gray-500">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                              <HiBell className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                            </div>
                            <p className="text-sm sm:text-base font-medium text-gray-700">No notifications</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">You're all caught up!</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {notifications.map((notification, index) => (
                              <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-3 sm:p-4 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 border-l-4 ${
                                  notification.read
                                    ? 'bg-white border-transparent opacity-75'
                                    : `${getNotificationColor(notification.type)}`
                                }`}
                              >
                                <div className="flex items-start gap-2.5 sm:gap-3">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <h4
                                        className={`text-xs sm:text-sm font-semibold leading-tight ${
                                          notification.read ? 'text-gray-600' : 'text-gray-900'
                                        }`}
                                      >
                                        {notification.title}
                                      </h4>
                                      {!notification.read && (
                                        <motion.span
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"
                                        />
                                      )}
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
                                        {notification.timestamp}
                                      </p>
                                      {!notification.read && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                                          NEW
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setIsNotificationOpen(false);
                              handleModuleChange('announcements');
                            }}
                            className="w-full text-center text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-2.5 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                          >
                            View All Announcements
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-semibold text-white truncate max-w-[100px] sm:max-w-none">{adminName}</p>
                  <p className="text-[10px] sm:text-xs text-white/60">Administrator</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/50 border-2 border-white/30 flex-shrink-0"
                  aria-label="Profile"
                >
                  {adminName.charAt(0).toUpperCase()}
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] lg:hidden"
            >
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-900 backdrop-blur-xl shadow-2xl border-r border-white/20 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/5 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">{adminName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{adminName}</p>
                      <p className="text-[10px] text-white/60">Administrator</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <div className="p-4 space-y-2">
                    {/* Notification Button */}
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      onClick={() => {
                        setIsNotificationOpen(!isNotificationOpen);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 border border-blue-400/30 text-white font-semibold transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <HiBell className="w-5 h-5" />
                        <span>Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="min-w-[24px] h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold px-2 shadow-lg">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </motion.button>

                    {/* Admin Modules */}
                    {adminNavItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = activeModule === item.id;
                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * (index + 2) }}
                          onClick={() => handleModuleChange(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50 border border-blue-400'
                              : 'bg-white/5 hover:bg-white/15 border border-white/20 text-white/90 hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer - Logout */}
                <div className="p-4 border-t border-white/20 bg-slate-800/50 flex-shrink-0">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3.5 text-white font-bold shadow-lg shadow-red-500/50 transition-all hover:shadow-xl"
                  >
                    <HiLogout className="w-5 h-5" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6">
          <AnimatePresence mode="wait">
            {activeModule === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 sm:space-y-5 md:space-y-6"
              >
                {/* Primary Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
                  {[
                    { label: 'Total Users', value: overviewStats.totalUsers.toLocaleString(), icon: HiUsers, gradient: 'from-blue-500 via-indigo-500 to-purple-500', textGradient: 'from-blue-300 to-indigo-300', bgHover: 'from-blue-500/20 to-indigo-600/20' },
                    { label: 'Active Today', value: overviewStats.activeUsersToday.toLocaleString(), icon: HiCheckCircle, gradient: 'from-emerald-500 via-teal-500 to-cyan-500', textGradient: 'from-emerald-300 to-teal-300', bgHover: 'from-emerald-500/20 to-teal-600/20' },
                    { label: 'Quizzes Taken', value: overviewStats.totalQuizzesTaken.toLocaleString(), icon: HiAcademicCap, gradient: 'from-purple-500 via-pink-500 to-rose-500', textGradient: 'from-purple-300 to-pink-300', bgHover: 'from-purple-500/20 to-pink-600/20' },
                    { label: 'Simulations Done', value: overviewStats.totalSimulationsDone.toLocaleString(), icon: HiLightningBolt, gradient: 'from-amber-500 via-orange-500 to-red-500', textGradient: 'from-amber-300 to-orange-300', bgHover: 'from-amber-500/20 to-orange-600/20' },
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index + 1) }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 border border-white/20 overflow-hidden group cursor-pointer"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgHover} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <div className="relative z-10">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-purple-500/50 mb-2 sm:mb-3`}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                          </motion.div>
                          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/70 mb-1 sm:mb-1.5">{stat.label}</p>
                          <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.textGradient} bg-clip-text text-transparent leading-tight`}>
                            {stat.value}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
                  {[
                    { label: 'Active Streaks', value: overviewStats.activeStreakUsers.toLocaleString(), icon: HiFire, gradient: 'from-orange-500 to-red-500', sublabel: 'users with streak' },
                    { label: 'Premium Members', value: overviewStats.premiumSubscribers.toLocaleString(), icon: HiBadgeCheck, gradient: 'from-yellow-500 to-amber-500', sublabel: 'active subscribers' },
                    { label: 'Avg XP Per User', value: overviewStats.avgXP.toLocaleString(), icon: HiSparkles, gradient: 'from-indigo-500 to-purple-500', sublabel: 'average points' },
                    { label: 'Total Resources', value: overviewStats.totalResources, icon: HiBookOpen, gradient: 'from-cyan-500 to-blue-500', sublabel: 'articles & tools' },
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.08 }}
                        whileHover={{ scale: 1.03 }}
                        className="relative bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 overflow-hidden group"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-white/60 mb-0.5 truncate">{stat.label}</p>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">{stat.value}</p>
                            <p className="text-[10px] sm:text-xs text-white/40 truncate">{stat.sublabel}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Growth Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
                >
                  <div className="relative bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-green-500/20 overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-white">Weekly Growth</h3>
                      <div className="px-2 sm:px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                        <span className="text-xs sm:text-sm font-bold text-green-300">+{overviewStats.weeklyGrowth}%</span>
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-300">↑ {overviewStats.weeklyGrowth}%</p>
                    <p className="text-xs sm:text-sm text-white/60 mt-2">User growth in the last 7 days</p>
                  </div>
                  <div className="relative bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-blue-500/20 overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-white">Monthly Growth</h3>
                      <div className="px-2 sm:px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                        <span className="text-xs sm:text-sm font-bold text-blue-300">+{overviewStats.monthlyGrowth}%</span>
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-300">↑ {overviewStats.monthlyGrowth}%</p>
                    <p className="text-xs sm:text-sm text-white/60 mt-2">User growth in the last 30 days</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 border border-white/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10" />
                  <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-4 sm:mb-5 md:mb-6 relative z-10 flex items-center gap-2">
                    <div className="w-1 h-6 sm:h-7 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 relative z-10">
                    {adminNavItems
                      .filter((item) => item.id !== 'overview' && item.id !== 'settings')
                      .map((item, index) => {
                        const Icon = item.icon;
                        const colors = [
                          'from-blue-500/20 to-indigo-500/20 border-blue-400/30 hover:border-blue-400/50',
                          'from-purple-500/20 to-pink-500/20 border-purple-400/30 hover:border-purple-400/50',
                          'from-emerald-500/20 to-teal-500/20 border-emerald-400/30 hover:border-emerald-400/50',
                          'from-amber-500/20 to-orange-500/20 border-amber-400/30 hover:border-amber-400/50',
                          'from-rose-500/20 to-red-500/20 border-rose-400/30 hover:border-rose-400/50',
                        ];
                        const iconColors = [
                          'bg-blue-500/20 text-blue-300',
                          'bg-purple-500/20 text-purple-300',
                          'bg-emerald-500/20 text-emerald-300',
                          'bg-amber-500/20 text-amber-300',
                          'bg-rose-500/20 text-rose-300',
                        ];
                        return (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.08 }}
                            onClick={() => handleModuleChange(item.id)}
                            whileHover={{ scale: 1.03, y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 md:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br ${colors[index % colors.length]} backdrop-blur-sm border hover:shadow-lg hover:shadow-purple-500/20 transition-all group`}
                          >
                            <div className={`p-1.5 sm:p-2 rounded-lg ${iconColors[index % iconColors.length]} group-hover:scale-110 transition-transform`}>
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className="font-semibold text-white text-xs sm:text-sm md:text-base text-left flex-1">{item.label}</span>
                            <svg className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.button>
                        );
                      })}
                  </div>
                </motion.div>
              </motion.div>
            ) : activeComponent ? (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {React.createElement(activeComponent)}
              </motion.div>
            ) : (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center"
              >
                <p className="text-gray-600">This section is under development.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default memo(AdminDashboardComponent);

