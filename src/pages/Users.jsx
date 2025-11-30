import React, { memo, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  HiX,
} from 'react-icons/hi';
import { API_ENDPOINTS, apiRequest } from '../config/api';

const UsersComponent = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [filterXP, setFilterXP] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    subscription: 'free',
    status: 'active',
  });
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    subscription: 'free',
    status: 'active',
    role: 'user',
  });
  const [createFormErrors, setCreateFormErrors] = useState({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterSubscription !== 'all') params.append('subscription', filterSubscription);
      if (filterXP !== 'all') params.append('xpFilter', filterXP);
      params.append('limit', '100'); // Get more users

      const response = await apiRequest(`${API_ENDPOINTS.users.getAll}?${params.toString()}`);
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus, filterSubscription, filterXP]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user._id?.toString().includes(searchQuery);
      
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesSubscription = filterSubscription === 'all' || user.subscription === filterSubscription;
      
      let matchesXP = true;
      if (filterXP === 'high') matchesXP = (user.xp || 0) >= 2000;
      else if (filterXP === 'medium') matchesXP = (user.xp || 0) >= 1000 && (user.xp || 0) < 2000;
      else if (filterXP === 'low') matchesXP = (user.xp || 0) < 1000;
      
      return matchesSearch && matchesStatus && matchesSubscription && matchesXP;
    });
  }, [users, searchQuery, filterStatus, filterSubscription, filterXP]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSuspend = async (user) => {
    if (isSubmitting) return;
    
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    const action = newStatus === 'suspended' ? 'suspend' : 'unsuspend';
    
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      setActiveDropdown(null);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(API_ENDPOINTS.users.update(user._id), {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      showSuccess(`User ${action}ed successfully`);
      await fetchUsers();
    } catch (err) {
      alert(`Failed to ${action} user: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setActiveDropdown(null);
    }
  };

  const handleDelete = async (userId) => {
    if (isSubmitting) return;
    
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setActiveDropdown(null);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(API_ENDPOINTS.users.delete(userId), {
        method: 'DELETE',
      });
      showSuccess('User deleted successfully');
      await fetchUsers();
    } catch (err) {
      alert(`Failed to delete user: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setActiveDropdown(null);
    }
  };

  const handlePromote = async (userId) => {
    if (isSubmitting) return;
    
    if (!window.confirm('Are you sure you want to promote this user to admin?')) {
      setActiveDropdown(null);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(API_ENDPOINTS.users.update(userId), {
        method: 'PATCH',
        body: JSON.stringify({ role: 'admin' }),
      });
      showSuccess('User promoted to admin successfully');
      await fetchUsers();
    } catch (err) {
      alert(`Failed to promote user: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setActiveDropdown(null);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      subscription: user.subscription || 'free',
      status: user.status || 'active',
    });
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSaveEdit = async () => {
    if (isSubmitting || !selectedUser) return;

    setIsSubmitting(true);
    try {
      await apiRequest(API_ENDPOINTS.users.update(selectedUser._id), {
        method: 'PATCH',
        body: JSON.stringify(editForm),
      });
      showSuccess('User updated successfully');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      alert(`Failed to update user: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetStreak = async (userId) => {
    if (isSubmitting) return;
    
    if (!window.confirm('Are you sure you want to reset this user\'s streak?')) {
      setActiveDropdown(null);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(API_ENDPOINTS.users.resetStreak(userId), {
        method: 'PATCH',
      });
      showSuccess('User streak reset successfully');
      await fetchUsers();
    } catch (err) {
      alert(`Failed to reset streak: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setActiveDropdown(null);
    }
  };

  const handleResetXP = async (userId) => {
    if (isSubmitting) return;
    
    if (!window.confirm('Are you sure you want to reset this user\'s XP?')) {
      setActiveDropdown(null);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(API_ENDPOINTS.users.resetXP(userId), {
        method: 'PATCH',
      });
      showSuccess('User XP reset successfully');
      await fetchUsers();
    } catch (err) {
      alert(`Failed to reset XP: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setActiveDropdown(null);
    }
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
    setActiveDropdown(null);
  };

  const handleOpenCreateModal = () => {
    setCreateForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      subscription: 'free',
      status: 'active',
      role: 'user',
    });
    setCreateFormErrors({});
    setIsCreateModalOpen(true);
  };

  const validateCreateForm = () => {
    const errors = {};
    if (!createForm.name.trim()) errors.name = 'Name is required';
    if (!createForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email)) errors.email = 'Invalid email format';
    if (!createForm.password) errors.password = 'Password is required';
    else if (createForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (createForm.password !== createForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setCreateFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateCreateForm()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...userData } = createForm;
      await apiRequest(API_ENDPOINTS.users.create, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      showSuccess('User created successfully');
      setIsCreateModalOpen(false);
      setCreateForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        subscription: 'free',
        status: 'active',
        role: 'user',
      });
      await fetchUsers();
    } catch (err) {
      alert(`Failed to create user: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between"
          >
            <span className="font-semibold">{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-4 hover:bg-green-600 rounded p-1"
            >
              <HiX className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error: {error}</p>
        </div>
      )}

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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchUsers}
            disabled={loading}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <HiRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>
        </div>

        {/* Add User Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <HiUserAdd className="w-5 h-5" />
          Add User
        </motion.button>

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
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Users Grid - Mobile Card View */}
      {!loading && (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user._id || user.id}
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
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </motion.div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                          {user.name || 'Unknown User'}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mt-0.5">
                          <HiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{user.email || 'No email'}</span>
                        </div>
                      </div>

                      {/* Actions Dropdown */}
                      <div className="relative flex-shrink-0 dropdown-container">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setActiveDropdown(activeDropdown === user._id ? null : user._id)}
                          disabled={isSubmitting}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <HiDotsVertical className="w-5 h-5 text-gray-600" />
                        </motion.button>

                        {activeDropdown === user._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                          >
                            <button
                              onClick={() => handleViewDetails(user)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <HiEye className="w-5 h-5" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleEdit(user)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <HiPencil className="w-5 h-5" />
                              Edit User
                            </button>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handlePromote(user._id)}
                                disabled={isSubmitting}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-50"
                              >
                                <HiShieldCheck className="w-5 h-5" />
                                Promote to Admin
                              </button>
                            )}
                            <div className="border-t border-gray-100" />
                            <button
                              onClick={() => handleResetStreak(user._id)}
                              disabled={isSubmitting}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors disabled:opacity-50"
                            >
                              <HiRefresh className="w-5 h-5" />
                              Reset Streak
                            </button>
                            <button
                              onClick={() => handleResetXP(user._id)}
                              disabled={isSubmitting}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50"
                            >
                              <HiRefresh className="w-5 h-5" />
                              Reset XP
                            </button>
                            <div className="border-t border-gray-100" />
                            <button
                              onClick={() => handleSuspend(user)}
                              disabled={isSubmitting}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
                                user.status === 'suspended'
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-orange-600 hover:bg-orange-50'
                              }`}
                            >
                              <HiUserRemove className="w-5 h-5" />
                              {user.status === 'suspended' ? 'Unsuspend User' : 'Suspend User'}
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={isSubmitting}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
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
                        ID: {(user._id || user.id || 'N/A').toString().substring(0, 8)}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role || 'user'}
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
                        {user.status || 'active'}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${
                          user.subscription === 'premium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {user.subscription || 'free'}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-100">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <HiStar className="w-3 h-3 text-amber-500" />
                          <span className="text-[10px] sm:text-xs font-semibold text-gray-500">XP</span>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-gray-900">{(user.xp || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <HiFire className="w-3 h-3 text-orange-500" />
                          <span className="text-[10px] sm:text-xs font-semibold text-gray-500">Streak</span>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-orange-600">{user.streak || 0} days</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <HiAcademicCap className="w-3 h-3 text-blue-500" />
                          <span className="text-[10px] sm:text-xs font-semibold text-gray-500">Medals</span>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-blue-600">{user.medals?.length || 0}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <HiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">Joined:</span>
                        <span>{formatDate(user.createdAt || user.joinedDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <HiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">Last Active:</span>
                        <span>{formatDate(user.lastActive)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <HiSearch className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No users found</p>
          <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Stats Summary */}
      {!loading && (
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
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => !isSubmitting && setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subscription</label>
                  <select
                    value={editForm.subscription}
                    onChange={(e) => setEditForm({ ...editForm, subscription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Name</p>
                    <p className="text-base text-gray-900">{selectedUser.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
                    <p className="text-base text-gray-900">{selectedUser.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Role</p>
                    <p className="text-base text-gray-900 capitalize">{selectedUser.role || 'user'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Status</p>
                    <p className="text-base text-gray-900 capitalize">{selectedUser.status || 'active'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Subscription</p>
                    <p className="text-base text-gray-900 capitalize">{selectedUser.subscription || 'free'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">XP</p>
                    <p className="text-base text-gray-900">{(selectedUser.xp || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Streak</p>
                    <p className="text-base text-gray-900">{selectedUser.streak || 0} days</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Medals</p>
                    <p className="text-base text-gray-900">{selectedUser.medals?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Joined</p>
                    <p className="text-base text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Last Active</p>
                    <p className="text-base text-gray-900">{formatDate(selectedUser.lastActive)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create User Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New User</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      createFormErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter user name"
                  />
                  {createFormErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{createFormErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      createFormErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter user email"
                  />
                  {createFormErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{createFormErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      createFormErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter password (min 6 characters)"
                  />
                  {createFormErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{createFormErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={createForm.confirmPassword}
                    onChange={(e) => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      createFormErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                  />
                  {createFormErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{createFormErrors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subscription</label>
                  <select
                    value={createForm.subscription}
                    onChange={(e) => setCreateForm({ ...createForm, subscription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(UsersComponent);
