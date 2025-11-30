import React, { memo, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSearch,
  HiPlus,
  HiPencil,
  HiTrash,
  HiFilter,
  HiLightningBolt,
  HiCheckCircle,
  HiXCircle,
  HiArrowLeft,
  HiX,
  HiSave,
  HiCloudUpload,
  HiGlobe,
  HiLocationMarker,
  HiCurrencyDollar,
  HiAcademicCap,
} from 'react-icons/hi';
import { API_BASE_URL, apiRequest, getAuthHeaders } from '../config/api.js';

const SimulationsComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    cost: { tuition: '', currency: 'USD' },
    acceptanceDifficulty: 'medium',
    acceptanceRate: '',
    ranking: '',
    worldRanking: '',
    majorCompatibility: '',
    programs: '',
    requirements: { gpa: '', sat: '', toefl: '', ielts: '' },
    website: '',
    logo: '',
  });

  // Fetch colleges from API
  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterCountry !== 'all') params.append('country', filterCountry);
      
      const response = await fetch(`${API_BASE_URL}/colleges?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        setColleges(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch colleges');
      }
    } catch (err) {
      setError(err.message || 'Failed to load colleges');
      console.error('Error fetching colleges:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterCountry]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Get unique countries from colleges
  const countries = useMemo(() => {
    const countryList = ['all', ...new Set(colleges.map(c => c.country).filter(Boolean))];
    return countryList;
  }, [colleges]);

  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (college.city && college.city.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty = filterDifficulty === 'all' || 
                               college.acceptanceDifficulty === filterDifficulty ||
                               (filterDifficulty === 'Easy' && college.acceptanceDifficulty === 'easy') ||
                               (filterDifficulty === 'Medium' && college.acceptanceDifficulty === 'medium') ||
                               (filterDifficulty === 'Hard' && (college.acceptanceDifficulty === 'hard' || college.acceptanceDifficulty === 'very-hard'));
      const matchesCountry = filterCountry === 'all' || college.country === filterCountry;
      return matchesSearch && matchesDifficulty && matchesCountry;
    });
  }, [colleges, searchQuery, filterDifficulty, filterCountry]);

  const handleEdit = (college) => {
    setEditingCollege(college);
    setFormData({
      name: college.name || '',
      country: college.country || '',
      city: college.city || '',
      cost: {
        tuition: college.cost?.tuition?.toString() || '',
        currency: college.cost?.currency || 'USD',
      },
      acceptanceDifficulty: college.acceptanceDifficulty || 'medium',
      acceptanceRate: college.acceptanceRate?.toString() || '',
      ranking: college.ranking?.toString() || '',
      worldRanking: college.worldRanking?.toString() || '',
      majorCompatibility: college.majorCompatibility?.join(', ') || '',
      programs: college.programs ? JSON.stringify(college.programs, null, 2) : '',
      requirements: {
        gpa: college.requirements?.gpa?.toString() || '',
        sat: college.requirements?.sat?.toString() || '',
        toefl: college.requirements?.toefl?.toString() || '',
        ielts: college.requirements?.ielts?.toString() || '',
      },
      website: college.website || '',
      logo: college.logo || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (collegeId) => {
    if (!window.confirm('Are you sure you want to delete this college? This action cannot be undone.')) {
      return;
    }

    try {
      setError('');
      await apiRequest(`${API_BASE_URL}/colleges/${collegeId}`, {
        method: 'DELETE',
      });
      await fetchColleges();
    } catch (err) {
      setError(err.message || 'Failed to delete college');
    }
  };

  const handleCreateNew = () => {
    setEditingCollege(null);
    setFormData({
      name: '',
      country: '',
      city: '',
      cost: { tuition: '', currency: 'USD' },
      acceptanceDifficulty: 'medium',
      acceptanceRate: '',
      ranking: '',
      worldRanking: '',
      majorCompatibility: '',
      programs: '',
      requirements: { gpa: '', sat: '', toefl: '', ielts: '' },
      website: '',
      logo: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const payload = {
        name: formData.name,
        country: formData.country,
        city: formData.city,
        cost: {
          tuition: parseFloat(formData.cost.tuition),
          currency: formData.cost.currency,
        },
        acceptanceDifficulty: formData.acceptanceDifficulty,
        acceptanceRate: formData.acceptanceRate ? parseFloat(formData.acceptanceRate) : undefined,
        ranking: formData.ranking ? parseInt(formData.ranking) : undefined,
        worldRanking: formData.worldRanking ? parseInt(formData.worldRanking) : undefined,
        majorCompatibility: formData.majorCompatibility ? formData.majorCompatibility.split(',').map(m => m.trim()).filter(Boolean) : [],
        programs: formData.programs ? JSON.parse(formData.programs) : [],
        requirements: {
          gpa: formData.requirements.gpa ? parseFloat(formData.requirements.gpa) : undefined,
          sat: formData.requirements.sat ? parseInt(formData.requirements.sat) : undefined,
          toefl: formData.requirements.toefl ? parseInt(formData.requirements.toefl) : undefined,
          ielts: formData.requirements.ielts ? parseFloat(formData.requirements.ielts) : undefined,
        },
        website: formData.website,
        logo: formData.logo,
      };

      if (editingCollege) {
        await apiRequest(`${API_BASE_URL}/colleges/${editingCollege._id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest(`${API_BASE_URL}/colleges`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setShowModal(false);
      await fetchColleges();
    } catch (err) {
      setError(err.message || `Failed to ${editingCollege ? 'update' : 'create'} college`);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'very-easy':
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard':
      case 'very-hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'very-easy':
        return 'Very Easy';
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      case 'very-hard':
        return 'Very Hard';
      default:
        return difficulty;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
              placeholder="Search colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <div className="relative w-full sm:w-auto min-w-[140px]">
            <HiFilter className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 z-10" />
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full sm:w-auto pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="w-full sm:w-auto min-w-[140px] px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country === 'all' ? 'All Countries' : country}
              </option>
            ))}
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateNew}
          className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <HiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add College</span>
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Colleges Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {filteredColleges.map((college, index) => (
            <motion.div
              key={college._id || college.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-5 lg:p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <HiAcademicCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(college)}
                    className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <HiPencil className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(college._id || college.id)}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <HiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>

              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">{college.name}</h3>
              
              <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <HiLocationMarker className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <span className="truncate">{college.city ? `${college.city}, ` : ''}{college.country}</span>
                </div>
                {college.cost && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <HiCurrencyDollar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <span>{college.cost.currency} {college.cost.tuition?.toLocaleString() || '0'}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold border ${getDifficultyColor(college.acceptanceDifficulty)}`}>
                    {getDifficultyLabel(college.acceptanceDifficulty)}
                  </span>
                </div>
                {college.ranking && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ranking:</span>
                    <span className="font-semibold text-gray-900">#{college.ranking}</span>
                  </div>
                )}
                {college.acceptanceRate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Acceptance:</span>
                    <span className="font-semibold text-gray-900">{college.acceptanceRate}%</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-100">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900 text-[9px] sm:text-[10px] md:text-xs">{formatDate(college.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredColleges.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-12 text-center"
        >
          <HiAcademicCap className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 mb-2">No colleges found</p>
          <p className="text-xs sm:text-sm md:text-base text-gray-500">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* Stats Summary */}
      {!loading && colleges.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 border border-gray-200"
          >
            <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Total Colleges</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{colleges.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 border border-gray-200"
          >
            <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Countries</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-600">{countries.length - 1}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 border border-gray-200"
          >
            <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Easy Entry</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600">
              {colleges.filter(c => c.acceptanceDifficulty === 'easy' || c.acceptanceDifficulty === 'very-easy').length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 border border-gray-200"
          >
            <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Hard Entry</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-600">
              {colleges.filter(c => c.acceptanceDifficulty === 'hard' || c.acceptanceDifficulty === 'very-hard').length}
            </p>
          </motion.div>
        </div>
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
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {editingCollege ? 'Edit College' : 'Add New College'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <HiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        College Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., Harvard University"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., USA"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., Cambridge"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Tuition *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.cost.tuition}
                        onChange={(e) => setFormData({ ...formData, cost: { ...formData.cost, tuition: e.target.value } })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="50000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Currency
                      </label>
                      <select
                        value={formData.cost.currency}
                        onChange={(e) => setFormData({ ...formData, cost: { ...formData.cost, currency: e.target.value } })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Acceptance Difficulty *
                      </label>
                      <select
                        required
                        value={formData.acceptanceDifficulty}
                        onChange={(e) => setFormData({ ...formData, acceptanceDifficulty: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="very-easy">Very Easy</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="very-hard">Very Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Acceptance Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.acceptanceRate}
                        onChange={(e) => setFormData({ ...formData, acceptanceRate: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="15"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        National Ranking
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.ranking}
                        onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        World Ranking
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.worldRanking}
                        onChange={(e) => setFormData({ ...formData, worldRanking: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="1"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Major Compatibility (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.majorCompatibility}
                        onChange={(e) => setFormData({ ...formData, majorCompatibility: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Computer Science, Engineering, Business"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="https://www.university.edu"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Requirements
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <label className="block text-xs sm:text-sm text-gray-600 mb-1">GPA (0-4.0)</label>
                          <input
                            type="number"
                            min="0"
                            max="4"
                            step="0.1"
                            value={formData.requirements.gpa}
                            onChange={(e) => setFormData({ ...formData, requirements: { ...formData.requirements, gpa: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="3.5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm text-gray-600 mb-1">SAT (400-1600)</label>
                          <input
                            type="number"
                            min="400"
                            max="1600"
                            value={formData.requirements.sat}
                            onChange={(e) => setFormData({ ...formData, requirements: { ...formData.requirements, sat: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="1500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm text-gray-600 mb-1">TOEFL (0-120)</label>
                          <input
                            type="number"
                            min="0"
                            max="120"
                            value={formData.requirements.toefl}
                            onChange={(e) => setFormData({ ...formData, requirements: { ...formData.requirements, toefl: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm text-gray-600 mb-1">IELTS (0-9)</label>
                          <input
                            type="number"
                            min="0"
                            max="9"
                            step="0.5"
                            value={formData.requirements.ielts}
                            onChange={(e) => setFormData({ ...formData, requirements: { ...formData.requirements, ielts: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="7.0"
                          />
                        </div>
                      </div>
                    </div>
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
                      <span>{editingCollege ? 'Update' : 'Create'}</span>
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

export default memo(SimulationsComponent);
