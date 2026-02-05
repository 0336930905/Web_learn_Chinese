/**
 * Authentication Controller
 * Handle user authentication logic
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createStarterWords } = require('../utils/starterWords');

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      isAdmin: user.isAdmin || user.role === 'admin',
      isPremium: user.isPremium || false
    },
    process.env.JWT_SECRET || 'mysecretkey',
    { expiresIn: '7d' }
  );
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Validation
    if (!email || !password || !displayName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu phải có ít nhất 6 ký tự' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email đã được sử dụng'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate username from email (before @)
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      displayName: displayName,
      lastLoginAt: new Date()
    });

    // Create starter words for new user
    try {
      await createStarterWords(newUser._id);
      console.log('✅ Starter words created for new user:', newUser.username);
    } catch (wordError) {
      console.error('⚠️ Error creating starter words:', wordError.message);
      // Don't fail registration if starter words fail
    }

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Login with email/password
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Validation failed: missing fields');

      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin' 
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Tài khoản đã bị khóa' 
      });
    }

    // Update last login and streak
    user.lastLoginAt = new Date();
    user.updateStreak();
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Generate token
    const token = generateToken(user);
    
    console.log('✅ Login successful for:', user.email);
    console.log('🎫 Token generated:', token.substring(0, 30) + '...');

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Google OAuth callback handler
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
exports.googleCallback = (req, res) => {
  try {
    // Generate token
    const token = generateToken(req.user);

    // Redirect to login page with token (will auto-redirect to dashboard)
    res.redirect(`/pages/auth/login.html?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect('/pages/auth/login.html?error=Authentication%20failed');
  }
};

/**
 * @desc    Verify JWT token
 * @route   GET /api/auth/verify
 * @access  Private
 */
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get current user info
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Include virtual fields
    const userResponse = user.toObject({ virtuals: true });
    delete userResponse.password;

    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự' 
      });
    }

    // Find user
    const user = await User.findById(req.userId);

    if (!user || !user.password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không thể đổi mật khẩu cho tài khoản này' 
      });
    }

    // Check current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Mật khẩu hiện tại không đúng' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
};
