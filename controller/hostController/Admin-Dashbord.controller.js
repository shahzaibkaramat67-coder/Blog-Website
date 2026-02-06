import asyncHandler from "../../utils/asyncHandler.js";
import Comment from "../../models/comment.model.js";
import { Articals } from "../../models/ArticalModel.js";
import { ArticleView } from "../../models/view.Model.js"
import ArticleLike from "../../models/like.Model.js";
import { ArticleShare } from "../../models/share.Model.js"

const dashboardController = asyncHandler(async (req, res) => {


  const artical = await Articals.countDocuments();


  const startMonthlyProfiles = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const endMonthlyProfiles = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)
  // const startMonthlyProfiles = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0);
  // const endMonthlyProfiles = new Date(new Date().getFullYear(), new Date().getMonth(), + 1, 0, 23, 59, 59);

  const MonthlyArticals = await Articals.countDocuments({ createdAt: { $gte: startMonthlyProfiles, $lte: endMonthlyProfiles } })



  const startDayProfile = new Date();
  startDayProfile.setHours(0, 0, 0, 0);
  const endDayProfile = new Date();
  endDayProfile.setHours(23, 59, 59, 999)

  const dayArticals = await Articals.countDocuments({ createdAt: { $gte: startDayProfile, $lte: endDayProfile } })



  // for views 


  const startDayview = new Date();
  startDayview.setHours(0, 0, 0, 0);
  const endDayview = new Date();
  endDayview.setHours(23, 59, 59, 999)


  const startMonthlyviews = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const endMonthlyviews = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)
  // const views = await ArticleView.aggregate([
  //   { $match: { isPublished: true } },
  //   {
  //     $group: {
  //       _id: null,
  //       totalViews: { $sum: "$total"},
  //       todayViews: { $sum: `$daily.${dayKey}.views`},
  //       monthlyViews: { $sum: `$monthly.${monthKey}.views`},
  //     }
  //   }
  // ])


  const views = await ArticleView.find()
  console.log("views", views);

  const now = new Date();
  const dayKey = now.toISOString().slice(0, 10)
  const monthKey = now.toISOString().slice(0, 7)

  // const  allViews = views.reduce((sum, view) => sum + (view?.monetized || 0), 0)
  // const  dailyViews = views.reduce((sum, view)=> sum + (view?.daily?.get(daykey)?.monetized || 0), 0)
  // const  totalMonthlyVires = views.reduce((sum, view)=> sum + (view?.monthly?.get(monthKey)?.monetized || 0), 0)

  const allViews = views.reduce((sum, view) => sum + (view?.monetized || 0), 0)
  const totalMonthlyVires = views.reduce((sum, view) => sum + (view?.monthly?.get(monthKey)?.monetized || 0), 0)
  const dailyViews = views.reduce((sum, view) => sum + (view?.daily?.get(dayKey)?.monetized || 0), 0)
  // console.log("totalViews", totalViews);
  // console.log("monthViews", monthViews);
  // console.log("todayViews", todayViews);

  //  total: 1,
  //           monetized: 1,
  //            earningsMills : perViewEarningMills,
  //           [`daily.${dayKey}.views`]: 1,
  //           [`daily.${dayKey}.monetized`]: 1,
  //           [`daily.${dayKey}.earningsMills`]: perViewEarningMills,
  //           [`monthly.${monthKey}.views`]: 1,
  //           [`monthly.${monthKey}.monetized`]: 1,
  //           [`monthly.${monthKey}.earningsMills`]: perViewEarningMills



  // const allViews = views[0]?.totalViews || 0;
  // const dailyViews = views[0]?.todayViews || 0;
  // const totalMonthlyVires = views[0]?.monthlyViews || 0;

  console.log({ allViews, dailyViews, totalMonthlyVires });


  // const allViews =  views[0].totalViews[0]?.totalViews || 0;
  // const totalMonthlyVires = views[0].monthlyViews[0]?.monthlyViews || 0;
  // const dailyViews =  views[0].todayViews[0]?.todayViews || 0;

  // console.log("allViews", allViews);
  // console.log("totalMonthlyVires", totalMonthlyVires);
  // console.log("dailyViews", dailyViews);


  // allViews,
  // totalMonthlyVires,
  // dailyViews,



  // const viewsTotal = await Articals.aggregate([
  //   { $group: { _id: null, total: { $sum: { $size: { $ifNull: ["$views", []] } } } } }
  // ]);

  // const allViews = viewsTotal[0]?.total || 0;
  // console.log("allViews", allViews);

  // const viewStartMonthly = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  // const viewEndMonthly = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)

  // const monthlyView = await Articals.aggregate([
  //   {
  //     $project: {
  //       views: {
  //         $filter: {
  //           input: "$views",
  //           as: "v",
  //           cond: {
  //             $and: [
  //               { $gte: ["$$v.viewdAt", viewStartMonthly] },
  //               { $lte: ["$$v.viewdAt", viewEndMonthly] }
  //             ]
  //           }
  //         }
  //       }
  //     }
  //   },
  //   { $group: { _id: null, totalMonthlyView: { $sum: { $size: { $ifNull: ["$views", []] } } } } }
  // ])

  // const totalMonthlyVires = monthlyView[0]?.totalMonthlyView || 0

  // const startDayView = new Date();
  // startDayView.setHours(0, 0, 0, 0)
  // const endDayView = new Date();
  // endDayView.setHours(23, 59, 59, 999)

  // const dayView = await Articals.aggregate([
  //   {
  //     $project: {
  //       views: {
  //         $filter: {
  //           input: "$views",
  //           as: "v",
  //           cond: {
  //             $and: [
  //               { $gte: ["$$v.viewdAt", startDayView] },
  //               { $lte: ["$$v.viewdAt", endDayView] }
  //             ]
  //           }
  //         }
  //       }
  //     }
  //   },
  //   { $group: { _id: null, totaldayView: { $sum: { $size: { $ifNull: ["$views", []] } } } } }
  // ])

  // const dailyViews = dayView[0]?.totaldayView || 0;

  // like section 

  const startMonthlyLike = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endMonthlyLike = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)
  const startDatLike = new Date();
  startDatLike.setHours(0, 0, 0, 0);
  const endDayLike = new Date();
  endDayLike.setHours(23, 59, 59, 999)


  const totalLike = await ArticleLike.countDocuments()
  const totalMonthlyLike = await ArticleLike.countDocuments({ createAt: { $gte: startMonthlyLike, $lte: endMonthlyLike } })
  const totalDayLike = await ArticleLike.countDocuments({ createAt: { $gte: startDatLike, $lte: endDayLike } })
  console.log("total like", totalLike);
  console.log("monthlyLike", totalMonthlyLike);
  console.log("day like", totalDayLike);


  // const Like = await Articals.aggregate([
  //   { $group: { _id: null, totalLike: { $sum: { $size: { $ifNull: ["$like", []] } } } } }
  // ])

  // const totalLike = Like[0]?.totalLike || 0;


  // const monthlyLike = await Articals.aggregate([
  //   {
  //     $project: {
  //       like: {
  //         $filter: {
  //           input: "$like",
  //           as: "l",
  //           cond: {
  //             $and: [
  //               { $gte: ["$$l.likedAt", startMonthlyLike] },
  //               { $lte: ["$$l.likedAt", endMonthlyLike] }
  //             ]
  //           }
  //         }
  //       }
  //     }
  //   },
  //   { $group: { _id: null, totalLike: { $sum: { $size: { $ifNull: ["$like", []] } } } } }
  // ])

  // const totalMonthlyLike = monthlyLike[0]?.totalLike || 0;



  // const dayLIke = await Articals.aggregate([
  //   {
  //     $project: {
  //       like: {
  //         $filter: {
  //           input: { $ifNull: ["$like", []] },
  //           as: "l",
  //           cond: {
  //             $and: [
  //               { $gte: ["$$l.likedAt", startDatLike] },
  //               { $lte: ["$$l.likedAt", endDayLike] }
  //             ]
  //           }
  //         }
  //       }
  //     }
  //   },
  //   { $group: { _id: null, totalLike: { $sum: { $size: "$like" } } } }
  // ])

  // const totalDayLike = dayLIke[0]?.totalLike || 0;

  // const share = await Articals.aggregate([
  //   { $unwind: "$shareHistory" },
  //   { $count: "totalShareCount" }
  // ])

  const totalShareCount = await ArticleShare.countDocuments()

  const startMonthlyShare = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endMonthlyShare = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)

  const monthlyShareTotal = await ArticleShare.countDocuments(
    {
      createdAt: { $gte: startMonthlyShare, $lte: endMonthlyShare }
    }
  )


  const startDatShare = new Date();
  startDatShare.setHours(0, 0, 0, 0);

  const endDayShare = new Date();
  endDayShare.setHours(23, 59, 59, 999);

  const dayTotalShare = await ArticleShare.countDocuments(
    {
      createdAt: { $gte: startDatShare, $lte: endDayShare }
    }
  )

  // const totalShareCount = share[0]?.totalShareCount || 0;
  // console.log("totalShareCount", totalShareCount);

  // const monthlyShare = await Articals.aggregate([
  //   { $unwind: "$shareHistory" },
  //   {
  //     $match: {
  //       "shareHistory.data": {
  //         $gte: startMonthlyShare,
  //         $lte: endMonthlyShare
  //       }
  //     }
  //   },
  //   { $count: "totalShareCount" }
  // ])

  // const monthlyShareTotal = monthlyShare[0]?.totalShareCount || 0;
  // console.log("monthlyShareTotal", monthlyShareTotal);


  // const dayShare = await Articals.aggregate([
  //   { $unwind: "$shareHistory" },
  //   {
  //     $match: {
  //       "shareHistory.data": {
  //         $gte: startDatShare,
  //         $lte: endDayShare
  //       }
  //     }
  //   },
  //   { $count: "totalShareCount" }
  // ])

  // const dayTotalShare = dayShare[0]?.totalShareCount || 0;
  // console.log("dayTotalShare", dayTotalShare);




  // Total comments
  const commettotal = await Comment.countDocuments();


  // Monthly comments
  const startMonthlyComment = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endMonthlyComment = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

  const monthlyComment = await Comment.aggregate([
    {
      $match: {
        createdAt: {               // <-- FIXED HERE
          $gte: startMonthlyComment,
          $lte: endMonthlyComment
        }
      }
    },
    { $count: "totalComments" }
  ]);

  const commentMonthly = monthlyComment[0]?.totalComments || 0;


  // Daily comments
  const startDatComment = new Date();
  startDatComment.setHours(0, 0, 0, 0);

  const endDayComment = new Date();
  endDayComment.setHours(23, 59, 59, 999);

  const dayComments = await Comment.aggregate([
    {
      $match: {
        createdAt: {               // <-- FIXED HERE
          $gte: startDatComment,
          $lte: endDayComment
        }
      }
    },
    { $count: "totalDayComment" }
  ]);

  const totalDayComments = dayComments[0]?.totalDayComment || 0;


  // now for admon dashbord graph 
  // const days = parseInt(req.query.days) || 7;

  // const labels = [];
  // let articalArr = [];
  // let likeArr = [];
  // let viewsArr = [];
  // let shareArr = [];
  // // let commentArr = [];

  // const startday = new Date()
  // startday.setDate(startday.getDate() - (days - 1));
  // startday.setHours(0, 0, 0, 0);

  // const endDay = new Date()
  // endDay.setHours(23, 59, 59, 999)

  // const artForGraph = await Articals.aggregate([
  //   {
  //     $facet: {
  //       views: [
  //         { $unwind: "$views" },
  //         { $match: { "views.viewdAt": { $gte: startday, $lte: endDay } } },
  //         {
  //           $group: {
  //             _id: { $dateToString: { format: "%Y-%m-%d", date: "$views.viewdAt" } },
  //             count: { $sum: 1 }
  //           }
  //         }
  //       ],
  //       like: [
  //         { $unwind: "$like" },
  //         { $match: { "like.likedAt": { $gte: startday, $lte: endDay } } },
  //         {
  //           $group: {
  //             _id: { $dateToString: { format: "%Y-%m-%d", date: "$like.likedAt" } },
  //             count: { $sum: 1 }
  //           }
  //         }
  //       ],
  //       shares: [
  //         { $unwind: "$shareHistory" },
  //         { $match: { "shareHistory.sharedAt": { $gte: startday, $lte: endDay } } },
  //         {
  //           $group: {
  //             _id: { $dateToString: { format: "%Y-%m-%d", date: "$shareHistory.sharedAt" } },
  //             count: { $sum: 1 }
  //           }
  //         }
  //       ],
  //       blogs: [
  //         { $match: { createdAt: { $gte: startday, $lte: endDay } } },
  //         {
  //           $group: {
  //             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
  //             count: { $sum: 1 }
  //           }
  //         }
  //       ]
  //     }
  //   }
  // ]);
  // // const comForGraph = await Comment.aggregate([
  // //   {$match :{createdAt :{$gte : startday, $lte : endDay}}},
  // //   {
  // //     $group :{
  // //       _id:{$dateToString :{format : "%Y-%m-%d", data : "$createdAt"}}
  // //     }
  // //   }
  // // ])

  // for (let i = 0; i < days; i++) {
  //   const date = new Date(startday);
  //   date.setDate(startday.getDate() + i); // read startday only
  //   const dayStr = date.toISOString().split("T")[0]; // YYYY-MM-DD format for aggregation

  //   labels.push(dayStr);

  //   const viewCount = artForGraph[0]?.views.find(x => x._id === dayStr)?.count || 0;
  //   const likeCount = artForGraph[0]?.like.find(x => x._id === dayStr)?.count || 0;
  //   const sharesCount = artForGraph[0]?.shares.find(x => x._id === dayStr)?.count || 0;
  //   const blogsCount = artForGraph[0]?.blogs.find(x => x._id === dayStr)?.count || 0;
  //   articalArr.push(blogsCount)
  //   likeArr.push(likeCount)
  //   viewsArr.push(viewCount)
  //   shareArr.push(sharesCount)
  //   // commentArr.push(blogsCount)

  // }




  return res.render("Admin.Dashbord/Admin-Dashbord", {
    layout: false, title: "Admin-Dashbord",
    artical,
    MonthlyArticals,
    dayArticals,
    allViews,
    totalMonthlyVires,
    dailyViews,
    totalLike,
    totalMonthlyLike,
    totalDayLike,
    totalShareCount,
    monthlyShareTotal,
    dayTotalShare,
    commettotal,
    commentMonthly,
    totalDayComments,
  })

})


const getChartData = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;



  // SAME graph aggregation logic you already wrote
  // build labels, viewsArr, likeArr, shareArr, articalArr


  const labels = [];
  const articalArr = [];
  const likeArr = [];
  const viewsArr = [];
  const shareArr = [];
  // let commentArr = [];

  const startday = new Date()
  startday.setDate(startday.getDate() - (days - 1));
  startday.setHours(0, 0, 0, 0);

  const endDay = new Date()
  endDay.setHours(23, 59, 59, 999)

  const articalGraph = await Articals.find()
  const viewForGraph = await ArticleView.find()
  const likeGraph = await ArticleLike.find()
  const shareGraph = await ArticleShare.find()

 


  for (let i = 0; i < days; i++) {
    let date = new Date(startday);
    date.setDate(startday.getDate() + i); // read startday only
    const dayStr = date.toISOString().split("T")[0]; // YYYY-MM-DD format for aggregation

    // const now = new Date()
    // const dayKey = now.toISOString().slice(0, 10)

    labels.push(dayStr);

     let blogsCount = 0;
    let likeCount = 0;
    let sharesCount = 0;
    let viewCount = 0;


   articalGraph.forEach(article =>{
    // const createArtile = article.createdAt.toISOString().slice(0, 10)
    if (article.createdAt.toISOString().slice(0, 10) === dayStr)  blogsCount+=1
   })

   

   likeGraph.forEach(like =>{
    // const likeAt = like?.likedAt.toISOString().slice(0, 10)
    if ( like?.likedAt.toISOString().slice(0, 10) === dayStr)  likeCount +=1;
   })

   shareGraph.forEach(share =>{
    // const sharedAt = share?.sharedAt.toISOString().slice(0, 10)
    if (share?.sharedAt.toISOString().slice(0, 10) === dayStr)  sharesCount +=1;
   })
   viewForGraph.forEach(view =>{

    viewCount += view?.daily?.get(dayStr)?.monetized || 0;

   })
    
    
    articalArr.push(blogsCount)
    likeArr.push(likeCount)
    shareArr.push(sharesCount)
    viewsArr.push(viewCount)
    // commentArr.push(blogsCount)
  }

  return res.json({
    labels,
    views: viewsArr,
    likes: likeArr,
    shares: shareArr,
    blogs: articalArr
  });
});


export {
  dashboardController,
  getChartData
}