import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HiSearch,
  HiPlus,
  HiPencil,
  HiTrash,
  HiFilter,
  HiLightningBolt,
  HiCheckCircle,
  HiXCircle,
} from 'react-icons/hi';

const SimulationsComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  // Mock simulation data - replace with actual API call
  const simulations = useMemo(
    () => [
      {
        id: 1,
        title: 'Mindful Decision Challenge',
        description: 'Make thoughtful choices under pressure and master calm decision-making.',
        difficulty: 'Medium',
        xpReward: 150,
        steps: 2,
        completions: 1247,
        status: 'active',
        createdDate: '2024-10-15',
      },
      {
        id: 2,
        title: 'Creative Sprint Simulation',
        description: 'Navigate a 48-hour sprint to craft an engaging product concept.',
        difficulty: 'Hard',
        xpReward: 240,
        steps: 3,
        completions: 892,
        status: 'active',
        createdDate: '2024-10-10',
      },
      {
        id: 3,
        title: 'Empathy Feedback Loop',
        description: 'Practice delivering and receiving feedback in a collaborative setting.',
        difficulty: 'Easy',
        xpReward: 120,
        steps: 2,
        completions: 2156,
        status: 'active',
        createdDate: '2024-09-20',
      },
      {
        id: 4,
        title: 'Leadership Crisis Management',
        description: 'Handle team conflicts and make strategic decisions under pressure.',
        difficulty: 'Hard',
        xpReward: 300,
        steps: 4,
        completions: 634,
        status: 'draft',
        createdDate: '2024-11-15',
      },
    ],
    [],
  );

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const filteredSimulations = useMemo(() => {
    return simulations.filter((sim) => {
      const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterDifficulty === 'all' || sim.difficulty === filterDifficulty;
      return matchesSearch && matchesFilter;
    });
  }, [simulations, searchQuery, filterDifficulty]);

  const handleEdit = (simId) => {
    console.log('Edit simulation:', simId);
  };

  const handleDelete = (simId) => {
    if (window.confirm('Are you sure you want to delete this simulation?')) {
      console.log('Delete simulation:', simId);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search simulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'all' ? 'All Difficulties' : diff}
                </option>
              ))}
            </select>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <HiPlus className="w-5 h-5 inline mr-2" />
          Add Simulation
        </motion.button>
      </div>

      {/* Simulations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSimulations.map((sim, index) => (
          <motion.div
            key={sim.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <HiLightningBolt className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                {sim.status === 'active' ? (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
                    <HiCheckCircle className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 flex items-center gap-1">
                    <HiXCircle className="w-3 h-3" />
                    Draft
                  </span>
                )}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(sim.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <HiPencil className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(sim.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <HiTrash className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{sim.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{sim.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Difficulty:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(sim.difficulty)}`}>
                  {sim.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">XP Reward:</span>
                <span className="font-medium text-gray-900">{sim.xpReward} XP</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Steps:</span>
                <span className="font-medium text-gray-900">{sim.steps}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completions:</span>
                <span className="font-medium text-gray-900">{sim.completions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">{sim.createdDate}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSimulations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-200">
          <p className="text-gray-500">No simulations found</p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Total Simulations</p>
          <p className="text-3xl font-bold text-gray-900">{simulations.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Active Simulations</p>
          <p className="text-3xl font-bold text-green-600">
            {simulations.filter((s) => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Total Completions</p>
          <p className="text-3xl font-bold text-blue-600">
            {simulations.reduce((sum, s) => sum + s.completions, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Draft Simulations</p>
          <p className="text-3xl font-bold text-gray-600">
            {simulations.filter((s) => s.status === 'draft').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(SimulationsComponent);











