import React, { memo, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  HiX,
  HiSave,
} from 'react-icons/hi';
import { API_BASE_URL, apiRequest, getAuthHeaders } from '../config/api.js';

const QuizzesComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'medium',
    thumbnail: '',
    totalPoints: '',
  });
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    questionType: 'mcq',
    options: [{ text: '', isCorrect: false }],
    correctAnswers: [],
    points: 10,
    explanation: '',
    media: '',
    order: 0,
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // Fetch quizzes from API
  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterStatus !== 'all') params.append('isPublished', filterStatus === 'published' ? 'true' : 'false');
      
      const response = await fetch(`${API_BASE_URL}/quizzes?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        setQuizzes(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch quizzes');
      }
    } catch (err) {
      setError(err.message || 'Failed to load quizzes');
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterCategory, filterStatus]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // Get unique categories from quizzes
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(quizzes.map(q => q.category).filter(Boolean))];
    return cats;
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || quiz.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'published' && quiz.isPublished) ||
                           (filterStatus === 'draft' && !quiz.isPublished);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [quizzes, searchQuery, filterCategory, filterStatus]);

  // Fetch questions for a quiz
  const fetchQuestions = useCallback(async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success && data.data.questions) {
        setQuestions(data.data.questions);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  }, []);

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title || '',
      description: quiz.description || '',
      category: quiz.category || '',
      difficulty: quiz.difficulty || 'medium',
      thumbnail: quiz.thumbnail || '',
      totalPoints: quiz.totalPoints?.toString() || '',
    });
    setShowQuizModal(true);
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz? All associated questions will also be deleted.')) {
      return;
    }

    try {
      setError('');
      await apiRequest(`${API_BASE_URL}/quizzes/${quizId}`, {
        method: 'DELETE',
      });
      await fetchQuizzes();
    } catch (err) {
      setError(err.message || 'Failed to delete quiz');
    }
  };

  const handleTogglePublish = async (quizId, currentStatus) => {
    try {
      setError('');
      await apiRequest(`${API_BASE_URL}/quizzes/${quizId}/publish`, {
        method: 'PATCH',
      });
      await fetchQuizzes();
    } catch (err) {
      setError(err.message || 'Failed to update quiz status');
    }
  };

  const handleViewQuestions = async (quiz) => {
    setCurrentQuiz(quiz);
    await fetchQuestions(quiz._id || quiz.id);
    setShowQuestionsModal(true);
  };

  const handleCreateNew = () => {
    setEditingQuiz(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      difficulty: 'medium',
      thumbnail: '',
      totalPoints: '',
    });
    setShowQuizModal(true);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        thumbnail: formData.thumbnail || undefined,
        totalPoints: formData.totalPoints ? parseInt(formData.totalPoints) : 0,
      };

      if (editingQuiz) {
        await apiRequest(`${API_BASE_URL}/quizzes/${editingQuiz._id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest(`${API_BASE_URL}/quizzes`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setShowQuizModal(false);
      await fetchQuizzes();
    } catch (err) {
      setError(err.message || `Failed to ${editingQuiz ? 'update' : 'create'} quiz`);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionForm(true);
    setQuestionForm({
      questionText: '',
      questionType: 'mcq',
      options: [{ text: '', isCorrect: false }],
      correctAnswers: [],
      points: 10,
      explanation: '',
      media: '',
      order: questions.length,
    });
  };

  const handleCancelQuestionForm = () => {
    setEditingQuestion(null);
    setShowQuestionForm(false);
    setQuestionForm({
      questionText: '',
      questionType: 'mcq',
      options: [{ text: '', isCorrect: false }],
      correctAnswers: [],
      points: 10,
      explanation: '',
      media: '',
      order: questions.length,
    });
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
    // Map options correctly - handle both array of objects and array of strings
    const mappedOptions = question.options && question.options.length > 0
      ? question.options.map(opt => 
          typeof opt === 'string' 
            ? { text: opt, isCorrect: question.correctAnswers?.includes(opt) || false }
            : { text: opt.text || opt, isCorrect: opt.isCorrect || false }
        )
      : [{ text: '', isCorrect: false }];
    
    setQuestionForm({
      questionText: question.questionText || '',
      questionType: question.questionType || 'mcq',
      options: mappedOptions,
      correctAnswers: question.correctAnswers || [],
      points: question.points || 10,
      explanation: question.explanation || '',
      media: question.media || '',
      order: question.order || 0,
    });
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      setError('');
      await apiRequest(`${API_BASE_URL}/quizzes/questions/${questionId}`, {
        method: 'DELETE',
      });
      await fetchQuestions(currentQuiz._id || currentQuiz.id);
    } catch (err) {
      setError(err.message || 'Failed to delete question');
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      // Extract correct answers from options
      const correctAnswers = questionForm.options
        .map((option, index) => option.isCorrect ? index.toString() : null)
        .filter(Boolean);
      
      const payload = {
        questionText: questionForm.questionText,
        questionType: questionForm.questionType,
        options: questionForm.options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect })),
        correctAnswers: correctAnswers,
        points: parseInt(questionForm.points),
        explanation: questionForm.explanation,
        media: questionForm.media || undefined,
        order: parseInt(questionForm.order),
      };

      if (editingQuestion) {
        await apiRequest(`${API_BASE_URL}/quizzes/questions/${editingQuestion._id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest(`${API_BASE_URL}/quizzes/${currentQuiz._id || currentQuiz.id}/questions`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

                      handleCancelQuestionForm();
                      setShowQuestionForm(false);
                      await fetchQuestions(currentQuiz._id || currentQuiz.id);
                      await fetchQuizzes();
    } catch (err) {
      setError(err.message || `Failed to ${editingQuestion ? 'update' : 'create'} question`);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    return difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Medium';
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
              placeholder="Search quizzes..."
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto min-w-[140px] px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateNew}
          className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <HiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Create New Quiz</span>
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Quizzes Grid */}
      {!loading && (
        <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4">
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz._id || quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Quiz Icon/Thumbnail */}
                  <div className="w-full sm:w-20 md:w-24 h-32 sm:h-20 md:h-24 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <HiAcademicCap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>

                  {/* Quiz Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 flex-1 line-clamp-2">
                            {quiz.title}
                          </h3>
                          {quiz.isPublished ? (
                            <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0" />
                          ) : (
                            <HiXCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold border ${getDifficultyColor(quiz.difficulty)}`}>
                            {getDifficultyLabel(quiz.difficulty)}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[9px] sm:text-[10px] md:text-xs font-semibold">
                            {quiz.category}
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            {quiz.totalQuestions || 0} Questions
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            {quiz.totalPoints || 0} Points
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mb-0.5">Attempts</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                          {(quiz.attempts || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mb-0.5">Avg Score</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                          {quiz.averageScore ? `${quiz.averageScore.toFixed(1)}%` : '0%'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mb-0.5">Completion</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                          {quiz.completionRate ? `${quiz.completionRate.toFixed(1)}%` : '0%'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mb-0.5">Status</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 capitalize">
                          {quiz.isPublished ? 'Published' : 'Draft'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(quiz)}
                        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition-colors text-[10px] sm:text-xs md:text-sm border border-blue-200"
                      >
                        <HiPencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        <span>Edit</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewQuestions(quiz)}
                        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-semibold transition-colors text-[10px] sm:text-xs md:text-sm border border-purple-200"
                      >
                        <HiClipboardList className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        <span>Questions</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTogglePublish(quiz._id || quiz.id, quiz.isPublished)}
                        className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg font-semibold transition-colors text-[10px] sm:text-xs md:text-sm border ${
                          quiz.isPublished
                            ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                        }`}
                      >
                        {quiz.isPublished ? (
                          <>
                            <HiEyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                            <span>Unpublish</span>
                          </>
                        ) : (
                          <>
                            <HiEye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                            <span>Publish</span>
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(quiz._id || quiz.id)}
                        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold transition-colors text-[10px] sm:text-xs md:text-sm border border-red-200"
                      >
                        <HiTrash className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        <span>Delete</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredQuizzes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 text-center border border-gray-200"
        >
          <HiAcademicCap className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 mb-2">No quizzes found</p>
          <p className="text-xs sm:text-sm md:text-base text-gray-500">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* Create/Edit Quiz Modal */}
      <AnimatePresence>
        {showQuizModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
            onClick={() => setShowQuizModal(false)}
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
                    {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                  </h2>
                  <button
                    onClick={() => setShowQuizModal(false)}
                    className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <HiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleQuizSubmit} className="space-y-3 sm:space-y-4">
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
                      placeholder="Quiz title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                      placeholder="Quiz description"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                        placeholder="e.g., Programming"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Difficulty *
                      </label>
                      <select
                        required
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowQuizModal(false)}
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
                      <span>{editingQuiz ? 'Update' : 'Create'}</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions Management Modal */}
      <AnimatePresence>
        {showQuestionsModal && currentQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
            onClick={() => {
              setShowQuestionsModal(false);
              setCurrentQuiz(null);
              setQuestions([]);
              setEditingQuestion(null);
              setShowQuestionForm(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      Manage Questions: {currentQuiz.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {questions.length} question{questions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowQuestionsModal(false);
                      setCurrentQuiz(null);
                      setQuestions([]);
                      setEditingQuestion(null);
                      setShowQuestionForm(false);
                    }}
                    className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <HiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                  </button>
                </div>

                <div className="mb-4 sm:mb-5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddQuestion}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center gap-2"
                  >
                    <HiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Add Question</span>
                  </motion.button>
                </div>

                {/* Question Form */}
                {showQuestionForm && (
                  <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">
                      {editingQuestion ? 'Edit Question' : 'New Question'}
                    </h3>
                    <form onSubmit={handleQuestionSubmit} className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          Question Text *
                        </label>
                        <textarea
                          required
                          value={questionForm.questionText}
                          onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                          rows="3"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                          placeholder="Enter question text"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            Question Type
                          </label>
                          <select
                            value={questionForm.questionType}
                            onChange={(e) => setQuestionForm({ ...questionForm, questionType: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                          >
                            <option value="mcq">Multiple Choice</option>
                            <option value="single-choice">Single Choice</option>
                            <option value="multi-choice">Multi Choice</option>
                            <option value="scenario-based">Scenario Based</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            Points
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={questionForm.points}
                            onChange={(e) => setQuestionForm({ ...questionForm, points: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          Options *
                        </label>
                        {questionForm.options.map((option, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              required
                              value={option.text}
                              onChange={(e) => {
                                const newOptions = [...questionForm.options];
                                newOptions[index].text = e.target.value;
                                setQuestionForm({ ...questionForm, options: newOptions });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder={`Option ${index + 1}`}
                            />
                            <label className="flex items-center gap-1 px-3 py-2">
                              <input
                                type="checkbox"
                                checked={option.isCorrect}
                                onChange={(e) => {
                                  const newOptions = [...questionForm.options];
                                  newOptions[index].isCorrect = e.target.checked;
                                  setQuestionForm({ ...questionForm, options: newOptions });
                                }}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-xs sm:text-sm text-gray-700">Correct</span>
                            </label>
                            {questionForm.options.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = questionForm.options.filter((_, i) => i !== index);
                                  setQuestionForm({ ...questionForm, options: newOptions });
                                }}
                                className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <HiX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setQuestionForm({ ...questionForm, options: [...questionForm.options, { text: '', isCorrect: false }] })}
                          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          + Add Option
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          Explanation
                        </label>
                        <textarea
                          value={questionForm.explanation}
                          onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                          rows="2"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                          placeholder="Explanation for the answer"
                        />
                      </div>

                      <div className="flex gap-2 sm:gap-3">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCancelQuestionForm}
                          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors text-sm"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-sm flex items-center justify-center gap-2"
                        >
                          <HiSave className="w-4 h-4" />
                          <span>{editingQuestion ? 'Update' : 'Add'}</span>
                        </motion.button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Questions List */}
                <div className="space-y-2 sm:space-y-3">
                  {questions.map((question, index) => (
                    <div key={question._id || question.id} className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl">
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <span className="text-xs sm:text-sm font-bold text-gray-500">Q{index + 1}</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-600">{question.points} pts</span>
                          </div>
                          <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                            {question.questionText}
                          </p>
                          <div className="text-[10px] sm:text-xs text-gray-600">
                            {question.options?.length || 0} options
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditQuestion(question)}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <HiPencil className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteQuestion(question._id || question.id)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <HiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                      <HiClipboardList className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                      <p className="text-sm sm:text-base font-semibold text-gray-600 mb-2">No questions yet</p>
                      <p className="text-xs sm:text-sm text-gray-500">Click "Add Question" to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(QuizzesComponent);
