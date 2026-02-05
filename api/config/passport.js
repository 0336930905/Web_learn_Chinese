/**
 * Passport Configuration
 * Google OAuth Strategy
 */

require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createStarterWords } = require('../utils/starterWords');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback',
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔵 Google OAuth Profile:', {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        displayName: profile.displayName
      });

      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        console.log('✅ User exists, updating...');
        // Update Google ID if logging in with Google for first time
        if (!user.googleId) {
          user.googleId = profile.id;
          user.avatar = profile.photos[0]?.value;
          user.isVerified = true;
        }
        
        // Update last login
        user.lastLoginAt = new Date();
        await user.save();
      } else {
        console.log('🆕 Creating new user...');
        // Create new user
        // Generate unique username
        const baseUsername = profile.emails[0].value.split('@')[0];
        let username = baseUsername;
        let counter = 1;
        
        // Check if username exists, add counter if needed
        while (await User.findOne({ username })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }
        
        const userData = {
          googleId: profile.id,
          email: profile.emails[0].value,
          username: username,
          displayName: profile.displayName || username,
          isVerified: true,
          lastLoginAt: new Date(),
          // Add dummy password to satisfy MongoDB validator
          // This will be 60 chars bcrypt hash format
          password: '$2a$10$dummyHashForGoogleOAuthUsersOnlyNotRealPassword123456'
        };

        // Only add avatar if exists
        if (profile.photos && profile.photos[0]?.value) {
          userData.avatar = profile.photos[0].value;
        }

        console.log('📝 User data:', userData);
        
        user = await User.create(userData);
        console.log('✅ User created:', user._id);
        
        // Create starter words for new user
        try {
          await createStarterWords(user._id);
          console.log('✅ Starter words created for new user');
        } catch (wordError) {
          console.error('⚠️ Error creating starter words:', wordError.message);
          // Don't fail auth if starter words fail
        }
      }

      return done(null, user);
    } catch (error) {
      console.error('❌ Google OAuth Error:', error);
      console.error('Error details:', error.message);
      if (error.errors) {
        console.error('Validation errors:', error.errors);
      }
      return done(error, null);
    }
  }
));

module.exports = passport;
