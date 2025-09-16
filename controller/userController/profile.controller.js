import asyncHandler from '../../utils/asyncHandler.js'
import ApiError from '../../utils/ApiError.js'
import ApiResponse from '../../utils/ApiResponse.js';
import { Profile } from '../../models/profile.model.js';
import uploadOnCloudinary from '../../utils/cloudinary.js';
import { validationResult } from 'express-validator';
// import { Profile } from '../../models/profile.model.js';

// profile controller 

const createProfile = asyncHandler(async (req, res) => {
   const { full_name, username, about, email, phone, location, website, category } = req.body
   const socials = {
      twitter  : req.body.twitter,
      linkedin  : req.body.linkedin,
      facebook  : req.body.facebook,
   }
   //  const {profile_image} = req.file?.path
   const imageUrl = await uploadOnCloudinary(req.file?.path)

   const result = validationResult(req)
   if (!result.isEmpty()) {
  console.log("❌ Validation errors:", result.array());  // <--- log all errors
      const errorMessage = result.array().map(errors => ({
         field: errors.param,  
         msg: errors.msg
      }));
      throw new ApiError("validation failed", 400, errorMessage);

   }

   const profile = await Profile.create({
      User: req.user._id,
      full_name,
      username,
      about,
      email,
      phone,
      location,
      website,
      socials,
      category,
      profile_Image: imageUrl.secure_url
   })

     const redirectPage = req.headers.accept || "";
   if (redirectPage.includes('text/html')) {
      return res.redirect("/api/user/profile")
   }



   if (!profile) return ApiError('something went wrong', 400)


   return res
      .status(201)
      .json(new ApiResponse("prodile data add successfull", 200, profile))


})

export default createProfile
