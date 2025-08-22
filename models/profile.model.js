import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema({
  
     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a separate User model
    required: true
  },

  profile_image: {
    type: String, // Store image URL or file path
    default: ''   // Optional default
  },

  full_name: {
    type: String,
    required: true,
    trim: true
  },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  about: {
    type: String,
    maxlength: 1000
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
      unique : true
    },
    
    phone: {
        type: String,
        trim: true,
        unique : true
  },

  location: {
    type: String,
    trim: true
  },

  website: {
    type: String,
    trim: true,
    unique : true
  },

  socials: {
    twitter: { type: String, trim: true,  unique : true},
    linkedin: { type: String, trim: true, unique : true},
    facebook: { type: String, trim: true, unique : true}
  },

  category: {
    type: [String],
    enum: [],
    validate : {
        validator : function(value) {
         return value.length <=8
        },
      message : "you can choose 8 Categories to write blogs"  
   },
    default: []
  },

}, {timeseries: true})

export const Profile = mongoose.Schema('Profile', profileSchema)

