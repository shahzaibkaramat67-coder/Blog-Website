import { Articals } from "../../../models/ArticalModel.js";
import Category from "../../../models/categorie.model.js";
import { Profile } from "../../../models/profile.model.js";
import { RPMGroup } from "../../../models/RPMGroup.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import uploadOnCloudinary from "../../../utils/cloudinary.js";


const articalUpload = asyncHandler(async (req, res) => {
  console.log("trcyubiomp,cyvguhbijnokml");
  console.log("req.body", req.body);
  

    console.log("ARTICLE UPLOAD HIT", new Date().toISOString());

  const { title, tags, short_description, content, publish_date, meta_title, meta_description, category } = req.body;


console.log("category",category);



  if (!content) {
    throw new ApiError("content is required", 400);
    
    //  req.flash("error", "the conetnt length must be greater then 100")
    //     return res.redirect("/");
  }

  // Call OpenAI Moderation API

 
  

  const profileCategories = await Profile.findOne({User : req.user._id}).select("category")
  console.log("profileCategories", profileCategories);
  

  if (!profileCategories) {
    return res.status(400).json({ success: false, message: "Profile categories not found" });
  }

  if (!profileCategories.category.includes(category)) {
    return res.status(400).json({ success: false, message: "Selected category is not allowed for your profile" });
  }

  console.log("category", category);

  const imageUrl = await uploadOnCloudinary(req.file?.path)

  if (!imageUrl) {
    throw new ApiError("featured_image is required", 400);

  }

  const profile = await Profile.findOne({ User: req.user._id });
  if (!profile) {
    return res.status(400).json({ success: false, message: "Profile not found" });
  }
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

  if (!categoryData?.length) {
    throw new ApiError("Invalid category", 400);
  }


  const rpm_group_id = categoryData[0].rpm_group_id
  console.log("this is rpm_group_id", rpm_group_id);
  
  if (!rpm_group_id) {
    return res.status(400).json({ success: false, message: "RPM group not found for category" });
  }

  const RPM = await RPMGroup.findById(rpm_group_id).select("rate_per_1000")
  console.log("RPM", RPM);

  if (!RPM) {
    return res.status(400).json({ success: false, message: "RPM data not found" });

  }

  //  const artical


 // ===== OPENAI MODERATION HERE =====
// const moderationResponse = await openai.moderations.create({
//   model: "omni-moderation-latest",
//   input: content
// });

// const result = moderationResponse.results[0];

// if (result.flagged) {
//   return res.status(400).json({ message: "Content contains harmful data" });
// }


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
    return res.status(500).json({ success: false, message: "Failed to create article" });

  }

  // moderation is performed synchronously via middleware/openai client

  
     res.redirect("/profile/Dashbord/Artical");
  // return res.json({ success: true, message: "Blog uploaded successfully" });

  // return res
  //   .status(201)
  //   .json(new ApiResponse(200, createArtical, "the Artical is create successfully"))

})

export {
    articalUpload
}
