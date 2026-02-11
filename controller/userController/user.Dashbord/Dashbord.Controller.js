import { Articals } from "../../../models/ArticalModel.js";
import asyncHandler from "../../../utils/asyncHandler.js";
// import { like } from "../artical.controller.js";
import Comment from "../../../models/comment.model.js";
import { Profile } from "../../../models/profile.model.js";
import ArticleLike from "../../../models/like.Model.js";
import { ArticleView } from "../../../models/view.Model.js";
import { ArticleShare } from "../../../models/share.Model.js";
import User from "../../../models/Signup.model.js";
// import { useId } from "react";
// import Categorie from "../../../models/categorie.model.js";


const userDashboard = asyncHandler(async (req, res) => {

  const userId = req.user._id

  console.log("tvdyt3vyue che cue e e   userId", userId);
  

  const profile = await Profile.findOne({ User: req.user._id });
  // all blogs
  const allPostedArtical = await Articals.countDocuments({ username: profile._id });

  console.log("these are all posted artical", allPostedArtical);



  // monthlyBlog

  const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)
  const monthlyCreatedArtical = await Articals.countDocuments(
    {
      username: profile._id,
      createdAt: { $gte: startDate, $lte: endDate }
    }
  )

  console.log("these are all monthly posted artical", monthlyCreatedArtical);


  // todayBlog
  const startDay = new Date()
  startDay.setHours(0, 0, 0, 0)
  const endDay = new Date()
  endDay.setHours(23, 59, 59, 999)

  const todayArtical = await Articals.countDocuments(
    {
      username: profile._id,
      createdAt: { $gte: startDay, $lte: endDay }
    }
  )
  console.log("these are all today posted artical", todayArtical);


  //    Total like of all blogs
  const allLikes = await ArticleLike.countDocuments(
    {user : userId}
  );
  
  console.log("allLikes", allLikes);
  


  //    Monthly like of blogs 
  const startDataForLikes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endDateForLikes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)

  const monthlyLikes = await ArticleLike.countDocuments({
       user : userId,
    createdAt : {$gte : startDataForLikes, $lte : endDateForLikes}
  })
 

  const dayStart = new Date()
  dayStart.setHours(0, 0, 0, 0)
  const dayend = new Date()
  dayend.setHours(23, 59, 59, 999)

  const dayLikes = await ArticleLike.countDocuments({
     user : userId,
    createdAt :{$gte : dayStart, $lte : dayend}
  })

  console.log("dayLikes", dayLikes);
  

  console.log("this is day likes", dayLikes);



  const comments = await Comment.countDocuments({ User: req.user._id });
  console.log("all commmensts are", comments);



  const monthlyCommentStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const monthlyCommentEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)


  const monthlyComment = await Comment.countDocuments(
    {
      User : req.user._id,
      createdAt: { $gte: monthlyCommentStart, $lte: monthlyCommentEnd }
    }
  )
  console.log("these are monylt commments ", monthlyComment);

  const dayCommetStart = new Date()
  dayCommetStart.setHours(0, 0, 0, 0)


  const dayCommetEnd = new Date()
  dayCommetEnd.setHours(23, 59, 59, 999)

  const dayCommets = await Comment.countDocuments(
    {
      User : req.user._id,
      createdAt: { $gte: dayCommetStart, $lte: dayCommetEnd }

    }

  )
  console.log("these are  day comments", dayCommets);





  // const profile = await Profile.findOne({User : req.user._id});
  const Categorie = profile.category;


  const articalcount = await Articals.aggregate([
    { $match: { username: profile._id } },
    { $match: { category: { $in: Categorie } } },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ])



  const categoryState = Categorie.map(cat => {
    const found = articalcount.find(c => c._id === cat)
    return {
      name: cat,
      count: found ? found.count : 0
    }
  })


//  const dayviewsStart = new Date()
//   dayviewsStart.setHours(0, 0, 0, 0)


  // const dayviewsEnd = new Date()
  // dayviewsEnd.setHours(23, 59, 59, 999)

  
  // const monthlyViewsStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  // const monthlyViewsEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)




// const views = await ArticleView.aggregate([
//   {$match :{User :  req.user._id}},
//   {
//     $group:{
//       _id : null,
//       totalViews: {$sum : "$monetized"},
//       monthViews: {$sum : {$ifNull:[`${month} $monthly.${monthKey}.views`]}},
//       todayViews:  {$sum : "$daily.monetized"}
//     } 
//     //  [`daily.${dayKey}.views`]: 1,
//     //       [`monthly.${monthKey}.views`]: 1
//   }
// ]);
// console.log("thsi is allviews ",views);


// const viewDoc = await ArticleView.findOne({ article: articleId });

// const totalViews = viewDoc?.monthly?.total || 0;

// console.log("Total Views:", totalViews);


const now = new Date();

const dayKey = now.toISOString().slice(0, 10);   // "2026-01-20"
const monthKey = dayKey.slice(0, 7);             // "2026-01"


// const month = new Date().toDateString().split(0, 7)

const views = await ArticleView.find({User : req.user._id})

console.log("view", views);

// console.log("totalViews monetized", views[0].monetized);
// console.log("totalViews total", views[0].total);
// console.log("monthViews", monthViews);
// console.log("todayViews", todayViews);

const totalViews = views.reduce((sum, view) => sum +(view?.monetized || 0), 0)
const monthViews = views.reduce((sum, view)=> sum +(view?.monthly?.get(monthKey)?.monetized || 0), 0)
const todayViews = views.reduce((sum, view) => sum +(view?.daily?.get(dayKey)?.monetized || 0), 0)
console.log("totalViews", totalViews);
console.log("monthViews", monthViews);
console.log("todayViews", todayViews);
// const totalViews = views[0]?.monetized || 0;
// const monthViews = views[0]?.monthly?.get(monthKey)?.monetized || 0;
// const todayViews = views[0]?.daily?.get(dayKey)?.monetized || 0;



// console.log({ totalViews, todayViews, monthViews });


//   const now = new Date();
// const todayStr = now.toDateString();
// const monthStr = `${now.getFullYear()}-${now.getMonth() + 1}`;

// if (!article.views.lastDay || article.views.lastDay.toDateString() !== todayStr) {
//   article.views.today = 0;
// }

// if (!article.views.lastMonth || article.views.lastMonth !== monthStr) {
//   article.views.thisMonth = 0;
// }

// article.views.total += 1;
// article.views.today += 1;
// article.views.thisMonth += 1;

// article.views.lastDay = now;
// article.views.lastMonth = monthStr;

// await article.save();

  


  //   console.log("categoryState", categoryState);

  // const Artical = await Articals.find().select("views");



  // let totalViews = 0;

  // Artical.forEach((artical) => {
  //   totalViews += artical.views.length;
  // });

  // const totalArticalViews = await Articals.aggregate([
  //   {$match :{username : profile._id}},
  //   {$unwind : "$views"},
  //   {
  //     $group :{
  //       _id : null, totalViews :{$sum : "$views.view"}
  //     }
  //   }

  // ])

  // console.log("dashbord totalArticalViews", totalArticalViews);
  // const totalViews = totalArticalViews.length  ? totalArticalViews[0].totalViews : 0;



  // const startMonthlyViews = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  // const endMonthlyViews = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999);

  // let monthlyViews = await Articals.aggregate([
  //   {$match : {username: profile._id}},
  //   { $unwind: "$views" },
  //   {
  //     $match: {
  //       "views.viewdAt": { $gte: startMonthlyViews, $lte: endMonthlyViews }
  //     }
  //   },
  //   { $count: "monthlyViews" }
  // ]);

  // monthlyViews = monthlyViews.length > 0 ? monthlyViews[0].monthlyViews : 0;


  //    const startMonthDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  //   const  endMonthDay = new Date(new Date().getFullYear(), new Date().getMonth(), + 1, 23, 59, 59, 999)



  // let monthlyViews = await Articals.aggregate([
  //      {$unwind : "$views"},
  //     {
  //         $match : {
  //             "views.viewdAt" : {$gte : startMonthDay, $lte : endMonthDay}
  //         }
  //     },
  //     {$count : "monthlyViews"}
  // ])

  //   monthlyViews = monthlyViews.length > 0 ? monthlyViews[0].monthlyViews : 0;

  // const startViewDay = new Date()
  // startViewDay.setHours(0, 0, 0, 0);
  // const endViewDay = new Date();
  // endViewDay.setHours(23, 59, 59, 999)

  // let dailyViews = await Articals.aggregate([
  //    {$match : {username: profile._id}},
  //   { $unwind: "$views" },
  //   {
  //     $match: {
  //       "views.viewdAt": { $gte: startViewDay, $lte: endViewDay }
  //     }
  //   },
  //   { $count: "dailyViews" }
  // ])

  // dailyViews = dailyViews.length > 0 ? dailyViews[0].dailyViews : 0;



  /*****======== Section share Start ==========*****/


  const articals = await Articals.find({ username: profile._id }).select("shares");

  let totalShareArticals = 0;
  articals.forEach(artical => {
    if (artical.shares) {
      Object.values(artical.shares).forEach(share => {
        totalShareArticals += share
      })
    }

  })

  console.log("totalShareArticals", totalShareArticals);

  // Monthly shares
  const startMonthlyShare = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endMonthlyShare = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

  let monthlyShares = await Articals.aggregate([
    { $match: { username: profile._id } },
    { $unwind: "$shareHistory" },
    { $match: { "shareHistory.sharedAt": { $gte: startMonthlyShare, $lte: endMonthlyShare } } },
    { $count: "monthlyShareCount" }
  ]);

  monthlyShares = monthlyShares.length > 0 ? monthlyShares[0].monthlyShareCount : 0;
  console.log("monthlyShares", monthlyShares);

  // Daily shares
  const startDayShare = new Date();
  startDayShare.setHours(0, 0, 0, 0);

  const endDayShare = new Date();
  endDayShare.setHours(23, 59, 59, 999);

  let dayShares = await Articals.aggregate([
    { $match: { username: profile._id } },
    { $unwind: "$shareHistory" },
    { $match: { "shareHistory.sharedAt": { $gte: startDayShare, $lte: endDayShare } } },
    { $count: "dailyShareCount" }
  ]);

  dayShares = dayShares.length > 0 ? dayShares[0].dailyShareCount : 0;
  console.log("dayShares", dayShares);



  // (1) DAILY SERIES FOR GRAPH (last N days)
  // GET /dashboard/performance?range=30
  /*****======== PERFORMANCE GRAPH (Shares, Likes, Views) ==========*****/

  // Example for last 7 days


  /***** ======== Section share END ========= *****/



  res.render("Dashbord/my-Dashboard.ejs", {
    layout: false,
    title: 'Dashboard',
    allPostedArtical,
    monthlyCreatedArtical,
    todayArtical,
    likes: allLikes,
    monthlyLikes,
    dayLikes,
    comments,
    monthlyComment,
    dayCommets,
    categoryState,
    totalViews,
    monthViews,
    todayViews,
    totalShareArticals,
    monthlyShares,
    dayShares,

  });

})

const getDashbordChartData = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const userId = req.user._id

  // Fetch all articles once
  // .select("views.daily like shareHistory");
  // console.log("articles",articles);
  const viewsArticles = await ArticleView.find({ User: userId })
  const likedArticals = await ArticleLike.find({user : userId})
  const shareArticals = await ArticleShare.find({user : userId})
  // console.log("viewsArticles", viewsArticles);
  // console.log("likedArtical", likedArticals);
  // console.log("shareArtical", shareArticals);
  
    

  const labels = [];
  const viewsArr = [];
  const likesArr = [];
  const sharesArr = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
  const dayKey = date.toISOString().slice(0, 10); // ✅ DEFINE HERE
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    labels.push(date.toISOString().slice(0, 10)); // MM-DD

    let dayViews = 0;
    let dayLikes = 0;
    let dayShares = 0;
    // console.log("dayViews", dayViews);
    // console.log("dayLikes", dayLikes);
    // console.log("dayViews", dayViews);
    

   viewsArticles?.forEach(articalView =>{
      dayViews += articalView.daily?.get(dayKey)?.monetized || 0 
   })
    likedArticals.forEach(like =>{
      const likeDate =  like.likedAt.toISOString().slice(0, 10)
      if (likeDate === dayKey)  dayLikes +=1
    })
    
    shareArticals.forEach(shareArtical =>{
       const shareDate = shareArtical.sharedAt.toISOString().slice(0, 10)
       if (shareDate === dayKey) dayShares +=1
    })

    viewsArr.push(dayViews);
    likesArr.push(dayLikes);
    sharesArr.push(dayShares);
  }

  return res.json({
    labels,
    views: viewsArr,
    likes: likesArr,
    shares: sharesArr,
  });
});

// const getDashbordChartData = asyncHandler(async (req, res) => {
//   const days = parseInt(req.query.days) || 30;
//   const profile = await Profile.findOne({ User: req.user._id });
//   const labels = [];
//   const viewsArr = [];
//   const likesArr = [];
//   const sharesArr = [];

//   for (let i = days - 1; i >= 0; i--) {
//     const date = new Date();
//     date.setDate(date.getDate() - i);

//     const start = new Date(date);
//     start.setHours(0, 0, 0, 0);
//     const end = new Date(date);
//     end.setHours(23, 59, 59, 999);

//     labels.push(`${date.getMonth() + 1}/${date.getDate()}`);

//     // Views
//     const dailyV = await Articals.aggregate([
//        {$match : {username: profile._id}},
//       { $unwind: "$views" },
//       { $match: { "views.viewdAt": { $gte: start, $lte: end } } },
//       { $count: "count" }
//     ]);
//     viewsArr.push(dailyV.length > 0 ? dailyV[0].count : 0);

//     // Likes
//     const dailyL = await Articals.aggregate([
//        {$match : {username: profile._id}},
//       { $unwind: "$like" },
//       { $match: { "like.likedAt": { $gte: start, $lte: end } } },
//       { $count: "count" }
//     ]);
//     likesArr.push(dailyL.length > 0 ? dailyL[0].count : 0);

//     // Shares
//     const dailyS = await Articals.aggregate([
//        {$match : {username: profile._id}},
//       { $unwind: "$shareHistory" },
//       { $match: { "shareHistory.sharedAt": { $gte: start, $lte: end } } },
//       { $count: "count" }
//     ]);
//     sharesArr.push(dailyS.length > 0 ? dailyS[0].count : 0);


//   }

//     res.json({
//       labels,
//       views: viewsArr,
//       likes: likesArr,
//       shares: sharesArr
//     });
// })



export {
  userDashboard,
  getDashbordChartData
}

