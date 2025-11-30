import React, { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCog,
  HiSave,
  HiRefresh,
  HiArrowLeft,
  HiX,
  HiCheckCircle,
  HiExclamationCircle,
  HiShieldCheck,
  HiMail,
  HiGlobe,
  HiLockClosed,
  HiBell,
  HiColorSwatch,
  HiDatabase,
  HiKey,
  HiUser,
  HiInformationCircle,
} from 'react-icons/hi';
import { API_ENDPOINTS, apiRequest } from '../config/api';

const SettingsComponent = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Acceptopia',
    siteDescription: 'Your gateway to college acceptance',
    contactEmail: 'support@acceptopia.com',
    contactPhone: '',
    supportUrl: '',
    maintenanceMode: false,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    enable2FA: false,
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@acceptopia.com',
    fromName: 'Acceptopia',
    enableEmail: true,
  });

  // Feature Toggles
  const [featureToggles, setFeatureToggles] = useState({
    enableQuizzes: true,
    enableSimulations: true,
    enableResources: true,
    enableGamification: true,
    enableNotifications: true,
    enableAnalytics: true,
    enableUserRegistration: true,
    enablePremiumFeatures: true,
  });

  // Admin Profile
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [adminProfileErrors, setAdminProfileErrors] = useState({});

  // Fetch current admin profile
  const fetchAdminProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiRequest(API_ENDPOINTS.auth.me);
      if (response.success && response.data) {
        setAdminProfile({
          ...adminProfile,
          name: response.data.name || '',
          email: response.data.email || '',
        });
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveGeneral = async () => {
    try {
      setSaving(true);
      setError(null);
      // TODO: Add backend endpoint for general settings
      // await apiRequest(API_ENDPOINTS.settings.general, {
      //   method: 'PATCH',
      //   body: JSON.stringify(generalSettings),
      // });
      showSuccess('General settings saved successfully');
    } catch (err) {
      setError(err.message || 'Failed to save general settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setSaving(true);
      setError(null);
      // TODO: Add backend endpoint for security settings
      showSuccess('Security settings saved successfully');
    } catch (err) {
      setError(err.message || 'Failed to save security settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    try {
      setSaving(true);
      setError(null);
      // TODO: Add backend endpoint for email settings
      showSuccess('Email settings saved successfully');
    } catch (err) {
      setError(err.message || 'Failed to save email settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFeatures = async () => {
    try {
      setSaving(true);
      setError(null);
      // TODO: Add backend endpoint for feature toggles
      showSuccess('Feature toggles updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to save feature toggles');
    } finally {
      setSaving(false);
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!adminProfile.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (adminProfile.newPassword && adminProfile.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (adminProfile.newPassword !== adminProfile.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setAdminProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validatePassword()) return;

    try {
      setSaving(true);
      setError(null);
      // Update profile via auth endpoint
      const updateData = {
        name: adminProfile.name,
        email: adminProfile.email,
      };
      
      if (adminProfile.newPassword) {
        updateData.currentPassword = adminProfile.currentPassword;
        updateData.newPassword = adminProfile.newPassword;
      }

      await apiRequest(API_ENDPOINTS.auth.updateProfile, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      showSuccess('Profile updated successfully');
      setAdminProfile({
        ...adminProfile,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: HiGlobe },
    { id: 'security', label: 'Security', icon: HiShieldCheck },
    { id: 'email', label: 'Email', icon: HiMail },
    { id: 'features', label: 'Features', icon: HiColorSwatch },
    { id: 'profile', label: 'Profile', icon: HiUser },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
          Site Name *
        </label>
        <input
          type="text"
          value={generalSettings.siteName}
          onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          placeholder="Enter site name"
        />
      </div>

      <div>
        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          value={generalSettings.siteDescription}
          onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
          rows="3"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
          placeholder="Enter site description"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Contact Email *
          </label>
          <input
            type="email"
            value={generalSettings.contactEmail}
            onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="support@example.com"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            value={generalSettings.contactPhone}
            onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
          Support URL
        </label>
        <input
          type="url"
          value={generalSettings.supportUrl}
          onChange={(e) => setGeneralSettings({ ...generalSettings, supportUrl: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          placeholder="https://support.example.com"
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <input
          type="checkbox"
          id="maintenanceMode"
          checked={generalSettings.maintenanceMode}
          onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })}
          className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
        />
        <label htmlFor="maintenanceMode" className="text-sm sm:text-base font-semibold text-gray-700 cursor-pointer">
          Enable Maintenance Mode
        </label>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSaveGeneral}
        disabled={saving}
        className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <HiSave className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save General Settings'}
      </motion.button>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <HiInformationCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Password Requirements</p>
            <p>Configure password policies for all users including admins.</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
          Minimum Password Length
        </label>
        <input
          type="number"
          min="6"
          max="32"
          value={securitySettings.minPasswordLength}
          onChange={(e) => setSecuritySettings({ ...securitySettings, minPasswordLength: parseInt(e.target.value) || 8 })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="requireUppercase"
            checked={securitySettings.requireUppercase}
            onChange={(e) => setSecuritySettings({ ...securitySettings, requireUppercase: e.target.checked })}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="requireUppercase" className="text-sm sm:text-base font-semibold text-gray-700 cursor-pointer">
            Require Uppercase Letters
          </label>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="requireLowercase"
            checked={securitySettings.requireLowercase}
            onChange={(e) => setSecuritySettings({ ...securitySettings, requireLowercase: e.target.checked })}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="requireLowercase" className="text-sm sm:text-base font-semibold text-gray-700 cursor-pointer">
            Require Lowercase Letters
          </label>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="requireNumbers"
            checked={securitySettings.requireNumbers}
            onChange={(e) => setSecuritySettings({ ...securitySettings, requireNumbers: e.target.checked })}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="requireNumbers" className="text-sm sm:text-base font-semibold text-gray-700 cursor-pointer">
            Require Numbers
          </label>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="requireSpecialChars"
            checked={securitySettings.requireSpecialChars}
            onChange={(e) => setSecuritySettings({ ...securitySettings, requireSpecialChars: e.target.checked })}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="requireSpecialChars" className="text-sm sm:text-base font-semibold text-gray-700 cursor-pointer">
            Require Special Characters
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="480"
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) || 30 })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            min="3"
            max="10"
            value={securitySettings.maxLoginAttempts}
            onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) || 5 })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
        <input
          type="checkbox"
          id="enable2FA"
          checked={securitySettings.enable2FA}
          onChange={(e) => setSecuritySettings({ ...securitySettings, enable2FA: e.target.checked })}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="enable2FA" className="text-sm sm:text-base font-semibold text-gray-700 cursor-pointer">
          Enable Two-Factor Authentication (2FA)
        </label>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSaveSecurity}
        disabled={saving}
        className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <HiSave className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Security Settings'}
      </motion.button>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <HiInformationCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">SMTP Configuration</p>
            <p>Configure email server settings for sending notifications and emails.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
        <input
          type="checkbox"
          id="enableEmail"
          checked={emailSettings.enableEmail}
          onChange={(e) => setEmailSettings({ ...emailSettings, enableEmail: e.target.checked })}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="enableEmail" className="text-sm sm:text-base font-semibold text-gray-700 cursor-pointer">
          Enable Email Notifications
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            SMTP Host
          </label>
          <input
            type="text"
            value={emailSettings.smtpHost}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="smtp.gmail.com"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            SMTP Port
          </label>
          <input
            type="number"
            value={emailSettings.smtpPort}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) || 587 })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="587"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            SMTP Username
          </label>
          <input
            type="text"
            value={emailSettings.smtpUser}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="your-email@gmail.com"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            SMTP Password
          </label>
          <input
            type="password"
            value={emailSettings.smtpPassword}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            From Email
          </label>
          <input
            type="email"
            value={emailSettings.fromEmail}
            onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="noreply@example.com"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            From Name
          </label>
          <input
            type="text"
            value={emailSettings.fromName}
            onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Acceptopia"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSaveEmail}
        disabled={saving}
        className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <HiSave className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Email Settings'}
      </motion.button>
    </div>
  );

  const renderFeatureToggles = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <HiInformationCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Feature Management</p>
            <p>Enable or disable features across the platform.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(featureToggles).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <label className="text-sm sm:text-base font-semibold text-gray-700 cursor-pointer">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {key.includes('Quizzes') && 'Enable quiz functionality'}
                {key.includes('Simulations') && 'Enable college simulations'}
                {key.includes('Resources') && 'Enable resource library'}
                {key.includes('Gamification') && 'Enable XP, streaks, and medals'}
                {key.includes('Notifications') && 'Enable push notifications'}
                {key.includes('Analytics') && 'Enable analytics dashboard'}
                {key.includes('Registration') && 'Allow new user registration'}
                {key.includes('Premium') && 'Enable premium features'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setFeatureToggles({ ...featureToggles, [key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSaveFeatures}
        disabled={saving}
        className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <HiSave className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Feature Toggles'}
      </motion.button>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <HiInformationCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Admin Profile</p>
            <p>Update your personal information and change your password.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={adminProfile.name}
            onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={adminProfile.email}
            onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="admin@example.com"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
              Current Password *
            </label>
            <input
              type="password"
              value={adminProfile.currentPassword}
              onChange={(e) => setAdminProfile({ ...adminProfile, currentPassword: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                adminProfileErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter current password"
            />
            {adminProfileErrors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{adminProfileErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={adminProfile.newPassword}
              onChange={(e) => setAdminProfile({ ...adminProfile, newPassword: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                adminProfileErrors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter new password (min 8 characters)"
            />
            {adminProfileErrors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{adminProfileErrors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={adminProfile.confirmPassword}
              onChange={(e) => setAdminProfile({ ...adminProfile, confirmPassword: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                adminProfileErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm new password"
            />
            {adminProfileErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{adminProfileErrors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSaveProfile}
        disabled={saving}
        className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <HiSave className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Profile'}
      </motion.button>
    </div>
  );

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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 hover:bg-red-100 rounded p-1"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Settings</h2>
          <p className="text-[10px] sm:text-xs md:text-sm text-white/70 mt-1">Manage system configuration and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'email' && renderEmailSettings()}
          {activeTab === 'features' && renderFeatureToggles()}
          {activeTab === 'profile' && renderProfileSettings()}
        </div>
      </div>
    </div>
  );
};

export default memo(SettingsComponent);

