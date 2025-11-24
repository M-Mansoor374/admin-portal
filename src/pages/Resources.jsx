import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
} from 'react-icons/hi';

const ResourcesComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock resource data - replace with actual API call
  const resources = useMemo(
    () => [
      {
        id: 1,
        title: 'Introduction to React',
        category: 'Tutorial',
        type: 'PDF',
        size: '2.5 MB',
        uploadDate: '2024-10-15',
        downloads: 1247,
        icon: HiDocument,
      },
      {
        id: 2,
        title: 'Design Principles Guide',
        category: 'Guide',
        type: 'PDF',
        size: '1.8 MB',
        uploadDate: '2024-10-10',
        downloads: 892,
        icon: HiDocument,
      },
      {
        id: 3,
        title: 'UI Components Showcase',
        category: 'Reference',
        type: 'Image',
        size: '5.2 MB',
        uploadDate: '2024-09-20',
        downloads: 634,
        icon: HiPhotograph,
      },
      {
        id: 4,
        title: 'Advanced JavaScript Course',
        category: 'Course',
        type: 'Video',
        size: '125 MB',
        uploadDate: '2024-09-15',
        downloads: 2156,
        icon: HiVideoCamera,
      },
    ],
    [],
  );

  const categories = ['all', 'Tutorial', 'Guide', 'Reference', 'Course'];

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterCategory === 'all' || resource.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [resources, searchQuery, filterCategory]);

  const handleEdit = (resourceId) => {
    console.log('Edit resource:', resourceId);
  };

  const handleDelete = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      console.log('Delete resource:', resourceId);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'PDF':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Image':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Video':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-auto pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <HiPlus className="w-5 h-5" />
          Upload Resource
        </motion.button>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {filteredResources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
                <div className="flex gap-1.5 sm:gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(resource.id)}
                    className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <HiPencil className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(resource.id)}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <HiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 line-clamp-2">{resource.title}</h3>
              
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900">{resource.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Size</span>
                  <span className="font-semibold text-gray-900">{resource.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <HiDownload className="w-3.5 h-3.5" />
                    Downloads
                  </span>
                  <span className="font-bold text-blue-600">{resource.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-600 flex items-center gap-1">
                    <HiCalendar className="w-3.5 h-3.5" />
                    Uploaded
                  </span>
                  <span className="font-medium text-gray-900">{resource.uploadDate}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <HiDocument className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No resources found</p>
          <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-200"
        >
          <p className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Total Resources</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{resources.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 border border-blue-100"
        >
          <p className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Total Downloads</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
            {resources.reduce((sum, r) => sum + r.downloads, 0).toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white to-red-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 border border-red-100"
        >
          <p className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">PDF Files</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">
            {resources.filter((r) => r.type === 'PDF').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white to-purple-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 border border-purple-100"
        >
          <p className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 sm:mb-2">Videos</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">
            {resources.filter((r) => r.type === 'Video').length}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(ResourcesComponent);
