import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSpeakerphone,
  HiClock,
  HiCheckCircle,
  HiArrowLeft,
  HiCalendar,
} from 'react-icons/hi';

const AnnouncementsComponent = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'New Simulation Available',
      message: 'Check out our new "Leadership Crisis Management" simulation!',
      type: 'info',
      status: 'active',
      createdDate: '2024-11-15',
      expiryDate: '2024-12-15',
      priority: 'high',
    },
    {
      id: 2,
      title: 'System Maintenance',
      message: 'Scheduled maintenance on November 20th from 2 AM to 4 AM EST.',
      type: 'warning',
      status: 'active',
      createdDate: '2024-11-10',
      expiryDate: '2024-11-20',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Welcome New Users!',
      message: 'Welcome to Acceptopia! Start your learning journey today.',
      type: 'success',
      status: 'active',
      createdDate: '2024-11-01',
      expiryDate: null,
      priority: 'low',
    },
    {
      id: 4,
      title: 'Holiday Schedule',
      message: 'Our platform will have limited support during the holiday season.',
      type: 'info',
      status: 'draft',
      createdDate: '2024-11-18',
      expiryDate: '2024-12-25',
      priority: 'medium',
    },
  ]);

  const activeAnnouncements = useMemo(
    () => announcements.filter((a) => a.status === 'active'),
    [announcements],
  );

  const draftAnnouncements = useMemo(
    () => announcements.filter((a) => a.status === 'draft'),
    [announcements],
  );

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'border-blue-200 bg-gradient-to-br from-white to-blue-50';
      case 'warning':
        return 'border-yellow-200 bg-gradient-to-br from-white to-yellow-50';
      case 'success':
        return 'border-green-200 bg-gradient-to-br from-white to-green-50';
      case 'error':
        return 'border-red-200 bg-gradient-to-br from-white to-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Announcements</h2>
          <p className="text-xs sm:text-sm text-white/70 mt-1">Manage system-wide announcements and notifications</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <HiPlus className="w-5 h-5" />
          Create Announcement
        </motion.button>
      </div>

      {/* Active Announcements */}
      <div>
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-500 flex items-center justify-center shadow-lg">
            <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">Active Announcements</h3>
          <span className="px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            {activeAnnouncements.length}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {activeAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`${getTypeColor(announcement.type)} rounded-xl sm:rounded-2xl shadow-lg border-2 p-4 sm:p-5 md:p-6`}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0"
                  >
                    <HiSpeakerphone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{announcement.title}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${getPriorityColor(announcement.priority)}`}
                      />
                      <span className="text-[10px] sm:text-xs text-gray-600 font-semibold capitalize">{announcement.priority} priority</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${getTypeBadgeColor(announcement.type)}`}>
                        {announcement.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <HiPencil className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(announcement.id)}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <HiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed">{announcement.message}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-600 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1.5">
                  <HiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                  <span className="font-medium">Created:</span>
                  <span>{announcement.createdDate}</span>
                </div>
                {announcement.expiryDate && (
                  <div className="flex items-center gap-1.5">
                    <HiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="font-medium">Expires:</span>
                    <span>{announcement.expiryDate}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {activeAnnouncements.length === 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <HiSpeakerphone className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No active announcements</p>
            <p className="text-sm sm:text-base text-gray-500">Create your first announcement to get started</p>
          </div>
        )}
      </div>

      {/* Draft Announcements */}
      {draftAnnouncements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-500 flex items-center justify-center shadow-lg">
              <HiClock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Draft Announcements</h3>
            <span className="px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
              {draftAnnouncements.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {draftAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-4 sm:p-5 md:p-6 opacity-75"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <HiSpeakerphone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{announcement.title}</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          DRAFT
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${getPriorityColor(announcement.priority)}`}
                        />
                        <span className="text-[10px] sm:text-xs text-gray-600 font-semibold capitalize">{announcement.priority}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <HiPencil className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(announcement.id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <HiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed">{announcement.message}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-600 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <HiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="font-medium">Created:</span>
                    <span>{announcement.createdDate}</span>
                  </div>
                  {announcement.expiryDate && (
                    <div className="flex items-center gap-1.5">
                      <HiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="font-medium">Expires:</span>
                      <span>{announcement.expiryDate}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(AnnouncementsComponent);
