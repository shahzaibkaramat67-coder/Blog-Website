// var GoogleStrategy = require('passport-google-oauth20').Strategy;
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Dotenv from 'dotenv';
import User from '../models/Signup.model.js';
import ApiError from '../utils/ApiError.js';
Dotenv.config()


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
  async (accessToken, refreshToken, profile, cb) => {

  //  console.log(profile);
   
    
    try {
      let user = await User.findOne({GoogleId : profile.id})
     
      if (profile.emails?.length  > 0) {
        user = await User.findOne({Email : profile.emails[0].value})  
      }
     
      

      if (!user) {
        user =  await User.create({
          GoogleId : profile.id,
          firstName : profile.displayName,
          Email : profile.emails[0].value,
          // profile_image : profile.photos[0].value || ""
        })
      }

     const access_Token = await user.generateAccessToken()
     const refresh_Token = await user.generateRefreshToken()
     user.refreshToken = refresh_Token
     await user.save()

      // console.log(user);
      
      return cb(null, {user, access_Token, refresh_Token});
    } catch (error) {
      return cb(error, null); 
    }
  }
));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser( async(id, done)=>{

 try {
   const user =await User.findById(id)
   done(null, user)
 } catch (error) {
  console.log(error);
  
   done(error, null);
 }

});