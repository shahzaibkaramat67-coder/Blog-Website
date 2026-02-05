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
   totalLikes: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
  totalShares: { type: Number, default: 0 },
 
  // share: {
  //   type: Number,
  //   default: 0
  // },
  rpm: {
    type: Number,
    required: true
  },
  estimatedEarningMills: { type: Number, default: 0 },


  isPublished: {
    type: Boolean,
    default: true,
  },

}, { timestamps: true })

export const Articals = mongoose.model("Artical", articalSchema)