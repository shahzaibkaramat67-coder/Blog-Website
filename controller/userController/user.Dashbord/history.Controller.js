import { populate } from "dotenv";
import User from "../../../models/Signup.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";

const getHistoryPage = asyncHandler(async(req, res)=>{
    const userId = req.user._id
  // Find the user and populate history.article
  const user = await User.findById(userId)
    .populate({
      path: "history.article",
      select: "title featured_image short_description username totalLikes totalViews totalShares"
    })
    .lean();

    console.log("user.history", user.history);
    

  // user.history is now an array of objects with full article data
  const allArtical = user.history.map(h => ({
    articleId: h.article?._id,
    title: h.article?.title,
    featured_image: h.article?.featured_image,
    short_description: h.article?.short_description,
    username: h.article?.username,
    totalLikes: h.article?.totalLikes,
    totalViews: h.article?.totalViews,
    totalShares: h.article?.totalShares,
    viewedAt: h.createAt
  }));

  console.log("allArtical", allArtical);
  

     res.render("Dashbord/history", {
        layout : false,
        title : "history",
        allArtical
     })
})

export {
    getHistoryPage
}