import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
     trim: true,
  },

  Topic: [
    {
      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim : true
      },
      Title :{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      }
    }

  ],


  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const categorie = mongoose.model('categories', categorySchema);


