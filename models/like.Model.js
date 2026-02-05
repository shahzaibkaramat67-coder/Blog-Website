import mongoose from "mongoose";

const articleLikeSchema = new mongoose.Schema({
    article: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "Article", 
         required: true, 
         index: true 
        },
    user: { type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
    },
    likedAt: { 
        type: Date, 
        default: Date.now 
    },
}, { timestamps: true });

const ArticleLike = mongoose.model("articleLike", articleLikeSchema);

export default ArticleLike;
