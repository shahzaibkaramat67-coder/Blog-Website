import mongoose from "mongoose";

const dailySchema = new mongoose.Schema(
  {
    views: { type: Number, default: 0 },
    monetized: { type: Number, default: 0 },
    earningsMills: { type: Number, default: 0 },
  },
  { _id: false } // no separate _id for each day
);

const articleViewSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artical", // matches your Articals collection
      required: true,
     
    },
    User :{
       type : mongoose.Schema.Types.ObjectId,
       ref : "User",
       required: true,
    },
     total: { type: Number, default: 0 },        // total views
    monetized: { type: Number, default: 0 },   // total monetized views
    earningsMills: { type: Number, default: 0 },

    // store daily views as a map: { "2026-01-17": {...}, "2026-01-16": {...} }
    daily: {
      type: Map,
      of: dailySchema,
      default: {}
    },

    // store monthly views as a map: { "2026-01": {...}, "2026-02": {...} }
    monthly: {
      type: Map,
      of: dailySchema,
      default: {}
    },

    lastDay: String,     // last day a view was recorded
    lastMonth: String,   // last month a view was recorded
    lastViewedAt: Date   // exact timestamp of last view
  },
  { timestamps: true }
);

articleViewSchema.index({ article: 1, User: 1 }, { unique: true });


export const ArticleView = mongoose.model("ArticleView", articleViewSchema);
