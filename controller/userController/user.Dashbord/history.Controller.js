import { populate } from "dotenv";
import User from "../../../models/Signup.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import { Articals } from "../../../models/ArticalModel.js";

const getHistoryPage = asyncHandler(async(req, res)=>{
    const userId = req.user._id
  // Find the user and populate history.article
  const user = await User.findById(userId)
    .populate({
      path: "history.article",
      select: "title featured_image short_description username totalLikes totalViews totalShares",
      populate :{
          path : "username",
        select : "username"
      }
    })
    .lean();

    console.log("user.history", user.history);
    

  // user.history is now an array of objects with full article data
  const allArtical = user.history.map(h => ({
    articleId: h.article?._id,
    title: h.article?.title,
    featured_image: h.article?.featured_image,
    short_description: h.article?.short_description,
    username: h.article?.username.username,
    totalLikes: h.article?.totalLikes,
    totalViews: h.article?.totalViews,
    totalShares: h.article?.totalShares,
    viewedAt: h.createAt
  }));

  console.log("allArtical", allArtical);
  

     res.render("Dashbord/history", {
      
        title : "history",
        allArtical
     })
})



// const articeLimitList = asyncHandler(async(req, res) =>{
// console.log("theis is page is for limit");

// const page = parseInt(req.params.page) || 2;
// const userId = req.user._id
// console.log("theis is page is for limit", page);



// })

export {
    getHistoryPage,
    // articeLimitList
}