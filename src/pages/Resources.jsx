import React, { memo, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSearch,
  HiPlus,
  HiPencil,
  HiTrash,
  HiFilter,
  HiDocument,
  HiPhotograph,
  HiVideoCamera,
  HiArrowLeft,
  HiDownload,
  HiCalendar,
  HiX,
  HiSave,
  HiCloudUpload,
  HiTag,
} from 'react-icons/hi';
import { API_BASE_URL, apiRequest, getAuthHeaders } from '../config/api.js';

const ResourcesComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'article',
    category: '',
    content: '',
    isPremium: false,
    tags: '',
    file: null,
    thumbnail: null,
  });

  // Fetch resources from API
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterType !== 'all') params.append('type', filterType);
      
      const response = await fetch(`${API_BASE_URL}/resources?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        setResources(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch resources');
      }
    } catch (err) {
      setError(err.message || 'Failed to load resources');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterCategory, filterType]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Get unique categories from resources
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(resources.map(r => r.category).filter(Boolean))];
    return cats;
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
      const matchesType = filterType === 'all' || resource.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [resources, searchQuery, filterCategory, filterType]);

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title || '',
      description: resource.description || '',
      type: resource.type || 'article',
      category: resource.category || '',
      content: resource.content || '',
      isPremium: resource.isPremium || false,
      tags: resource.tags ? resource.tags.join(', ') : '',
      file: null,
      thumbnail: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      return;
    }

    try {
      setError('');
      await apiRequest(`${API_BASE_URL}/resources/${resourceId}`, {
        method: 'DELETE',
      });
      await fetchResources();
    } catch (err) {
      setError(err.message || 'Failed to delete resource');
    }
  };

  const handleCreateNew = () => {
    setEditingResource(null);
    setFormData({
      title: '',
      description: '',
      type: 'article',
      category: '',
      content: '',
      isPremium: false,
      tags: '',
      file: null,
      thumbnail: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setUploading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('isPremium', formData.isPremium);
      
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        tagsArray.forEach(tag => formDataToSend.append('tags[]', tag));
      }

      if (formData.file) {
        formDataToSend.append('resource', formData.file);
      }
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      const token = localStorage.getItem('acceptopia-admin-token') || sessionStorage.getItem('acceptopia-admin-token');
      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const url = editingResource 
        ? `${API_BASE_URL}/resources/${editingResource._id}`
        : `${API_BASE_URL}/resources`;
      
      const response = await fetch(url, {
        method: editingResource ? 'PATCH' : 'POST',
        headers,
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${editingResource ? 'update' : 'create'} resource`);
      }

      setShowModal(false);
      await fetchResources();
    } catch (err) {
      setError(err.message || `Failed to ${editingResource ? 'update' : 'create'} resource`);
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return HiDocument;
      case 'video':
        return HiVideoCamera;
      case 'article':
      case 'guide':
      case 'template':
      case 'tool':
        return HiDocument;
      default:
        return HiDocument;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'video':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'article':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'guide':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'template':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'tool':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <div className="relative w-full sm:w-auto min-w-[140px]">
            <HiFilter className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 z-10" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-auto pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto min-w-[140px] px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="article">Article</option>
            <option value="guide">Guide</option>
            <option value="template">Template</option>
            <option value="tool">Tool</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateNew}
          className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <HiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Upload Resource</span>
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Resources Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {filteredResources.map((resource, index) => {
            const Icon = getTypeIcon(resource.type);
            return (
              <motion.div
                key={resource._id || resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-5 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <div className="flex gap-1 sm:gap-1.5 md:gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(resource)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <HiPencil className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(resource._id || resource.id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <HiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">{resource.title}</h3>
                
                <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs md:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900 text-[10px] sm:text-xs">{resource.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className={`px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold border ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                  </div>
                  {resource.downloads !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <HiDownload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Downloads</span>
                      </span>
                      <span className="font-bold text-blue-600 text-[10px] sm:text-xs">{resource.downloads.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-100">
                    <span className="text-gray-600 flex items-center gap-1">
                      <HiCalendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Uploaded</span>
                    </span>
                    <span className="font-medium text-gray-900 text-[10px] sm:text-xs">{formatDate(resource.createdAt)}</span>
                  </div>
                  {resource.isPremium && (
                    <div className="pt-1.5 sm:pt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[9px] sm:text-[10px] font-semibold border border-yellow-200">
                        <HiTag className="w-3 h-3" />
                        Premium
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-12 text-center"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <HiDocument className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400" />
          </div>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-2">No resources found</p>
          <p className="text-xs sm:text-sm md:text-base text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Stats Summary */}
      {!loading && resources.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 border border-gray-200"
          >
            <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Total Resources</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{resources.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 border border-blue-100"
          >
            <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Total Downloads</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600">
              {resources.reduce((sum, r) => sum + (r.downloads || 0), 0).toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white to-red-50 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 border border-red-100"
          >
            <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">PDF Files</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-600">
              {resources.filter((r) => r.type === 'pdf').length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-white to-purple-50 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 border border-purple-100"
          >
            <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Videos</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600">
              {resources.filter((r) => r.type === 'video').length}
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
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {editingResource ? 'Edit Resource' : 'Upload New Resource'}
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
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Resource title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Type *
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="article">Article</option>
                        <option value="guide">Guide</option>
                        <option value="template">Template</option>
                        <option value="tool">Tool</option>
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Category *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., Application Tips"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                        placeholder="Resource description"
                      />
                    </div>

                    {(formData.type === 'article' || formData.type === 'guide') && (
                      <div className="sm:col-span-2">
                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                          Content
                        </label>
                        <textarea
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          rows="5"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                          placeholder="Article or guide content"
                        />
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>

                    {(formData.type === 'pdf' || formData.type === 'video' || formData.type === 'template') && (
                      <div className="sm:col-span-2">
                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                          Resource File
                        </label>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl hover:border-blue-500 transition-colors cursor-pointer">
                            <HiCloudUpload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                            <span className="text-sm sm:text-base text-gray-600">
                              {formData.file ? formData.file.name : 'Choose file'}
                            </span>
                            <input
                              type="file"
                              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                              className="hidden"
                              accept={formData.type === 'pdf' ? '.pdf' : formData.type === 'video' ? 'video/*' : '*'}
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Thumbnail Image
                      </label>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl hover:border-blue-500 transition-colors cursor-pointer">
                          <HiPhotograph className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                          <span className="text-sm sm:text-base text-gray-600">
                            {formData.thumbnail ? formData.thumbnail.name : 'Choose thumbnail'}
                          </span>
                          <input
                            type="file"
                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2 sm:gap-3">
                      <input
                        type="checkbox"
                        id="isPremium"
                        checked={formData.isPremium}
                        onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="isPremium" className="text-sm sm:text-base font-semibold text-gray-700">
                        Premium Resource (requires subscription)
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowModal(false)}
                      disabled={uploading}
                      className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-semibold transition-colors text-sm sm:text-base disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={uploading}
                      className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <HiSave className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>{editingResource ? 'Update' : 'Upload'}</span>
                        </>
                      )}
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

export default memo(ResourcesComponent);
