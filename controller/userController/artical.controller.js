import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import uploadOnCloudinary from "../../utils/cloudinary.js";
import { Articals } from "../../models/ArticalModel.js";
import { Profile } from "../../models/profile.model.js";
import mongoose, { now, Query } from "mongoose";
import User from "../../models/Signup.model.js";
import { url } from "inspector";
// import Category from "../../models/categorie.model.js";
import Category from "../../models/categorie.model.js";
import { RPMGroup } from "../../models/RPMGroup.model.js";
import earningCalculate from "../../helper/earningCalculation.js";
import { fail } from "assert";
import { format } from "path";

const articalUpload = asyncHandler(async (req, res) => {

  const { title, tags, short_description, content, publish_date, meta_title, meta_description, category } = req.body;

  const profileCategories = await Profile.findOne({User : req.user._id}).select("category")

  if (!profileCategories) {
     req.flash("error", "something went is wrong")
        return res.redirect("/");
  }

  if (!profileCategories.category.includes(category)) {
    req.flash("error", "The Category You have enter is not match to you selected Categories")
        return res.redirect("/");
  }

  console.log("category", category);

  const imageUrl = await uploadOnCloudinary(req.file?.path)

  if (!imageUrl) {
    throw new ApiError("the artical image is messing", 404);

  }

  const profile = await Profile.findOne({ User: req.user._id });
  //   const cate = await Category.find()
  // console.log("cate", cate);


  const categoryData  = await Category.aggregate([
    { $unwind: "$topics" },
    { $match: { "topics.slug": category } },
    {
      $project: {
        rpm_group_id: "$topics.rpm_group_id"
      }
    }

  ])
  console.log("this is Categories", categoryData );


  const rpm_group_id = categoryData[0].rpm_group_id
  console.log("this is rpm_group_id", rpm_group_id);
  
  const RPM = await RPMGroup.findById(rpm_group_id).select("rate_per_1000")
  console.log("RPM", RPM);

  if (!RPM) {
    throw new ApiError("you have wrong RPM data ", 400);

  }

  //  const artical





  const createArtical = await Articals.create({
    User: req.user._id,
    title,
    featured_image: imageUrl.secure_url,
    tags,
    short_description,
    content,
    publish_date,
    username: profile._id,
    category,
    rpm: RPM.rate_per_1000,
    // share,
    estimatedEarningMills: 0,
    meta_description,
    meta_title,
    // author: profile._id,
  })

  console.log("this artical befor populateartical", createArtical);


  const populateArtical = await Articals.findById(createArtical._id).populate("username", "username")

  // console.log("this artical after populateartical", createArtical);




  if (!createArtical) {
    throw new ApiError("something went wrong to create  createArtical ", 500);

  }

  res.redirect('/blog')
  // return res
  //   .status(201)
  //   .json(new ApiResponse(200, createArtical, "the Artical is create successfully"))

})




// })

const getArticales = asyncHandler(async (req, res) => {
  const topicSlug = req.params.slug || null;

  const page = parseInt(req.query.page) || 1;
  const limit = 2;
  const skip = (page - 1) * limit;
  const filter = {};
  const Topic = req.query.Search;

  if (Topic) {
    filter.title = { $regex: Topic, $options: "i" };
  }

  // Optionally filter by category or slug if needed
  if (topicSlug) {
    filter.category = topicSlug;
  }

  const totalArticals = await Articals.countDocuments(filter);
  const allArtical = await Articals.find(filter)
    .populate("username", "username")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalArticals / limit) || 1;

  res.render("blog", {
    title: "Blog",
    allArtical,
    currentPage: page,
    searchQuery: Topic || "",
    totalPages,
    SideAllArtical: [], // ✅ Prevent undefined error
    topicSlug, // ✅ Define for pagination URLs
  });
});


// const getArticalesById = asyncHandler(async (req, res, next) => {
//   const Artical = await Articals.findById(req.params.id)
//     .populate("username", "username")
//   if (!Artical) {
//     throw new ApiError("articalId not found ", 404);
//   }

//   // const comments = await Comment.find().sort({createdAt : -1})


//   // res.render('blog-contant', { title : 'blog-contant', articalId, comments})
//   // res.render('blog-contant', { title: 'blog-contant', Artical })
//   req.artical = Artical
//   next()


// })


const categoryShareToArtical = asyncHandler(async (req, res) => {

  //  Make sure to use findOne, not findById
  const profile = await Profile.findOne({ User: req.user._id })



  return res.render("Dashbord/Artical", {
    layout: false,
    title: "Artical",
    category: profile ? profile.category : []
  });
});



const getSearchAndRandomArticals = asyncHandler(async (req, res) => {
  const Search = decodeURIComponent(req.query.Search || "").replace(/\+/g, " ").trim();
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const skip = (page - 1) * limit;
  let allArtical = [];
  let SideAllArtical = [];
  let totalArticals = 0;

  totalArticals = await Articals.countDocuments();
  allArtical = await Articals.find()
    .populate("username", "username")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  let totalPages = Math.ceil(totalArticals / limit);

  if (Search !== "") {
    SideAllArtical = await Articals.find({
      title: { $regex: Search, $options: "i" },
    })
      .populate("username", "username")
      .sort({ createdAt: -1 });
  }

  res.render("blog", {
    title: Search ? `${Search}` : "Blogs",
    SideAllArtical,
    searchQuery: Search || "",
    currentPage: page,
    totalPages,
    allArtical,
    topicSlug: null, // ✅ Fix ReferenceError
  });
});


// const sideBlogContent = asyncHandler(async(req, res) =>{

// })













// const like = asyncHandler(async (req, res) => {
//   const { articalId } = req.params;
//   const userId = req.user?.id;

//   if (!articalId) {
//     throw new ApiError("id is missing for like", 400);
//   }

//   const artical = await Articals.findById(articalId);
//   if (!artical) throw new ApiError("Artical not found", 404);

//   const isLiked = artical.like.some(
//     (likeObj) =>
//       likeObj.user && likeObj.user.toString() === userId
//   );

//   if (isLiked) {
//     artical.like = artical.like.filter(
//       (likeObj) =>
//         likeObj.user && likeObj.user.toString() !== userId
//     );
//   } else {
//     artical.like.push({ user: userId });
//   }


//   await artical.save();

//   res.json({
//     liked: !isLiked,               // true if now liked, false if unliked
//   });
// });



// // const viewControl = asyncHandler(async(req, res, next)=>{
// //   const viewArticalId = req.params.id
// //   // console.log("this is artical id", viewArticalId);


// //   const artical = await Articals.findById(viewArticalId)
// //   // console.log("this is find artical", artical);


// //   if (!artical) {
// //     throw new ApiError("artical not found", 400);


// //   }

// //   artical.views.push({
// //     view : 1,
// //       likedAt: new Date()
// //   })

// //   // console.log("this is liked artical ", artical);


// //  await artical.save();

// // //  res.render("blog-contant", {artical})
// // next()



// // })

































// const shareArtical = asyncHandler(async (req, res) => {
//   const { articalId, platform } = req.body;

//   if (!(articalId && platform)) {
//     return res.status(400).json({ error: "Missing article ID or platform" });
//   }

//   const validPlatform = [
//     "messenger", "linkedin", "snapchat", "telegram", "whatsapp",
//     "twitter", "instagram", "facebook", "google"
//   ];

//   if (!validPlatform.includes(platform)) {
//     return res.status(400).json({ error: "Invalid platform" });
//   }

//   const artical = await Articals.findById(articalId);
//   if (!artical) {
//     return res.status(404).json({ error: "Article not found" });
//   }

//   if (!artical.shares) artical.shares = {};
//   artical.shares[platform] = (artical.shares[platform] || 0) + 1;

//   artical.shareHistory.push({
//     platform,
//     sharedAt: new Date()
//   })

//   await artical.save();

//   return res.json({ success: true, message: "Share updated!" });
// });

// const profile_Image = asyncHandler(async (req, res, next) => {
//   const profile = await Profile.findOne({ User: req.user._id })
//     .select("profile_Image username");

//   req.profile = profile; // ✅ object, not array
//   next();
// });




export {
  articalUpload,
  getArticales,
  // getArticalesById,
  categoryShareToArtical,
  getSearchAndRandomArticals,

}