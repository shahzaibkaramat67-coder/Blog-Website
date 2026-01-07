import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Dotenv from 'dotenv';
import User from '../models/Signup.model.js';

Dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ GoogleId: profile.id });

        // If email exists, check by email also (Prevent duplicates)
        if (!user && profile.emails?.length > 0) {
          user = await User.findOne({ Email: profile.emails[0].value });
        }

        // If no user found, create new one
        if (!user) {
          user = new User({
            GoogleId: profile.id,
            Email: profile.emails[0].value,
            Username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
            emailVerified: profile.emails[0].verified,
            isValid : true
          });

          await user.save({ validateBeforeSave: false });
        }

        // Generate tokens
        const access_Token = await user.generateAccessToken();
        const refresh_Token = await user.generateRefreshToken();

        user.refreshToken = refresh_Token;
        await user.save({ validateBeforeSave: false });

        return cb(null, { user, access_Token, refresh_Token });

      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

// Serialize only user id
passport.serializeUser((data, done) => {
  done(null, data.user._id);
});

// Load user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
