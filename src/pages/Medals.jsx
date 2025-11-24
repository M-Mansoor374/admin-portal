import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
} from 'react-icons/hi';

const MedalsComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock medals data - replace with actual API call
  const medals = useMemo(
    () => [
      {
        id: 1,
        name: 'First Steps',
        description: 'Complete your first quiz',
        xpRequirement: 50,
        icon: 'star',
        status: 'active',
        usersUnlocked: 1247,
        createdDate: '2024-10-15',
        color: 'blue',
      },
      {
        id: 2,
        name: 'Streak Master',
        description: 'Maintain a 7-day learning streak',
        xpRequirement: 200,
        icon: 'fire',
        status: 'active',
        usersUnlocked: 892,
        createdDate: '2024-10-10',
        color: 'orange',
      },
      {
        id: 3,
        name: 'Quiz Champion',
        description: 'Complete 10 quizzes with 90%+ score',
        xpRequirement: 500,
        icon: 'trophy',
        status: 'active',
        usersUnlocked: 456,
        createdDate: '2024-09-20',
        color: 'yellow',
      },
      {
        id: 4,
        name: 'Knowledge Seeker',
        description: 'Earn 1000 total XP',
        xpRequirement: 1000,
        icon: 'badge',
        status: 'active',
        usersUnlocked: 234,
        createdDate: '2024-09-15',
        color: 'purple',
      },
      {
        id: 5,
        name: 'Elite Scholar',
        description: 'Reach level 10',
        xpRequirement: 2000,
        icon: 'shield',
        status: 'active',
        usersUnlocked: 89,
        createdDate: '2024-08-10',
        color: 'indigo',
      },
      {
        id: 6,
        name: 'Early Bird',
        description: 'Complete a quiz before 8 AM',
        xpRequirement: 100,
        icon: 'sparkles',
        status: 'inactive',
        usersUnlocked: 567,
        createdDate: '2024-11-01',
        color: 'pink',
      },
    ],
    [],
  );

  const filteredMedals = useMemo(() => {
    return medals.filter((medal) => {
      const matchesSearch = medal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          medal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || medal.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [medals, searchQuery, filterStatus]);

  const handleEdit = (medalId) => {
    console.log('Edit medal:', medalId);
  };

  const handleDelete = (medalId) => {
    if (window.confirm('Are you sure you want to delete this medal?')) {
      console.log('Delete medal:', medalId);
    }
  };

  const handleToggleStatus = (medalId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log(`Toggle medal ${medalId} to ${newStatus}`);
  };

  const handleBack = () => {
    window.history.back();
  };

  const getIcon = (iconName) => {
    const iconProps = { className: 'w-8 h-8 sm:w-10 sm:h-10 text-white' };
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
              placeholder="Search medals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <HiPlus className="w-5 h-5" />
          Create New Medal
        </motion.button>
      </div>

      {/* Medals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {filteredMedals.map((medal, index) => (
          <motion.div
            key={medal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-4 sm:p-5">
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                {medal.status === 'active' ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                    <HiCheckCircle className="w-3.5 h-3.5" />
                    Active
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-semibold border border-gray-200">
                    <HiXCircle className="w-3.5 h-3.5" />
                    Inactive
                  </div>
                )}
              </div>

              {/* Medal Icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${getColorGradient(medal.color)} flex items-center justify-center shadow-lg`}
                >
                  {getIcon(medal.icon)}
                </motion.div>
              </div>

              {/* Medal Info */}
              <div className="text-center mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                  {medal.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {medal.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                  <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5">XP Required</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {medal.xpRequirement}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                  <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 flex items-center justify-center gap-1">
                    <HiUsers className="w-3 h-3" />
                    Unlocked
                  </p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {medal.usersUnlocked.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(medal.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition-colors text-xs sm:text-sm border border-blue-200"
                  >
                    <HiPencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(medal.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold transition-colors text-xs sm:text-sm border border-red-200"
                  >
                    <HiTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Delete
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToggleStatus(medal.id, medal.status)}
                  className={`w-full px-3 py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm border ${
                    medal.status === 'active'
                      ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
                      : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                  }`}
                >
                  {medal.status === 'active' ? 'Deactivate' : 'Activate'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMedals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-200"
        >
          <HiBadgeCheck className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-base sm:text-lg font-semibold text-gray-600">No medals found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
};

export default memo(MedalsComponent);

