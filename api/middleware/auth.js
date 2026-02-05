/**
 * Authentication Middleware
 * Verify JWT tokens and protect routes
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token middleware
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
    
    // Attach user info to request
    req.user = decoded;
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
      req.user = decoded;
      req.userId = decoded.userId;
    }
    
    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};

/**
 * Check if user is admin
 */
const requireAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

/**
 * Check if user is premium
 */
const requirePremium = async (req, res, next) => {
  if (!req.user || (!req.user.isPremium && req.user.role !== 'admin')) {
    return res.status(403).json({ 
      success: false, 
      message: 'Premium access required' 
    });
  }
  next();
};

/**
 * Admin only middleware
 */
const adminOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (!req.user.isAdmin && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }

  next();
};

module.exports = {
  authMiddleware,
  protect: authMiddleware, // Alias for consistency
  optionalAuth,
  requireAdmin,
  requirePremium,
  adminOnly
};
