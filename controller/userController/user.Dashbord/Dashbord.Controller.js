import { Articals } from "../../../models/ArticalModel.js";
import asyncHandler from "../../../utils/asyncHandler.js";
// import { like } from "../artical.controller.js";
import Comment from "../../../models/comment.model.js";
import { Profile } from "../../../models/profile.model.js";
// import Categorie from "../../../models/categorie.model.js";


const userDashboard = asyncHandler(async (req, res) => {

  const profile = await Profile.findOne({ User: req.user._id });
  // all blogs
  const allPostedArtical = await Articals.countDocuments({username: profile._id});

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
    { username: profile._id,
       createdAt: { $gte: startDay, $lte: endDay } 
      }
    )
  console.log("these are all today posted artical", todayArtical);


  //    Total like of all blogs
  const likes = await Articals.aggregate([
    {$match :{username: profile._id}},
    {
      $project: {
        likeCount: { $size: "$like" }
      }
    },
    {
      $group: {
        _id: null,
        totalLikeCount: { $sum: "$likeCount" }
      }
    }
  ])
  const allLikes = likes.length > 0 ? likes[0].totalLikeCount : 0;


  //    Monthly like of blogs 
  const startDataForLikes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endDateForLikes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)

  const monthlyLikesOfArtical = await Articals.aggregate([
     {$match :{username: profile._id}},
    { $unwind: "$like" },
    {
      $match: {
        "like.likedAt": {
          $gte: startDataForLikes, $lte: endDateForLikes
        }
      }
    },
    {
      $count: "monthlyLikes"
    }
  ])
  const monthlyLikes = monthlyLikesOfArtical.length > 0 ? monthlyLikesOfArtical[0].monthlyLikes : 0;

  console.log("this is monthly likes", monthlyLikes);
  // console.log("this is monthly likes", monthlyLikes);


  // day like for blog 

  const dayStart = new Date()
  dayStart.setHours(0, 0, 0, 0)
  const dayend = new Date()
  dayend.setHours(23, 59, 59, 999)

  const dayLikesOfArtical = await Articals.aggregate([
     {$match :{username: profile._id}},
    {
      $unwind: "$like"
    },
    {
      $match: {
        "like.likedAt": {
          $gte: dayStart, $lte: dayend
        }
      }
    },
    {
      $count: "toDayTotalLikes"
    }
  ])

  const dayLikes = dayLikesOfArtical.length > 0 ? dayLikesOfArtical[0].toDayTotalLikes : 0;

  console.log("this is day likes", dayLikes);



  const comments = await Comment.countDocuments({User : req.user._id});
  console.log("all commmensts are", comments);



  const monthlyCommentStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const monthlyCommentEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)


  const monthlyComment = await Comment.countDocuments(
    {  username: profile._id,
       createdAt: { $gte: monthlyCommentStart, $lte: monthlyCommentEnd } 
      }
    )
  console.log("these are monylt commments ", monthlyComment);

  const dayCommetStart = new Date()
  dayCommetStart.setHours(0, 0, 0, 0)


  const dayCommetEnd = new Date()
  dayCommetEnd.setHours(23, 59, 59, 999)

  const dayCommets = await Comment.countDocuments(
    {  username: profile._id,
       createdAt: { $gte: dayCommetStart, $lte: dayCommetEnd }
       
      }
    
    )
  console.log("these are  day comments", dayCommets);





  // const profile = await Profile.findOne({User : req.user._id});
  const Categorie = profile.category;


  const articalcount = await Articals.aggregate([
    {$match : {username: profile._id}},
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

  //   console.log("categoryState", categoryState);

  const Artical = await Articals.find().select("views");



  let totalViews = 0;

  Artical.forEach((artical) => {
    totalViews += artical.views.length;
  });

  const startMonthlyViews = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endMonthlyViews = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999);

  let monthlyViews = await Articals.aggregate([
    {$match : {username: profile._id}},
    { $unwind: "$views" },
    {
      $match: {
        "views.viewdAt": { $gte: startMonthlyViews, $lte: endMonthlyViews }
      }
    },
    { $count: "monthlyViews" }
  ]);

  monthlyViews = monthlyViews.length > 0 ? monthlyViews[0].monthlyViews : 0;


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

  const startViewDay = new Date()
  startViewDay.setHours(0, 0, 0, 0);
  const endViewDay = new Date();
  endViewDay.setHours(23, 59, 59, 999)

  let dailyViews = await Articals.aggregate([
     {$match : {username: profile._id}},
    { $unwind: "$views" },
    {
      $match: {
        "views.viewdAt": { $gte: startViewDay, $lte: endViewDay }
      }
    },
    { $count: "dailyViews" }
  ])

  dailyViews = dailyViews.length > 0 ? dailyViews[0].dailyViews : 0;



  /*****======== Section share Start ==========*****/


  const articals = await Articals.find({username: profile._id}).select("shares");

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
     {$match : {username: profile._id}},
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
     {$match : {username: profile._id}},
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
    monthlyViews,
    dailyViews,
    totalShareArticals,
    monthlyShares,
    dayShares,

  });

})

const getDashbordChartData = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const profile = await Profile.findOne({ User: req.user._id });
  const labels = [];
  const viewsArr = [];
  const likesArr = [];
  const sharesArr = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    labels.push(`${date.getMonth() + 1}/${date.getDate()}`);

    // Views
    const dailyV = await Articals.aggregate([
       {$match : {username: profile._id}},
      { $unwind: "$views" },
      { $match: { "views.viewdAt": { $gte: start, $lte: end } } },
      { $count: "count" }
    ]);
    viewsArr.push(dailyV.length > 0 ? dailyV[0].count : 0);

    // Likes
    const dailyL = await Articals.aggregate([
       {$match : {username: profile._id}},
      { $unwind: "$like" },
      { $match: { "like.likedAt": { $gte: start, $lte: end } } },
      { $count: "count" }
    ]);
    likesArr.push(dailyL.length > 0 ? dailyL[0].count : 0);

    // Shares
    const dailyS = await Articals.aggregate([
       {$match : {username: profile._id}},
      { $unwind: "$shareHistory" },
      { $match: { "shareHistory.sharedAt": { $gte: start, $lte: end } } },
      { $count: "count" }
    ]);
    sharesArr.push(dailyS.length > 0 ? dailyS[0].count : 0);

  
  }

    res.json({
      labels,
      views: viewsArr,
      likes: likesArr,
      shares: sharesArr
    });
})



export {
  userDashboard,
  getDashbordChartData
}

