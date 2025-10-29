import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import uploadOnCloudinary from "../../utils/cloudinary.js";
import { Articals } from "../../models/ArticalModel.js";
import { Profile } from "../../models/profile.model.js";
import mongoose, { Query } from "mongoose";
import User from "../../models/Signup.model.js";

const articalUpload = asyncHandler(async (req, res) => {

  const { title, tags, short_description, content, publish_date, meta_title, meta_description, category } = req.body;

  const imageUrl = await uploadOnCloudinary(req.file?.path)

  if (!imageUrl) {
    throw new ApiError("the artical image is messing", 404);

  }

  const profile = await Profile.findOne({ User: req.user._id })


  const createArtical = await Articals.create({
    title,
    featured_image: imageUrl.secure_url,
    tags,
    short_description,
    content,
    publish_date,
    username: profile._id,
    category,
    meta_description,
    meta_title,
    // author: profile._id,
  })

  console.log("this artical befor populateartical", createArtical);


  const populateArtical = await Articals.findById(createArtical._id).populate("username", "username")

  console.log("this artical after populateartical", createArtical);




  if (!createArtical) {
    throw new ApiError("something went wrong to create  createArtical ", 500);

  }

  res.redirect('/api/user/blog')
  // return res
  //   .status(201)
  //   .json(new ApiResponse(200, createArtical, "the Artical is create successfully"))

})


// const getArticales = asyncHandler(async (req, res) => {
//   // const topicSlug = req.params.slug || null;

//   // console.log("this is topicSlug", topicSlug);
  

//   const page = parseInt(req.query.page) || 1;
//   const limit = 2
//   const skip = (page - 1) * limit;
//   let allArtical
//   let totalPages = 0;
//   // const SideAllArtical = [];
//   const filter = {};
//   const Topic = req.query.Search

// if (Topic) {
//   filter.title = {$regex : Topic, $options : "i"}
  
// }


// console.log(filter);

//    const totalArticals = await Articals.countDocuments(filter)
//    console.log(totalArticals);
   
//        allArtical = await Articals.find(filter) 
//     .populate("username", "username")
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: -1 })
//     totalPages = Math.ceil(totalArticals / limit) || 1;



// res.render("blog", {
//   title: "Blog",
//   allArtical,
//   currentPage: page,
//   searchQuery : Topic,
//   totalPages,
//   // SideAllArtical,
//   topicSlug: null, // ✅ Always define this
// });





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


const getArticalesById = asyncHandler(async (req, res) => {
  const artical = await Articals.findById(req.params.id)
    .populate("username", "username")
  if (!artical) {
    throw new ApiError("articalId not found ", 404);
  }

  // const comments = await Comment.find().sort({createdAt : -1})


  // res.render('blog-contant', { title : 'blog-contant', articalId, comments})
  res.render('blog-contant', { title: 'blog-contant', artical })

})


const categoryShareToArtical = asyncHandler(async (req, res) => {

  //  Make sure to use findOne, not findById
  const profile = await Profile.findOne({ User: req.user._id })



  return res.render("Dashbord/Artical", {
    layout: false,
    title: "Artical",
    category: profile ? profile.category : []
  });
});


// const searchArticals = asyncHandler(async(req, res)=>{
// const {Search} = req.body;

// if (!Search || Search.trim() === "") {
//      throw new ApiError("Please Search sometrhing", 404);
// }

// const searchFromArticals = await Articals.find({
//   title : { $regex : Search, $options : 'i' }
// })

// res.render("blog", {title : "Search", searchArtical : searchFromArticals,  searchQuery: Search })

// })


// const  getAllRandomArtical = asyncHandler(async(req, res)=>{
//  const  allArtical = await Articals.find()
//  res.render("blog", {title : "Blogs", allArtical, searchArtical:[]}) 
// })

// const getSearchAndRandomArticals = asyncHandler(async (req, res) => {
//   const Search = decodeURIComponent(req.query.Search || "").replace(/\+/g, " ").trim();
//   const page = parseInt(req.query.page) || 1;
//   const limit = 3;
//   const skip = (page - 1) * limit;
//   let allArtical = []
//   let SideAllArtical = []
//   let totalArticals = 0;
//   let totalPages ;

//   totalArticals = await Articals.countDocuments()
//    allArtical = await Articals.find()
//   .populate("username", "username")
//   .skip(skip)
//   .limit(limit)
//   .sort({ createdAt : -1})
  

//   if (Search !== "") {
//     // totalArticals = await Articals.countDocuments({ title: { $regex: Search, $options: "i" } })

//   totalArticals = await Articals.countDocuments()
//    allArtical = await Articals.find()
//   .populate("username", "username")
//   .skip(skip)
//   .limit(limit)
//   .sort({ createdAt : -1})
//    totalPages = Math.ceil(totalArticals / limit)

//     SideAllArtical = await Articals.find({ title: { $regex: Search, $options: "i" } })
//     .populate("username", "username")
//       // .limit(limit)
//       // .skip(skip)
//       .sort({ createdAt: -1 })
//       // SideAllArtical = allArtical
//   } 
//   else {
//     totalArticals = await Articals.countDocuments()
//    allArtical = await Articals.find()
//   .populate("username", "username")
//   .skip(skip)
//   .limit(limit)
//   .sort({ createdAt : -1})
//    totalPages = Math.ceil(totalArticals / limit)
//   }



//   res.render("blog", {
//     title: Search ? `${Search}` : "Blogs",
//     // searchArtical,
//     SideAllArtical,
//     searchQuery: Search || "",
//     currentPage: page,
//     totalPages,
//     allArtical
//   })

// })

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

const like = asyncHandler(async(req, res)=>{
      const { articalId } = req.params; // ✅ correct
     const userId = req.user?._id

       if (!articalId) {
        throw new ApiError("id is missing for like", 400);  
       }
    // console.log(articalId);

    const artical = await Articals.findById(articalId)

    console.log("this is artical id", artical);
      const isliked =  artical.like.includes(userId)

      if (isliked) {
       artical.like.pull(userId)
      }else{
        artical.like.push(userId)
      }
console.log("this user is liek the artical", isliked);


      
    await artical.save()
   
  //  return res.render("blog-contant", {
  //   artical,
  //   user: req.user,
  // });

      // res.redirect("back");
    
     
       
})

const viewControl = asyncHandler(async(req, res)=>{
  const viewArticalId = req.params.id
 
  const Artical = await Articals.findById(viewArticalId)

  if (!Artical) {
    throw new ApiError("artical not found", 400);
    
    
  }

  Artical.views = (Artical.views || 0) + 1;

 await Artical.save();

 res.render("blog-contant", {Artical})
   
   

})




export {
  viewControl,
  articalUpload,
  getArticales,
  getArticalesById,
  categoryShareToArtical,
  getSearchAndRandomArticals,
  like
}