import { format } from "path";
import { Articals } from "../../../models/ArticalModel.js";
import { Profile } from "../../../models/profile.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ArticleLike from "../../../models/like.Model.js";
import { ArticleView } from "../../../models/view.Model.js";
import { ArticleShare } from "../../../models/share.Model.js";
import { group, log } from "console";
import earningCalculate from "../../../helper/earningCalculation.js";
import mongoose from "mongoose";



// Show all posts in table
const postInTable = asyncHandler(async (req, res) => {
  // const useId = req.user._id 
  // const profile = await Profile.find({})
  // const articals = await Articals.find({ User: req.user._id }).sort({ createdAt: -1 }).select("title featured_image publish_date views.monetized  estimatedEarning shareHistory like");
  const articles = await Articals.find({ User: req.user._id })
        .select("title featured_image publish_date totalLikes totalViews totalShares estimatedEarningMills")

  // console.log("artical", articals);


const Analysist = articles.map(article => ({
  _id: article._id, //  ADD THIS
  title: article.title,
  featured_image: article.featured_image,
  publish_date: article.publish_date,
  totalLikes: article.totalLikes,
  totalViews: article.totalViews,
  totalShares: article.totalShares,
  estimatedEarningMills: (article.estimatedEarningMills / 1000).toFixed(3)
}));


  // console.log("Analysist", Analysist);

  return res.render("Dashbord/postsAnalytics", {
    layout: false,
    title: "postsAnalytics",
    Analysist: Analysist,
    // articalTables
  });


});

const chart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const days = parseInt(req.query.days) || 7;

  const articleId = new mongoose.Types.ObjectId(id);

  /* ---------- LIKES ---------- */
  const likesAgg = await ArticleLike.aggregate([
    { $match: { article: articleId } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$likedAt" }
        },
        total: { $sum: 1 }
      }
    }
  ]);

  /* ---------- SHARES ---------- */
  const sharesAgg = await ArticleShare.aggregate([
    { $match: { article: articleId } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$sharedAt" }
        },
        total: { $sum: 1 }
      }
    }
  ]);

  /* ---------- VIEWS (MAP BASED) ---------- */
  const viewDoc = await ArticleView.findOne({
    article: articleId,
    User: userId
  });

  const labels = [];
  const views = [];
  const likes = [];
  const shares = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const dayKey = date.toISOString().slice(0, 10); // YYYY-MM-DD
    labels.push(dayKey);

    /* ---- VIEWS ---- */
    const dayView = viewDoc?.daily?.get(dayKey);
    views.push(dayView?.views || 0);

    /* ---- LIKES ---- */
    const likeDay = likesAgg.find(l => l._id === dayKey);
    likes.push(likeDay?.total || 0);

    /* ---- SHARES ---- */
    const shareDay = sharesAgg.find(s => s._id === dayKey);
    shares.push(shareDay?.total || 0);
  }

  return res.json({ labels, views, likes, shares });
});

export { postInTable, chart };
