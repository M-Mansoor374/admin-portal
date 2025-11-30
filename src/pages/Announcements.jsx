import React, { memo, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSpeakerphone,
  HiClock,
  HiCheckCircle,
  HiArrowLeft,
  HiCalendar,
  HiX,
  HiSave,
  HiPaperAirplane,
  HiUsers,
  HiRefresh,
} from 'react-icons/hi';
import { API_ENDPOINTS, apiRequest } from '../config/api';

const AnnouncementsComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'broadcast',
    target: 'all',
    scheduledAt: '',
    sendNow: true,
  });

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiRequest(`${API_ENDPOINTS.notifications.getAll}?limit=100`);
      setNotifications(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const activeNotifications = useMemo(
    () => notifications.filter((n) => n.status === 'sent'),
    [notifications],
  );

  const scheduledNotifications = useMemo(
    () => notifications.filter((n) => n.status === 'scheduled'),
    [notifications],
  );

  const draftNotifications = useMemo(
    () => notifications.filter((n) => n.status === 'pending'),
    [notifications],
  );

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title || '',
      message: notification.message || '',
      type: notification.type || 'broadcast',
      target: notification.target || 'all',
      scheduledAt: notification.scheduledAt ? new Date(notification.scheduledAt).toISOString().slice(0, 16) : '',
      sendNow: notification.status === 'sent',
    });
    setShowModal(true);
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification? This action cannot be undone.')) {
      return;
    }

    try {
      setError('');
      await apiRequest(API_ENDPOINTS.notifications.delete(notificationId), {
        method: 'DELETE',
      });
      setSuccessMessage('Notification deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchNotifications();
    } catch (err) {
      setError(err.message || 'Failed to delete notification');
    }
  };

  const handleCreateNew = () => {
    setEditingNotification(null);
    setFormData({
      title: '',
      message: '',
      type: 'broadcast',
      target: 'all',
      scheduledAt: '',
      sendNow: true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSending(true);

      const payload = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target: formData.target,
      };

      if (editingNotification) {
        // Update existing notification
        const updatePayload = { ...payload };
        if (formData.sendNow) {
          updatePayload.status = 'sent';
          updatePayload.sentAt = new Date().toISOString();
        } else if (formData.scheduledAt) {
          updatePayload.status = 'scheduled';
          updatePayload.scheduledAt = new Date(formData.scheduledAt).toISOString();
        } else {
          updatePayload.status = 'pending';
        }

        await apiRequest(API_ENDPOINTS.notifications.update(editingNotification._id), {
          method: 'PATCH',
          body: JSON.stringify(updatePayload),
        });
        setSuccessMessage('Notification updated successfully');
      } else if (formData.sendNow) {
        // Send immediately
        await apiRequest(API_ENDPOINTS.notifications.send, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSuccessMessage('Notification sent successfully');
      } else if (formData.scheduledAt) {
        // Schedule for later
        await apiRequest(API_ENDPOINTS.notifications.schedule, {
          method: 'POST',
          body: JSON.stringify({
            ...payload,
            scheduledAt: new Date(formData.scheduledAt).toISOString(),
          }),
        });
        setSuccessMessage('Notification scheduled successfully');
      }

      setTimeout(() => setSuccessMessage(null), 3000);
      setShowModal(false);
      await fetchNotifications();
    } catch (err) {
      setError(err.message || `Failed to ${editingNotification ? 'update' : 'create'} notification`);
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'broadcast':
        return 'border-blue-200 bg-gradient-to-br from-white to-blue-50';
      case 'email':
        return 'border-purple-200 bg-gradient-to-br from-white to-purple-50';
      case 'push':
        return 'border-green-200 bg-gradient-to-br from-white to-green-50';
      case 'in-app':
        return 'border-yellow-200 bg-gradient-to-br from-white to-yellow-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'broadcast':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'email':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'push':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-app':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderNotificationCard = (notification, index) => (
    <motion.div
      key={notification._id || notification.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`${getTypeColor(notification.type)} rounded-xl sm:rounded-2xl shadow-lg border-2 p-3 sm:p-4 md:p-5 lg:p-6`}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0"
          >
            <HiSpeakerphone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">{notification.title}</h4>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold border ${getStatusBadgeColor(notification.status)}`}>
                {notification.status.toUpperCase()}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold border ${getTypeBadgeColor(notification.type)}`}>
                {notification.type}
              </span>
              {notification.target && notification.target !== 'all' && (
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                  {notification.target}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEdit(notification)}
            disabled={sending}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit"
          >
            <HiPencil className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(notification._id || notification.id)}
            disabled={sending}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete"
          >
            <HiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>
      <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-2 sm:mb-3 md:mb-4 leading-relaxed line-clamp-3">{notification.message}</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600 pt-2 sm:pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1.5">
          <HiCalendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-400" />
          <span className="font-medium">Created:</span>
          <span>{formatDate(notification.createdAt)}</span>
        </div>
        {notification.scheduledAt && (
          <div className="flex items-center gap-1.5">
            <HiClock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-400" />
            <span className="font-medium">Scheduled:</span>
            <span>{formatDate(notification.scheduledAt)}</span>
          </div>
        )}
        {notification.sentAt && (
          <div className="flex items-center gap-1.5">
            <HiPaperAirplane className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-400" />
            <span className="font-medium">Sent:</span>
            <span>{formatDate(notification.sentAt)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base flex items-center justify-between"
        >
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-4 hover:bg-red-100 rounded p-1"
          >
            <HiX className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Announcements</h2>
          <p className="text-[10px] sm:text-xs md:text-sm text-white/70 mt-1">Manage system-wide announcements and notifications</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchNotifications}
            disabled={loading}
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <HiRefresh className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateNew}
            className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <HiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Create Announcement</span>
          </motion.button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Active Announcements */}
      {!loading && (
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3 md:mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-500 flex items-center justify-center shadow-lg">
              <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">Active Announcements</h3>
            <span className="px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-green-100 text-green-700">
              {activeNotifications.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {activeNotifications.map((notification, index) => renderNotificationCard(notification, index))}
          </div>
          {activeNotifications.length === 0 && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <HiSpeakerphone className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400" />
              </div>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-2">No active announcements</p>
              <p className="text-xs sm:text-sm md:text-base text-gray-500">Create your first announcement to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Scheduled Announcements */}
      {!loading && scheduledNotifications.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3 md:mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg">
              <HiClock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">Scheduled Announcements</h3>
            <span className="px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-blue-100 text-blue-700">
              {scheduledNotifications.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {scheduledNotifications.map((notification, index) => renderNotificationCard(notification, index))}
          </div>
        </div>
      )}

      {/* Draft Announcements */}
      {!loading && draftNotifications.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3 md:mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-500 flex items-center justify-center shadow-lg">
              <HiClock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">Draft Announcements</h3>
            <span className="px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gray-100 text-gray-700">
              {draftNotifications.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {draftNotifications.map((notification, index) => renderNotificationCard(notification, index))}
          </div>
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
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {editingNotification ? 'Edit Announcement' : 'Create New Announcement'}
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
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Announcement title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="4"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                      placeholder="Announcement message"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                        <option value="broadcast">Broadcast</option>
                        <option value="email">Email</option>
                        <option value="push">Push Notification</option>
                        <option value="in-app">In-App</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Target Audience *
                      </label>
                      <select
                        required
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="all">All Users</option>
                        <option value="premium">Premium Users</option>
                        <option value="free">Free Users</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="checkbox"
                      id="sendNow"
                      checked={formData.sendNow}
                      onChange={(e) => setFormData({ ...formData, sendNow: e.target.checked, scheduledAt: e.target.checked ? '' : formData.scheduledAt })}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="sendNow" className="text-sm sm:text-base font-semibold text-gray-700">
                      Send immediately
                    </label>
                  </div>

                  {!formData.sendNow && (
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Schedule Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        required={!formData.sendNow}
                        value={formData.scheduledAt}
                        onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowModal(false)}
                      disabled={sending}
                      className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-semibold transition-colors text-sm sm:text-base disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={sending}
                      className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <HiSave className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>{editingNotification ? 'Update' : formData.sendNow ? 'Send Now' : 'Schedule'}</span>
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

export default memo(AnnouncementsComponent);
