import mongoose, { Schema } from "mongoose";
import { type } from "os";

const articalSchema = new mongoose.Schema({


  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a separate User model
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },

  featured_image: {
    type: String, // store Cloudinary URL or local path
    required: true,
  },

  tags: [
    {
      type: String,
      trim: true,
    },
  ],

  short_description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300, // limit preview size
  },

  content: {
    type: String,
    required: true,
  },

  publish_date: {
    type: Date,
    default: Date.now,
  },

  category: {
    type: String,
    required: true
  },

  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile", // make sure this matches your Profile model name
    required: true
  },

  meta_title: {
    type: String,
    trim: true,
  },

  meta_description: {
    type: String,
    trim: true,
    maxlength: 160,
  },

  // // optional extra fields
  // views: [
  //   {
  //    view: {
  //     type: Number,
  //     default: 0,
  //     },
  //    viewdAt: {
  //     type: Date,
  //     default: Date.now
  //     }
  //   }
  // ],

  views: {
    total: { type: Number, default: 0 },        // all-time views
    today: { type: Number, default: 0 },        // daily views
    thisMonth: { type: Number, default: 0 },    // monthly views
    monetized: { type: Number, default: 0 },    // used for earning
    lastDay: Date,
    lastMonth: String
  },
  rpm :{
    type : Number,
    required : true
  },
  estimatedEarning :{
    type : Number,
    required : true
  },
  like: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      likedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  shares: {
    messenger: { type: Number, default: 0 },
    linkedin: { type: Number, default: 0 },
    snapchat: { type: Number, default: 0 },
    telegram: { type: Number, default: 0 },
    whatsapp: { type: Number, default: 0 },
    twitter: { type: Number, default: 0 },
    instagram: { type: Number, default: 0 },
    facebook: { type: Number, default: 0 },
    google: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  shareHistory: [
    {
      platform: String,
      sharedAt: { type: Date, default: Date.now }
    }
  ],


  isPublished: {
    type: Boolean,
    default: true,
  },

}, { timestamps: true })

export const Articals = mongoose.model("Artical", articalSchema)