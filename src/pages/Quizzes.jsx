import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HiSearch,
  HiPlus,
  HiPencil,
  HiTrash,
  HiFilter,
  HiEye,
  HiEyeOff,
  HiChartBar,
  HiArrowLeft,
  HiCheckCircle,
  HiXCircle,
  HiClipboardList,
  HiAcademicCap,
} from 'react-icons/hi';

const QuizzesComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock quiz data - replace with actual API call
  const quizzes = useMemo(
    () => [
      {
        id: 1,
        title: 'JavaScript Fundamentals',
        category: 'Programming',
        difficulty: 'Easy',
        totalQuestions: 20,
        points: 100,
        attempts: 1247,
        avgScore: 78.5,
        completionRate: 85.2,
        status: 'published',
        thumbnail: null,
        createdDate: '2024-10-15',
      },
      {
        id: 2,
        title: 'React Advanced Concepts',
        category: 'Programming',
        difficulty: 'Hard',
        totalQuestions: 30,
        points: 200,
        attempts: 892,
        avgScore: 65.3,
        completionRate: 72.8,
        status: 'published',
        thumbnail: null,
        createdDate: '2024-10-10',
      },
      {
        id: 3,
        title: 'Web Design Principles',
        category: 'Design',
        difficulty: 'Medium',
        totalQuestions: 25,
        points: 150,
        attempts: 2156,
        avgScore: 81.2,
        completionRate: 88.5,
        status: 'published',
        thumbnail: null,
        createdDate: '2024-09-20',
      },
      {
        id: 4,
        title: 'Database Management',
        category: 'Backend',
        difficulty: 'Medium',
        totalQuestions: 22,
        points: 130,
        attempts: 634,
        avgScore: 70.8,
        completionRate: 80.1,
        status: 'draft',
        thumbnail: null,
        createdDate: '2024-11-15',
      },
    ],
    [],
  );

  const categories = ['all', 'Programming', 'Design', 'Backend', 'Frontend', 'DevOps'];

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || quiz.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || quiz.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [quizzes, searchQuery, filterCategory, filterStatus]);

  const handleEdit = (quizId) => {
    console.log('Edit quiz:', quizId);
  };

  const handleDelete = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      console.log('Delete quiz:', quizId);
    }
  };

  const handleTogglePublish = (quizId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    console.log(`Toggle quiz ${quizId} to ${newStatus}`);
  };

  const handleViewAnalytics = (quizId) => {
    console.log('View analytics for quiz:', quizId);
  };

  const handleAddQuestion = (quizId) => {
    console.log('Add question to quiz:', quizId);
  };

  const handleBack = () => {
    window.history.back();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard':
        return 'bg-red-100 text-red-700 border-red-200';
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
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
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
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <HiPlus className="w-5 h-5" />
          Create New Quiz
        </motion.button>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {filteredQuizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quiz Icon/Thumbnail */}
                <div className="w-full sm:w-20 md:w-24 h-32 sm:h-20 md:h-24 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <HiAcademicCap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>

                {/* Quiz Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 flex-1">
                          {quiz.title}
                        </h3>
                        {quiz.status === 'published' ? (
                          <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                        ) : (
                          <HiXCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] sm:text-xs font-semibold">
                          {quiz.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {quiz.totalQuestions} Questions
                        </span>
                        <span className="text-xs text-gray-500">
                          {quiz.points} Points
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5">Attempts</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        {quiz.attempts.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5">Avg Score</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">{quiz.avgScore}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5">Completion</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        {quiz.completionRate}%
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5">Status</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900 capitalize">
                        {quiz.status}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(quiz.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition-colors text-xs sm:text-sm border border-blue-200"
                    >
                      <HiPencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddQuestion(quiz.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-semibold transition-colors text-xs sm:text-sm border border-purple-200"
                    >
                      <HiClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Questions
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTogglePublish(quiz.id, quiz.status)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm border ${
                        quiz.status === 'published'
                          ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
                          : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                      }`}
                    >
                      {quiz.status === 'published' ? (
                        <>
                          <HiEyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <HiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Publish
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewAnalytics(quiz.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors text-xs sm:text-sm border border-emerald-200"
                    >
                      <HiChartBar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Analytics
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(quiz.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold transition-colors text-xs sm:text-sm border border-red-200"
                    >
                      <HiTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-200"
        >
          <HiAcademicCap className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-base sm:text-lg font-semibold text-gray-600">No quizzes found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
};

export default memo(QuizzesComponent);

