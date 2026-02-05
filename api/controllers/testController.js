/**
 * Test Controller
 * Handles test generation, random questions, and test results
 */

const Word = require('../models/Word');
const Test = require('../models/Test');
const TestResult = require('../models/TestResult');
const WordSet = require('../models/WordSet');
const Progress = require('../models/Progress');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

/**
 * Generate random test questions
 * GET /api/tests/random
 */
const generateRandomTest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { count = 20, difficulty = 'mixed', category } = req.query;
    
    const questionCount = Math.min(parseInt(count), 100); // Max 100 questions
    
    // Build query for words
    let wordQuery = {
      $or: [
        { createdBy: userId },
        { isPublic: true }
      ]
    };
    
    // Filter by difficulty
    if (difficulty !== 'mixed') {
      const difficultyMap = {
        '1': [1, 2],
        '2': [2, 3, 4],
        '3': [4, 5]
      };
      
      const difficultyRange = difficultyMap[difficulty] || [1, 5];
      wordQuery.difficulty = { $gte: difficultyRange[0], $lte: difficultyRange[1] };
    }
    
    // Filter by category if provided
    if (category && category !== 'all') {
      wordQuery.category = category;
    }
    
    // Fetch random words
    const words = await Word.aggregate([
      { $match: wordQuery },
      { $sample: { size: questionCount } }
    ]);
    
    if (words.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy từ vựng phù hợp'
      });
    }
    
    // Generate questions
    const questions = await Promise.all(words.map(async (word, index) => {
      // Get wrong options (3 random words from same category)
      const wrongOptions = await Word.aggregate([
        {
          $match: {
            _id: { $ne: word._id },
            category: word.category,
            $or: [
              { createdBy: userId },
              { isPublic: true }
            ]
          }
        },
        { $sample: { size: 3 } }
      ]);
      
      // Build options array
      const options = [
        word.vietnamese, // Correct answer
        ...wrongOptions.map(w => w.vietnamese)
      ];
      
      // If not enough wrong options, add generic ones
      while (options.length < 4) {
        const fallbackWords = await Word.aggregate([
          {
            $match: {
              _id: { $ne: word._id },
              $or: [
                { createdBy: userId },
                { isPublic: true }
              ]
            }
          },
          { $sample: { size: 1 } }
        ]);
        
        if (fallbackWords.length > 0 && !options.includes(fallbackWords[0].vietnamese)) {
          options.push(fallbackWords[0].vietnamese);
        } else {
          break;
        }
      }
      
      // Shuffle options
      const shuffledOptions = shuffleArray(options);
      const correctIndex = shuffledOptions.indexOf(word.vietnamese);
      
      return {
        wordId: word._id,
        question: word.traditional,
        traditional: word.traditional,
        simplified: word.simplified,
        pinyin: word.pinyin,
        hint: 'Chọn nghĩa tiếng Việt đúng',
        options: shuffledOptions,
        correctAnswer: word.vietnamese,
        correctIndex: correctIndex,
        points: 10,
        difficulty: word.difficulty
      };
    }));
    
    res.json({
      success: true,
      data: {
        questions,
        totalQuestions: questions.length,
        difficulty: difficulty,
        category: category || 'all'
      }
    });
    
  } catch (error) {
    console.error('Error generating random test:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo bài test',
      error: error.message
    });
  }
};

/**
 * Save test results
 * POST /api/tests/results
 */
const saveTestResults = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      sessionId,
      answers,
      score,
      timeSpent,
      totalQuestions,
      correctAnswers,
      incorrectAnswers
    } = req.body;
    
    if (!sessionId || !answers) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }
    
    // Create test result
    const testResult = new TestResult({
      userId,
      testId: null, // Random test doesn't have fixed test ID
      wordSetId: null,
      sessionId,
      answers: answers.map(a => ({
        questionIndex: a.questionIndex,
        wordId: a.wordId,
        userAnswer: a.userAnswer,
        correctAnswer: a.correctAnswer,
        isCorrect: a.isCorrect,
        timeSpent: a.timeSpent || 0,
        points: a.points || 0
      })),
      score: score || 0,
      totalQuestions: totalQuestions || answers.length,
      correctAnswers: correctAnswers || answers.filter(a => a.isCorrect).length,
      wrongAnswers: incorrectAnswers || answers.filter(a => !a.isCorrect).length,
      timeSpent: timeSpent || 0,
      isPassed: score >= 70,
      startedAt: new Date(Date.now() - (timeSpent * 1000)),
      completedAt: new Date()
    });
    
    await testResult.save();
    
    // Update user progress
    await updateUserProgress(userId, testResult);
    
    res.json({
      success: true,
      data: {
        resultId: testResult._id,
        score: testResult.score,
        isPassed: testResult.isPassed,
        xpEarned: testResult.xpEarned,
        message: testResult.isPassed ? 'Chúc mừng! Bạn đã hoàn thành bài test.' : 'Cần cố gắng thêm!'
      }
    });
    
  } catch (error) {
    console.error('Error saving test results:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lưu kết quả',
      error: error.message
    });
  }
};

/**
 * Update user progress after test
 */
const updateUserProgress = async (userId, testResult) => {
  try {
    // Get or create progress
    let progress = await Progress.findOne({ userId });
    
    if (!progress) {
      progress = new Progress({ userId });
    }
    
    // Update words from correct answers
    const correctWordIds = testResult.answers
      .filter(a => a.isCorrect)
      .map(a => a.wordId);
    
    for (const wordId of correctWordIds) {
      const existingWord = progress.learnedWords.find(
        w => w.wordId && w.wordId.toString() === wordId.toString()
      );
      
      if (existingWord) {
        // Increase mastery level
        existingWord.masteryLevel = Math.min(existingWord.masteryLevel + 5, 100);
        existingWord.reviewCount += 1;
        existingWord.lastReviewed = new Date();
      } else {
        // Add new word
        progress.learnedWords.push({
          wordId: wordId,
          masteryLevel: 20, // Starting mastery for test
          reviewCount: 1,
          lastReviewed: new Date()
        });
      }
    }
    
    // Update totals
    progress.totalWordsLearned = progress.learnedWords.length;
    
    // Update study streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastStudy = progress.lastStudyDate ? new Date(progress.lastStudyDate) : null;
    
    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Same day - no change
      } else if (daysDiff === 1) {
        // Consecutive day - increase streak
        progress.studyStreak += 1;
      } else {
        // Broken streak - reset
        progress.studyStreak = 1;
      }
    } else {
      progress.studyStreak = 1;
    }
    
    progress.lastStudyDate = new Date();
    
    await progress.save();
    
    // Update User model streak logic to keep it in sync
    try {
      const user = await User.findById(userId);
      if (user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
        let daysDiff = -1;
        
        if (lastStudy) {
          lastStudy.setHours(0, 0, 0, 0);
          daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
        }
        
        if (!lastStudy || daysDiff > 1) {
          user.streak = 1;
        } else if (daysDiff === 1) {
          user.streak = (user.streak || 0) + 1;
        }
        // If daysDiff === 0, keep current streak
        
        if ((user.streak || 0) > (user.longestStreak || 0)) {
          user.longestStreak = user.streak;
        }
        
        user.lastStudyDate = new Date();
        await user.save();
      }
    } catch (err) {
      console.error('Error updating user streak in test controller:', err);
    }

    console.log('✅ Progress updated for user:', userId);
    
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

/**
 * Get user's test history
 * GET /api/tests/history
 */
const getTestHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10, skip = 0 } = req.query;
    
    const results = await TestResult.find({ userId })
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-answers'); // Exclude detailed answers for list view
    
    const total = await TestResult.countDocuments({ userId });
    
    res.json({
      success: true,
      data: {
        results,
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
    
  } catch (error) {
    console.error('Error getting test history:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải lịch sử',
      error: error.message
    });
  }
};

/**
 * Get detailed test result
 * GET /api/tests/results/:resultId
 */
const getTestResult = async (req, res) => {
  try {
    const userId = req.user._id;
    const { resultId } = req.params;
    
    const result = await TestResult.findOne({
      _id: resultId,
      userId
    }).populate('answers.wordId', 'traditional simplified pinyin vietnamese');
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kết quả'
      });
    }
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error getting test result:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải kết quả',
      error: error.message
    });
  }
};

/**
 * Get test statistics
 * GET /api/tests/stats
 */
const getTestStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const results = await TestResult.find({ userId });
    
    if (results.length === 0) {
      return res.json({
        success: true,
        data: {
          totalTests: 0,
          averageScore: 0,
          highestScore: 0,
          totalCorrect: 0,
          totalQuestions: 0,
          passRate: 0
        }
      });
    }
    
    const stats = {
      totalTests: results.length,
      averageScore: Math.round(
        results.reduce((sum, r) => sum + r.score, 0) / results.length
      ),
      highestScore: Math.max(...results.map(r => r.score)),
      totalCorrect: results.reduce((sum, r) => sum + r.correctAnswers, 0),
      totalQuestions: results.reduce((sum, r) => sum + r.totalQuestions, 0),
      passRate: Math.round(
        (results.filter(r => r.isPassed).length / results.length) * 100
      ),
      recentTests: results.slice(0, 5).map(r => ({
        score: r.score,
        completedAt: r.completedAt,
        isPassed: r.isPassed
      }))
    };
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Error getting test stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải thống kê',
      error: error.message
    });
  }
};

/**
 * Utility: Shuffle array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

module.exports = {
  generateRandomTest,
  saveTestResults,
  getTestHistory,
  getTestResult,
  getTestStats
};
