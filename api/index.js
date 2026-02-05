const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretkey-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes - Define BEFORE static middleware to ensure API routes take priority
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/words', require('./routes/words'));
app.use('/api/wordsets', require('./routes/wordsets'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Taiwanese Learning API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      words: '/api/words',
      wordsets: '/api/wordsets',
      categories: '/api/categories',
      progress: '/api/progress',
      achievements: '/api/achievements',
      notifications: '/api/notifications',
      tests: '/api/tests',
      admin: '/api/admin'
    }
  });
});

// Root route - serve public landing page
app.get('/', (req, res) => {
  console.log('🏠 Root route accessed - serving index.html');
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve static files from public directory
// This comes AFTER specific routes to allow route handlers to take precedence
app.use(express.static(path.join(__dirname, '../public'), {
  index: false, // Disable automatic index.html serving
  setHeaders: (res, filePath) => {
    // Fix MIME types for CSS files
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 - Only for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Start server (for local development)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`); 
  });
}

// Export for Vercel
module.exports = app;
