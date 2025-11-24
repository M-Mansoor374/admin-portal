import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HiSearch,
  HiUserRemove,
  HiUserAdd,
  HiShieldCheck,
  HiTrash,
  HiFilter,
  HiArrowLeft,
  HiMail,
  HiCalendar,
  HiClock,
  HiDotsVertical,
  HiPencil,
  HiRefresh,
  HiStar,
  HiFire,
  HiAcademicCap,
  HiBadgeCheck,
  HiEye,
} from 'react-icons/hi';

const UsersComponent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [filterXP, setFilterXP] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Mock user data - replace with actual API call from MongoDB
  const users = useMemo(
    () => [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        xp: 2450,
        streak: 15,
        quizzesCompleted: 23,
        subscription: 'premium',
        role: 'user',
        status: 'active',
        joinedDate: '2024-01-15',
        lastActive: '2024-11-18',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        xp: 1850,
        streak: 7,
        quizzesCompleted: 18,
        subscription: 'premium',
        role: 'user',
        status: 'active',
        joinedDate: '2024-02-20',
        lastActive: '2024-11-17',
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@acceptopia.com',
        xp: 5280,
        streak: 45,
        quizzesCompleted: 67,
        subscription: 'premium',
        role: 'admin',
        status: 'active',
        joinedDate: '2024-01-01',
        lastActive: '2024-11-18',
      },
      {
        id: 4,
        name: 'Suspended User',
        email: 'suspended@example.com',
        xp: 890,
        streak: 0,
        quizzesCompleted: 12,
        subscription: 'free',
        role: 'user',
        status: 'suspended',
        joinedDate: '2024-03-10',
        lastActive: '2024-10-15',
      },
      {
        id: 5,
        name: 'Emily Brown',
        email: 'emily.brown@example.com',
        xp: 3420,
        streak: 21,
        quizzesCompleted: 34,
        subscription: 'premium',
        role: 'user',
        status: 'active',
        joinedDate: '2024-02-10',
        lastActive: '2024-11-18',
      },
      {
        id: 6,
        name: 'Michael Wilson',
        email: 'michael.w@example.com',
        xp: 640,
        streak: 3,
        quizzesCompleted: 8,
        subscription: 'free',
        role: 'user',
        status: 'active',
        joinedDate: '2024-10-01',
        lastActive: '2024-11-16',
      },
      {
        id: 7,
        name: 'Sarah Davis',
        email: 'sarah.d@example.com',
        xp: 120,
        streak: 1,
        quizzesCompleted: 2,
        subscription: 'free',
        role: 'user',
        status: 'inactive',
        joinedDate: '2024-10-20',
        lastActive: '2024-10-25',
      },
    ],
    [],
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toString().includes(searchQuery);
      
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesSubscription = filterSubscription === 'all' || user.subscription === filterSubscription;
      
      let matchesXP = true;
      if (filterXP === 'high') matchesXP = user.xp >= 2000;
      else if (filterXP === 'medium') matchesXP = user.xp >= 1000 && user.xp < 2000;
      else if (filterXP === 'low') matchesXP = user.xp < 1000;
      
      return matchesSearch && matchesStatus && matchesSubscription && matchesXP;
    });
  }, [users, searchQuery, filterStatus, filterSubscription, filterXP]);

  const handleSuspend = (userId) => {
    console.log('Suspend user:', userId);
    // Call API to suspend/unsuspend user
    setActiveDropdown(null);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log('Soft delete user:', userId);
      // Call API to soft delete user (mark as deleted without removing from DB)
      setActiveDropdown(null);
    }
  };

  const handlePromote = (userId) => {
    console.log('Promote user to admin:', userId);
    // Call API to update user role
    setActiveDropdown(null);
  };

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
    // Navigate to edit page or open modal
    setActiveDropdown(null);
  };

  const handleResetStreak = (userId) => {
    if (window.confirm('Are you sure you want to reset this user\'s streak?')) {
      console.log('Reset streak for user:', userId);
      // Call API to reset user streak to 0
      setActiveDropdown(null);
    }
  };

  const handleResetXP = (userId) => {
    if (window.confirm('Are you sure you want to reset this user\'s XP?')) {
      console.log('Reset XP for user:', userId);
      // Call API to reset user XP to 0
      setActiveDropdown(null);
    }
  };

  const handleViewDetails = (userId) => {
    console.log('View details for user:', userId);
    // Navigate to user detail page
    setActiveDropdown(null);
  };

  const handleBack = () => {
    // Navigate back to overview or dashboard
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

      {/* Header Actions */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <div className="relative">
            <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="relative">
            <HiBadgeCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <select
              value={filterSubscription}
              onChange={(e) => setFilterSubscription(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="all">All Subscriptions</option>
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>
          </div>

          <div className="relative">
            <HiStar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <select
              value={filterXP}
              onChange={(e) => setFilterXP(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="all">All XP Levels</option>
              <option value="high">High XP (2000+)</option>
              <option value="medium">Medium XP (1000-2000)</option>
              <option value="low">Low XP (&lt;1000)</option>
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <HiUserAdd className="w-5 h-5" />
          Add User
        </motion.button>
      </div>

      {/* Users Grid - Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Avatar */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg flex-shrink-0"
                >
                  {user.name.charAt(0).toUpperCase()}
                </motion.div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mt-0.5">
                        <HiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="relative flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <HiDotsVertical className="w-5 h-5 text-gray-600" />
                      </motion.button>

                      {activeDropdown === user.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                        >
                          <button
                            onClick={() => handleViewDetails(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <HiEye className="w-5 h-5" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <HiPencil className="w-5 h-5" />
                            Edit User
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handlePromote(user.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors"
                            >
                              <HiShieldCheck className="w-5 h-5" />
                              Promote to Admin
                            </button>
                          )}
                          <div className="border-t border-gray-100" />
                          <button
                            onClick={() => handleResetStreak(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
                          >
                            <HiRefresh className="w-5 h-5" />
                            Reset Streak
                          </button>
                          <button
                            onClick={() => handleResetXP(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <HiRefresh className="w-5 h-5" />
                            Reset XP
                          </button>
                          <div className="border-t border-gray-100" />
                          <button
                            onClick={() => handleSuspend(user.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                              user.status === 'active'
                                ? 'text-orange-600 hover:bg-orange-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            <HiUserRemove className="w-5 h-5" />
                            {user.status === 'active' || user.status === 'inactive' ? 'Suspend User' : 'Unsuspend User'}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <HiTrash className="w-5 h-5" />
                            Delete User
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-semibold">
                      ID: {user.id}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : user.status === 'suspended'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.status}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${
                        user.subscription === 'premium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {user.subscription}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <HiStar className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-500">XP</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-gray-900">{user.xp.toLocaleString()}</p>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <HiFire className="w-3 h-3 text-orange-500" />
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-500">Streak</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-orange-600">{user.streak} days</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <HiAcademicCap className="w-3 h-3 text-blue-500" />
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-500">Quizzes</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-blue-600">{user.quizzesCompleted}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <HiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-medium">Joined:</span>
                      <span>{user.joinedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-medium">Last Active:</span>
                      <span>{user.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <HiSearch className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No users found</p>
          <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-blue-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <HiUserAdd className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Users</p>
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{users.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-green-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-green-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <HiShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Users</p>
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
            {users.filter((u) => u.status === 'active').length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white to-red-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-red-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
              <HiUserRemove className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Suspended</p>
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">
            {users.filter((u) => u.status === 'suspended').length}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(UsersComponent);
