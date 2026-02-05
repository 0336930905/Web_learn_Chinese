/**
 * Seed Badges
 * Initialize default badges/achievements
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Badge = require('../models/Badge');

dotenv.config();

const badges = [
  // Learning Badges
  {
    badgeId: 'first_word',
    name: 'Bước Đầu Tiên',
    description: 'Học được từ đầu tiên',
    category: 'learning',
    icon: '🌱',
    color: '#4CAF50',
    rarity: 'common',
    points: 10,
    criteria: {
      type: 'words_learned',
      target: 1
    },
    isActive: true
  },
  {
    badgeId: 'word_collector_10',
    name: 'Người Sưu Tầm',
    description: 'Học được 10 từ vựng',
    category: 'learning',
    icon: '📚',
    color: '#2196F3',
    rarity: 'common',
    points: 50,
    criteria: {
      type: 'words_learned',
      target: 10
    },
    isActive: true
  },
  {
    badgeId: 'word_master_50',
    name: 'Học Giả',
    description: 'Học được 50 từ vựng',
    category: 'learning',
    icon: '🎓',
    color: '#9C27B0',
    rarity: 'rare',
    points: 200,
    criteria: {
      type: 'words_learned',
      target: 50
    },
    isActive: true
  },
  {
    badgeId: 'word_legend_100',
    name: 'Huyền Thoại Từ Vựng',
    description: 'Học được 100 từ vựng',
    category: 'learning',
    icon: '👑',
    color: '#FFD700',
    rarity: 'epic',
    points: 500,
    criteria: {
      type: 'words_learned',
      target: 100
    },
    isActive: true
  },
  
  // Streak Badges
  {
    badgeId: 'streak_3',
    name: 'Kiên Trì',
    description: 'Học liên tục 3 ngày',
    category: 'streak',
    icon: '🔥',
    color: '#FF5722',
    rarity: 'common',
    points: 30,
    criteria: {
      type: 'study_streak',
      target: 3
    },
    isActive: true
  },
  {
    badgeId: 'streak_7',
    name: 'Tuần Hoàn Hảo',
    description: 'Học liên tục 7 ngày',
    category: 'streak',
    icon: '⭐',
    color: '#FFC107',
    rarity: 'rare',
    points: 100,
    criteria: {
      type: 'study_streak',
      target: 7
    },
    isActive: true
  },
  {
    badgeId: 'streak_30',
    name: 'Tháng Vàng',
    description: 'Học liên tục 30 ngày',
    category: 'streak',
    icon: '🏆',
    color: '#FFD700',
    rarity: 'epic',
    points: 500,
    criteria: {
      type: 'study_streak',
      target: 30
    },
    isActive: true
  },
  {
    badgeId: 'streak_100',
    name: 'Siêu Nhân',
    description: 'Học liên tục 100 ngày',
    category: 'streak',
    icon: '💎',
    color: '#00BCD4',
    rarity: 'legendary',
    points: 2000,
    criteria: {
      type: 'study_streak',
      target: 100
    },
    isActive: true
  },
  
  // Mastery Badges
  {
    badgeId: 'master_5',
    name: 'Thành Thạo Cơ Bản',
    description: 'Đạt 100% thành thạo 5 từ',
    category: 'milestone',
    icon: '⚡',
    color: '#FFEB3B',
    rarity: 'common',
    points: 50,
    criteria: {
      type: 'mastery_level',
      target: 100,
      count: 5
    },
    isActive: true
  },
  {
    badgeId: 'master_20',
    name: 'Chuyên Gia',
    description: 'Đạt 100% thành thạo 20 từ',
    category: 'milestone',
    icon: '💪',
    color: '#E91E63',
    rarity: 'rare',
    points: 200,
    criteria: {
      type: 'mastery_level',
      target: 100,
      count: 20
    },
    isActive: true
  },
  {
    badgeId: 'master_50',
    name: 'Bậc Thầy',
    description: 'Đạt 100% thành thạo 50 từ',
    category: 'milestone',
    icon: '🎯',
    color: '#9C27B0',
    rarity: 'epic',
    points: 1000,
    criteria: {
      type: 'mastery_level',
      target: 100,
      count: 50
    },
    isActive: true
  },
  
  // Accuracy Badges
  {
    badgeId: 'accuracy_80',
    name: 'Chính Xác',
    description: 'Đạt 80% độ chính xác trong 7 ngày',
    category: 'learning',
    icon: '🎯',
    color: '#4CAF50',
    rarity: 'common',
    points: 100,
    criteria: {
      type: 'accuracy',
      target: 80
    },
    isActive: true
  },
  {
    badgeId: 'accuracy_90',
    name: 'Siêu Chính Xác',
    description: 'Đạt 90% độ chính xác trong 7 ngày',
    category: 'learning',
    icon: '🌟',
    color: '#FF9800',
    rarity: 'rare',
    points: 300,
    criteria: {
      type: 'accuracy',
      target: 90
    },
    isActive: true
  },
  {
    badgeId: 'perfect_5',
    name: 'Hoàn Hảo',
    description: 'Đạt điểm tuyệt đối 5 lần',
    category: 'learning',
    icon: '💯',
    color: '#F44336',
    rarity: 'epic',
    points: 500,
    criteria: {
      type: 'perfect_score',
      target: 5
    },
    isActive: true
  },
  
  // Practice Session Badges
  {
    badgeId: 'practice_10',
    name: 'Người Luyện Tập',
    description: 'Hoàn thành 10 buổi luyện tập',
    category: 'learning',
    icon: '📝',
    color: '#03A9F4',
    rarity: 'common',
    points: 50,
    criteria: {
      type: 'practice_sessions',
      target: 10
    },
    isActive: true
  },
  {
    badgeId: 'practice_50',
    name: 'Chiến Binh Học Tập',
    description: 'Hoàn thành 50 buổi luyện tập',
    category: 'learning',
    icon: '⚔️',
    color: '#673AB7',
    rarity: 'rare',
    points: 250,
    criteria: {
      type: 'practice_sessions',
      target: 50
    },
    isActive: true
  },
  {
    badgeId: 'practice_100',
    name: 'Đại Sư',
    description: 'Hoàn thành 100 buổi luyện tập',
    category: 'learning',
    icon: '🥋',
    color: '#3F51B5',
    rarity: 'epic',
    points: 1000,
    criteria: {
      type: 'practice_sessions',
      target: 100
    },
    isActive: true
  }
];

async function seedBadges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taiwanese-learning', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB connected');

    // Clear existing badges
    await Badge.deleteMany({});
    console.log('🗑️  Cleared existing badges');

    // Insert new badges
    await Badge.insertMany(badges);
    console.log(`✅ Inserted ${badges.length} badges`);

    console.log('\n📊 Badge Summary:');
    const counts = await Badge.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    counts.forEach(c => {
      console.log(`  ${c._id}: ${c.count} badges`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedBadges();
