/**
 * Seed Badges (Danh Hiệu)
 * Tạo các badge/achievement cho hệ thống
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Badge = require('../api/models/Badge');

// Badges data
const badgesData = [
  // ========== LEARNING CATEGORY - Học tập ==========
  {
    badgeId: 'first_word',
    name: 'Bước Đầu Tiên',
    description: 'Học từ đầu tiên của bạn',
    category: 'learning',
    icon: '🌱',
    color: '#4CAF50',
    rarity: 'common',
    points: 10,
    criteria: {
      type: 'words_learned',
      target: 1,
      description: 'Học 1 từ vựng'
    },
    rewards: {
      xp: 50,
      coins: 10
    },
    displayOrder: 1
  },
  {
    badgeId: 'vocab_novice',
    name: 'Người Mới',
    description: 'Học được 10 từ vựng',
    category: 'learning',
    icon: '📖',
    color: '#4CAF50',
    rarity: 'common',
    points: 25,
    criteria: {
      type: 'words_learned',
      target: 10,
      description: 'Học 10 từ vựng'
    },
    rewards: {
      xp: 100,
      coins: 25
    },
    displayOrder: 2
  },
  {
    badgeId: 'vocab_apprentice',
    name: 'Học Viên',
    description: 'Học được 50 từ vựng',
    category: 'learning',
    icon: '📚',
    color: '#2196F3',
    rarity: 'rare',
    points: 50,
    criteria: {
      type: 'words_learned',
      target: 50,
      description: 'Học 50 từ vựng'
    },
    rewards: {
      xp: 250,
      coins: 50
    },
    displayOrder: 3
  },
  {
    badgeId: 'vocab_scholar',
    name: 'Học Giả',
    description: 'Học được 100 từ vựng',
    category: 'learning',
    icon: '🎓',
    color: '#9C27B0',
    rarity: 'epic',
    points: 100,
    criteria: {
      type: 'words_learned',
      target: 100,
      description: 'Học 100 từ vựng'
    },
    rewards: {
      xp: 500,
      coins: 100
    },
    displayOrder: 4
  },
  {
    badgeId: 'vocab_master',
    name: 'Bậc Thầy Từ Vựng',
    description: 'Học được 200 từ vựng',
    category: 'learning',
    icon: '👑',
    color: '#FFD700',
    rarity: 'legendary',
    points: 200,
    criteria: {
      type: 'words_learned',
      target: 200,
      description: 'Học 200 từ vựng'
    },
    rewards: {
      xp: 1000,
      coins: 200
    },
    displayOrder: 5
  },
  {
    badgeId: 'polyglot',
    name: 'Đa Ngôn Ngữ',
    description: 'Học được 500 từ vựng',
    category: 'learning',
    icon: '🌍',
    color: '#FFD700',
    rarity: 'legendary',
    points: 500,
    criteria: {
      type: 'words_learned',
      target: 500,
      description: 'Học 500 từ vựng'
    },
    rewards: {
      xp: 2500,
      coins: 500
    },
    displayOrder: 6
  },

  // ========== STREAK CATEGORY - Streak Liên Tục ==========
  {
    badgeId: 'streak_starter',
    name: 'Bắt Đầu Streak',
    description: 'Học liên tục 3 ngày',
    category: 'streak',
    icon: '🔥',
    color: '#FF5722',
    rarity: 'common',
    points: 20,
    criteria: {
      type: 'streak_days',
      target: 3,
      description: 'Học liên tục 3 ngày'
    },
    rewards: {
      xp: 75,
      coins: 20
    },
    displayOrder: 10
  },
  {
    badgeId: 'week_warrior',
    name: 'Chiến Binh Tuần',
    description: 'Học liên tục 7 ngày',
    category: 'streak',
    icon: '⚡',
    color: '#FF5722',
    rarity: 'rare',
    points: 50,
    criteria: {
      type: 'streak_days',
      target: 7,
      description: 'Học liên tục 7 ngày'
    },
    rewards: {
      xp: 200,
      coins: 50
    },
    displayOrder: 11
  },
  {
    badgeId: 'dedication',
    name: 'Kiên Trì',
    description: 'Học liên tục 30 ngày',
    category: 'streak',
    icon: '💪',
    color: '#9C27B0',
    rarity: 'epic',
    points: 150,
    criteria: {
      type: 'streak_days',
      target: 30,
      description: 'Học liên tục 30 ngày'
    },
    rewards: {
      xp: 750,
      coins: 150
    },
    displayOrder: 12
  },
  {
    badgeId: 'unstoppable',
    name: 'Không Thể Ngăn Cản',
    description: 'Học liên tục 100 ngày',
    category: 'streak',
    icon: '🌟',
    color: '#FFD700',
    rarity: 'legendary',
    points: 500,
    criteria: {
      type: 'streak_days',
      target: 100,
      description: 'Học liên tục 100 ngày'
    },
    rewards: {
      xp: 2500,
      coins: 500
    },
    displayOrder: 13
  },
  {
    badgeId: 'year_legend',
    name: 'Huyền Thoại Năm',
    description: 'Học liên tục 365 ngày',
    category: 'streak',
    icon: '🏆',
    color: '#FFD700',
    rarity: 'legendary',
    points: 1000,
    criteria: {
      type: 'streak_days',
      target: 365,
      description: 'Học liên tục 365 ngày'
    },
    rewards: {
      xp: 10000,
      coins: 1000
    },
    displayOrder: 14
  },

  // ========== TEST CATEGORY - Kiểm Tra ==========
  {
    badgeId: 'first_test',
    name: 'Bài Test Đầu Tiên',
    description: 'Hoàn thành bài test đầu tiên',
    category: 'test',
    icon: '📝',
    color: '#4CAF50',
    rarity: 'common',
    points: 15,
    criteria: {
      type: 'tests_passed',
      target: 1,
      description: 'Hoàn thành 1 bài test'
    },
    rewards: {
      xp: 50,
      coins: 15
    },
    displayOrder: 20
  },
  {
    badgeId: 'test_taker',
    name: 'Người Làm Bài',
    description: 'Hoàn thành 10 bài test',
    category: 'test',
    icon: '✍️',
    color: '#2196F3',
    rarity: 'rare',
    points: 50,
    criteria: {
      type: 'tests_passed',
      target: 10,
      description: 'Hoàn thành 10 bài test'
    },
    rewards: {
      xp: 250,
      coins: 50
    },
    displayOrder: 21
  },
  {
    badgeId: 'perfect_score',
    name: 'Điểm Tuyệt Đối',
    description: 'Đạt điểm tuyệt đối trong 1 bài test',
    category: 'test',
    icon: '💯',
    color: '#9C27B0',
    rarity: 'epic',
    points: 100,
    criteria: {
      type: 'perfect_scores',
      target: 1,
      description: 'Đạt 100% trong 1 bài test'
    },
    rewards: {
      xp: 300,
      coins: 75
    },
    displayOrder: 22
  },
  {
    badgeId: 'perfectionist',
    name: 'Người Hoàn Hảo',
    description: 'Đạt điểm tuyệt đối trong 5 bài test',
    category: 'test',
    icon: '⭐',
    color: '#FFD700',
    rarity: 'legendary',
    points: 250,
    criteria: {
      type: 'perfect_scores',
      target: 5,
      description: 'Đạt 100% trong 5 bài test'
    },
    rewards: {
      xp: 1000,
      coins: 250
    },
    displayOrder: 23
  },
  {
    badgeId: 'test_master',
    name: 'Bậc Thầy Kiểm Tra',
    description: 'Hoàn thành 50 bài test',
    category: 'test',
    icon: '🎯',
    color: '#FFD700',
    rarity: 'legendary',
    points: 300,
    criteria: {
      type: 'tests_passed',
      target: 50,
      description: 'Hoàn thành 50 bài test'
    },
    rewards: {
      xp: 1500,
      coins: 300
    },
    displayOrder: 24
  },

  // ========== MILESTONE CATEGORY - Cột Mốc ==========
  {
    badgeId: 'beginner',
    name: 'Người Mới Bắt Đầu',
    description: 'Hoàn thành tất cả từ Beginner',
    category: 'milestone',
    icon: '🌟',
    color: '#4CAF50',
    rarity: 'common',
    points: 50,
    criteria: {
      type: 'custom',
      target: 1,
      description: 'Học xong tất cả từ cơ bản'
    },
    rewards: {
      xp: 200,
      coins: 50
    },
    displayOrder: 30
  },
  {
    badgeId: 'intermediate',
    name: 'Trung Cấp',
    description: 'Hoàn thành tất cả từ Intermediate',
    category: 'milestone',
    icon: '🎖️',
    color: '#2196F3',
    rarity: 'rare',
    points: 100,
    criteria: {
      type: 'custom',
      target: 1,
      description: 'Học xong tất cả từ trung cấp'
    },
    rewards: {
      xp: 500,
      coins: 100
    },
    displayOrder: 31
  },
  {
    badgeId: 'advanced',
    name: 'Nâng Cao',
    description: 'Hoàn thành tất cả từ Advanced',
    category: 'milestone',
    icon: '🏅',
    color: '#9C27B0',
    rarity: 'epic',
    points: 200,
    criteria: {
      type: 'custom',
      target: 1,
      description: 'Học xong tất cả từ nâng cao'
    },
    rewards: {
      xp: 1000,
      coins: 200
    },
    displayOrder: 32
  },

  // ========== SPECIAL CATEGORY - Đặc Biệt ==========
  {
    badgeId: 'early_bird',
    name: 'Chim Sớm',
    description: 'Học trước 6h sáng',
    category: 'special',
    icon: '🌅',
    color: '#FF9800',
    rarity: 'rare',
    points: 30,
    criteria: {
      type: 'custom',
      target: 1,
      description: 'Học vào buổi sớm'
    },
    rewards: {
      xp: 100,
      coins: 30
    },
    displayOrder: 40
  },
  {
    badgeId: 'night_owl',
    name: 'Cú Đêm',
    description: 'Học sau 11h đêm',
    category: 'special',
    icon: '🦉',
    color: '#3F51B5',
    rarity: 'rare',
    points: 30,
    criteria: {
      type: 'custom',
      target: 1,
      description: 'Học vào buổi tối'
    },
    rewards: {
      xp: 100,
      coins: 30
    },
    displayOrder: 41
  },
  {
    badgeId: 'weekend_warrior',
    name: 'Chiến Binh Cuối Tuần',
    description: 'Học vào cả thứ 7 và chủ nhật',
    category: 'special',
    icon: '🎉',
    color: '#E91E63',
    rarity: 'epic',
    points: 50,
    criteria: {
      type: 'custom',
      target: 1,
      description: 'Học cuối tuần'
    },
    rewards: {
      xp: 150,
      coins: 50
    },
    displayOrder: 42
  },
  {
    badgeId: 'speed_learner',
    name: 'Học Nhanh',
    description: 'Học 20 từ trong 1 ngày',
    category: 'special',
    icon: '⚡',
    color: '#FFD700',
    rarity: 'legendary',
    points: 100,
    criteria: {
      type: 'custom',
      target: 20,
      description: 'Học 20 từ trong 1 ngày'
    },
    rewards: {
      xp: 300,
      coins: 100
    },
    displayOrder: 43
  },
  {
    badgeId: 'cultural_explorer',
    name: 'Khám Phá Văn Hóa',
    description: 'Hoàn thành category văn hóa',
    category: 'special',
    icon: '🎭',
    color: '#9C27B0',
    rarity: 'epic',
    points: 75,
    criteria: {
      type: 'custom',
      target: 1,
      description: 'Học xong category văn hóa'
    },
    rewards: {
      xp: 250,
      coins: 75
    },
    displayOrder: 44
  },

  // ========== STUDY TIME ==========
  {
    badgeId: 'study_1hour',
    name: 'Giờ Đầu Tiên',
    description: 'Học tổng cộng 1 giờ',
    category: 'milestone',
    icon: '⏰',
    color: '#4CAF50',
    rarity: 'common',
    points: 25,
    criteria: {
      type: 'study_hours',
      target: 1,
      description: 'Học tổng 1 giờ'
    },
    rewards: {
      xp: 100,
      coins: 25
    },
    displayOrder: 50
  },
  {
    badgeId: 'study_10hours',
    name: 'Thời Gian Vàng',
    description: 'Học tổng cộng 10 giờ',
    category: 'milestone',
    icon: '⏳',
    color: '#2196F3',
    rarity: 'rare',
    points: 100,
    criteria: {
      type: 'study_hours',
      target: 10,
      description: 'Học tổng 10 giờ'
    },
    rewards: {
      xp: 400,
      coins: 100
    },
    displayOrder: 51
  },
  {
    badgeId: 'study_50hours',
    name: 'Người Cần Cù',
    description: 'Học tổng cộng 50 giờ',
    category: 'milestone',
    icon: '📖',
    color: '#9C27B0',
    rarity: 'epic',
    points: 250,
    criteria: {
      type: 'study_hours',
      target: 50,
      description: 'Học tổng 50 giờ'
    },
    rewards: {
      xp: 1250,
      coins: 250
    },
    displayOrder: 52
  },
  {
    badgeId: 'study_100hours',
    name: 'Chuyên Gia Thời Gian',
    description: 'Học tổng cộng 100 giờ',
    category: 'milestone',
    icon: '🎓',
    color: '#FFD700',
    rarity: 'legendary',
    points: 500,
    criteria: {
      type: 'study_hours',
      target: 100,
      description: 'Học tổng 100 giờ'
    },
    rewards: {
      xp: 2500,
      coins: 500
    },
    displayOrder: 53
  }
];

// Main function
async function seedBadges() {
  try {
    console.log('🚀 Starting badge seeding...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taiwanese_learning';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const badgeData of badgesData) {
      const existing = await Badge.findOne({ badgeId: badgeData.badgeId });

      if (existing) {
        console.log(`⚠️  Badge "${badgeData.name}" (${badgeData.badgeId}) already exists, updating...`);
        
        // Update existing badge
        Object.assign(existing, badgeData);
        await existing.save();
        updated++;
        
        console.log(`✅ Updated: ${badgeData.icon} ${badgeData.name} [${badgeData.rarity}] - ${badgeData.points} pts`);
      } else {
        // Create new badge
        await Badge.create(badgeData);
        created++;
        
        console.log(`✅ Created: ${badgeData.icon} ${badgeData.name} [${badgeData.rarity}] - ${badgeData.points} pts`);
      }
    }

    console.log('\n════════════════════════════════════════');
    console.log('🎉 BADGE SEEDING COMPLETED!');
    console.log('════════════════════════════════════════');
    console.log(`✨ Created: ${created} badges`);
    console.log(`🔄 Updated: ${updated} badges`);
    console.log(`📊 Total: ${badgesData.length} badges in system`);
    console.log('════════════════════════════════════════');
    console.log('\n📋 Summary by Category:');
    
    const byCategory = badgesData.reduce((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} badges`);
    });
    
    console.log('\n🏆 Summary by Rarity:');
    const byRarity = badgesData.reduce((acc, b) => {
      acc[b.rarity] = (acc[b.rarity] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(byRarity).forEach(([rarity, count]) => {
      console.log(`   ${rarity}: ${count} badges`);
    });
    
    console.log('\n════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error seeding badges:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run seed
seedBadges();
