import mongoose, { Schema } from "mongoose";

const profileSchema = new mongoose.Schema({
  
     User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a separate User model
    required: true
  },

  profile_Image: {
    type: String, // Store image URL or file path
    required: true,
    default: ""
  },

  full_name: {
    type: String,
    required: true,
    trim: true,
    minlength: [5, "fullname contain min 5 char"],
    maxlength: [15, "fullname contain max 15 char"]
  },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
     minlength: [5, "fullname contain min 5 char"],
    maxlength: [15, "fullname contain max 15 char"]
  },

  about: {
    type: String,
    maxlength: 500
  },

  email: {
    type: String,
    // required: true,
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
         return value.length <=6
        },
      message : "you can choose 6 Categories to write blogs"  
   },
    default: []
  },

}, {timestamps: true})

export const Profile = mongoose.model('Profile', profileSchema)

