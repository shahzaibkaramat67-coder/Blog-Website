import { Articals } from "../../../models/ArticalModel.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import { like } from "../artical.controller.js";
import Comment from "../../../models/comment.model.js";
import { Profile } from "../../../models/profile.model.js";
import Categorie from "../../../models/categorie.model.js";


const allPostedBlogs = asyncHandler(async (req, res) => {

    // all blogs
    const allPostedArtical = await Articals.countDocuments();

    console.log("these are all posted artical", allPostedArtical);
    const profile = await Profile.findOne({ User: req.user._id });



    // monthlyBlog

    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)
    const monthlyCreatedArtical = await Articals.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } })

    console.log("these are all monthly posted artical", monthlyCreatedArtical);


    // todayBlog
    const startDay = new Date()
    startDay.setHours(0, 0, 0, 0)
    const endDay = new Date()
    endDay.setHours(23, 59, 59, 999)

    const todayArtical = await Articals.countDocuments({ createdAt: { $gte: startDay, $lte: endDay } })
    console.log("these are all today posted artical", todayArtical);


    //    Total like of all blogs
    const likes = await Articals.aggregate([
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
    const allLikes = likes.length > 0 ? likes[0].totalLikeCount : 0


    //    Monthly like of blogs 
    const startDataForLikes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDateForLikes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)

    const monthlyLikesOfArtical = await Articals.aggregate([
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



    const comments = await Comment.countDocuments();
    console.log("all commmensts are", comments);



    const monthlyCommentStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const monthlyCommentEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)


    const monthlyComment = await Comment.countDocuments({ createdAt: { $gte: monthlyCommentStart, $lte: monthlyCommentEnd } })
    console.log("these are monylt commments ", monthlyComment);

    const dayCommetStart = new Date()
    dayCommetStart.setHours(0, 0, 0, 0)


    const dayCommetEnd = new Date()
    dayCommetEnd.setHours(23, 59, 59, 999)

    const dayCommets = await Comment.countDocuments({ createdAt: { $gte: dayCommetStart, $lte: dayCommetEnd } })
    console.log("these are  day comments", dayCommets);





    // const profile = await Profile.findOne({User : req.user._id});
    const Categorie = profile.category;


    const articalcount = await Articals.aggregate([
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
   startViewDay.setHours(0,0,0,0);
   const endViewDay = new Date();
   endViewDay.setHours(23, 59, 59, 999)

   let dailyViews = await Articals.aggregate([
     {$unwind : "$views"},
    {
        $match : {
            "views.viewdAt" : {$gte : startViewDay, $lte : endViewDay}
        }
    },
    {$count : "dailyViews"}
   ])

  dailyViews = dailyViews.length > 0 ? dailyViews[0].dailyViews : 0;



//   share blogs code 



  
 return res.render("Dashbord/my-Dashboard.ejs", {
        layout: false, title: 'Dashbord',
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
        dailyViews
    })


})





export {
    allPostedBlogs,
}

