import mongoose from "mongoose";

const articleShareSchema = new mongoose.Schema({
  article: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Article", 
    required: true, 
    index: true 
  },
    // user: { 
    //      type: mongoose.Schema.Types.ObjectId, 
    //       ref: "User", 
    //       required: true, 
    //   },
  platform: { 
    type: String, 
    enum: ['messenger','linkedin','snapchat','telegram','whatsapp','twitter','instagram','facebook','google','other'], 
    required: true 
  },
  sharedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const ArticleShare = mongoose.model("ArticleShare", articleShareSchema);
