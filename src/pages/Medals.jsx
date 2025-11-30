import React, { memo, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSearch,
  HiCheckCircle,
  HiXCircle,
  HiStar,
  HiShieldCheck,
  HiBadgeCheck,
  HiFire,
  HiSparkles,
  HiArrowLeft,
  HiUsers,
  HiX,
  HiSave,
} from 'react-icons/hi';
import { API_BASE_URL, apiRequest, getAuthHeaders } from '../config/api.js';

const MedalsComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [medals, setMedals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMedal, setEditingMedal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    xpRequirement: '',
    icon: 'star',
    color: 'blue',
    isActive: true,
    type: 'medal',
    rarity: 'common',
  });

  // Fetch medals from API
  const fetchMedals = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/rewards?search=${searchQuery}&isActive=${filterStatus === 'all' ? '' : filterStatus === 'active' ? 'true' : 'false'}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        // Fetch usersUnlocked for each medal
        const medalsWithUsers = await Promise.all(
          data.data.map(async (medal) => {
            try {
              const medalResponse = await fetch(`${API_BASE_URL}/rewards/${medal._id}`, {
                headers: getAuthHeaders(),
              });
              const medalData = await medalResponse.json();
              return {
                ...medal,
                usersUnlocked: medalData.data?.usersUnlocked || 0,
                status: medal.isActive ? 'active' : 'inactive',
              };
            } catch {
              return {
                ...medal,
                usersUnlocked: 0,
                status: medal.isActive ? 'active' : 'inactive',
              };
            }
          })
        );
        setMedals(medalsWithUsers);
      } else {
        setError(data.message || 'Failed to fetch medals');
      }
    } catch (err) {
      setError(err.message || 'Failed to load medals');
      console.error('Error fetching medals:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    fetchMedals();
  }, [fetchMedals]);

  const filteredMedals = useMemo(() => {
    return medals.filter((medal) => {
      const matchesSearch = medal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          medal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || medal.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [medals, searchQuery, filterStatus]);

  const handleEdit = (medal) => {
    setEditingMedal(medal);
    setFormData({
      name: medal.name,
      description: medal.description,
      xpRequirement: medal.xpRequirement.toString(),
      icon: medal.icon || 'star',
      color: medal.color || 'blue',
      isActive: medal.isActive !== undefined ? medal.isActive : medal.status === 'active',
      type: medal.type || 'medal',
      rarity: medal.rarity || 'common',
    });
    setShowModal(true);
  };

  const handleDelete = async (medalId) => {
    if (!window.confirm('Are you sure you want to delete this medal? This action cannot be undone.')) {
      return;
    }

    try {
      setError('');
      await apiRequest(`${API_BASE_URL}/rewards/${medalId}`, {
        method: 'DELETE',
      });
      await fetchMedals();
    } catch (err) {
      setError(err.message || 'Failed to delete medal');
    }
  };

  const handleToggleStatus = async (medalId, currentStatus) => {
    try {
      setError('');
      const newStatus = currentStatus === 'active' ? false : true;
      await apiRequest(`${API_BASE_URL}/rewards/${medalId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: newStatus }),
      });
      await fetchMedals();
    } catch (err) {
      setError(err.message || 'Failed to update medal status');
    }
  };

  const handleCreateNew = () => {
    setEditingMedal(null);
    setFormData({
      name: '',
      description: '',
      xpRequirement: '',
      icon: 'star',
      color: 'blue',
      isActive: true,
      type: 'medal',
      rarity: 'common',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const payload = {
        name: formData.name,
        description: formData.description,
        xpRequirement: parseInt(formData.xpRequirement),
        icon: formData.icon,
        color: formData.color,
        isActive: formData.isActive,
        type: formData.type,
        rarity: formData.rarity,
      };

      if (editingMedal) {
        await apiRequest(`${API_BASE_URL}/rewards/${editingMedal._id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest(`${API_BASE_URL}/rewards`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setShowModal(false);
      await fetchMedals();
    } catch (err) {
      setError(err.message || `Failed to ${editingMedal ? 'update' : 'create'} medal`);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const getIcon = (iconName) => {
    const iconProps = { className: 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white' };
    switch (iconName) {
      case 'star':
        return <HiStar {...iconProps} />;
      case 'trophy':
        return <HiBadgeCheck {...iconProps} />;
      case 'shield':
        return <HiShieldCheck {...iconProps} />;
      case 'badge':
        return <HiBadgeCheck {...iconProps} />;
      case 'fire':
        return <HiFire {...iconProps} />;
      case 'sparkles':
        return <HiSparkles {...iconProps} />;
      default:
        return <HiStar {...iconProps} />;
    }
  };

  const getColorGradient = (color) => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-indigo-600';
      case 'orange':
        return 'from-orange-500 to-red-600';
      case 'yellow':
        return 'from-yellow-500 to-amber-600';
      case 'purple':
        return 'from-purple-500 to-pink-600';
      case 'indigo':
        return 'from-indigo-500 to-purple-600';
      case 'pink':
        return 'from-pink-500 to-rose-600';
      case 'green':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

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

      {/* Header Actions */}
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
          <div className="relative flex-1">
            <HiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search medals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto min-w-[140px] px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateNew}
          className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <HiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Create New Medal</span>
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Medals Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {filteredMedals.map((medal, index) => (
            <motion.div
              key={medal._id || medal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="p-3 sm:p-4 md:p-5">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                  {medal.status === 'active' || medal.isActive ? (
                    <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[10px] sm:text-xs font-semibold border border-green-200">
                      <HiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-[10px] sm:text-xs font-semibold border border-gray-200">
                      <HiXCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Inactive</span>
                    </div>
                  )}
                </div>

                {/* Medal Icon */}
                <div className="flex justify-center mb-3 sm:mb-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${getColorGradient(medal.color)} flex items-center justify-center shadow-lg`}
                  >
                    {getIcon(medal.icon)}
                  </motion.div>
                </div>

                {/* Medal Info */}
                <div className="text-center mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                    {medal.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {medal.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mb-0.5">XP Required</p>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                      {medal.xpRequirement}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mb-0.5 flex items-center justify-center gap-1">
                      <HiUsers className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span>Unlocked</span>
                    </p>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                      {medal.usersUnlocked?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(medal)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition-colors text-[10px] sm:text-xs md:text-sm border border-blue-200"
                    >
                      <HiPencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(medal._id || medal.id)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold transition-colors text-[10px] sm:text-xs md:text-sm border border-red-200"
                    >
                      <HiTrash className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggleStatus(medal._id || medal.id, medal.status || (medal.isActive ? 'active' : 'inactive'))}
                    className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-[10px] sm:text-xs md:text-sm border ${
                      medal.status === 'active' || medal.isActive
                        ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                    }`}
                  >
                    {medal.status === 'active' || medal.isActive ? 'Deactivate' : 'Activate'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMedals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 text-center border border-gray-200"
        >
          <HiBadgeCheck className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600">No medals found</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {editingMedal ? 'Edit Medal' : 'Create New Medal'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <HiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                      Medal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="e.g., First Steps"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                      placeholder="e.g., Complete your first quiz"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        XP Requirement *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.xpRequirement}
                        onChange={(e) => setFormData({ ...formData, xpRequirement: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Icon
                      </label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="star">Star</option>
                        <option value="trophy">Trophy</option>
                        <option value="shield">Shield</option>
                        <option value="badge">Badge</option>
                        <option value="fire">Fire</option>
                        <option value="sparkles">Sparkles</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Color
                      </label>
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="blue">Blue</option>
                        <option value="orange">Orange</option>
                        <option value="yellow">Yellow</option>
                        <option value="purple">Purple</option>
                        <option value="indigo">Indigo</option>
                        <option value="pink">Pink</option>
                        <option value="green">Green</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Rarity
                      </label>
                      <select
                        value={formData.rarity}
                        onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="common">Common</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm sm:text-base font-semibold text-gray-700">
                      Active (visible to users)
                    </label>
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-semibold transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                    >
                      <HiSave className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{editingMedal ? 'Update' : 'Create'}</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(MedalsComponent);
