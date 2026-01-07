import asyncHandler from '../../utils/asyncHandler.js'
import ApiError from '../../utils/ApiError.js'
import ApiResponse from '../../utils/ApiResponse.js';
import { Profile } from '../../models/profile.model.js';
import uploadOnCloudinary from '../../utils/cloudinary.js';
import { validationResult } from 'express-validator';
import User from '../../models/Signup.model.js';
import Categorie from '../../models/categorie.model.js';
import { title } from 'process';
import { log } from 'console';
// import { Profile } from '../../models/profile.model.js';

// profile controller 

const createORUpdateProfile = asyncHandler(async (req, res) => {
   const { full_name, username, about, email, phone, location, website, twitter, linkedin, facebook } = req.body;

   let { category } = req.body;
   if (!Array.isArray(category)) {
      category = category ? [category] : [];
   }

   let imageUrl = null;

   //  Only upload if a file exists
   if (req.file && req.file.path) {
      imageUrl = await uploadOnCloudinary(req.file.path);
   }

   // Validate AFTER uploading only if file exists
   const result = validationResult(req);
   if (!result.isEmpty()) {
      const errorMessage = result.array().map(errors => ({
         field: errors.param,
         msg: errors.msg
      }));
      console.log("errorMessage", errorMessage);
      
      throw new ApiError("validation failed", 400, errorMessage);
   }

   let profile = await Profile.findOne({ User: req.user._id });

   if (!profile) {
      //  Create new profile
      profile = await Profile.create({
         User: req.user._id,
         full_name,
         username,
         about,
         email,
         phone,
         location,
         website,
         socials: { twitter, linkedin, facebook },
         category,
         profile_Image: imageUrl?.secure_url || ""
      });

      return res.render("Profile", { title: "profile", profile });
   }

   //  Update profile
   const updateprofile = {
      full_name,
      about,
      phone,
      location,
      profile_Image: imageUrl?.secure_url || profile.profile_Image, // fallback to old image
   };

   profile = await Profile.findOneAndUpdate(
      { User: req.user._id },
      { $set: updateprofile },
      { new: true }
   );

   return res.render("Profile", { title: "profile", profile });
});



const getProfileForUpdate = asyncHandler(async (req, res) => {
   const profile = await Profile.findOne({ User: req.user._id })
   if (req.query.edit === "true") {
      return res.render("edit-profile", { layout: false, title: "Edit Profile", profile });
   }
   if (profile) {
      res.render("Profile", { title: "Profile", profile })
   } else {
      res.render("edit-profile", {
         layout: false,
         title: "edit-profile",
         profile,
         // category: await Categorie.find()
      })
   }


})


// const ProfileUpdate = asyncHandler(async (req, res) => {

//    //  const {full_name, username, about, email, phone, location, website, twitter, linkedin, facebook,} = req.body
//    const { full_name, username } = req.body
//    if (req.file.path) {
//       profile.profile_Image = req.file.path
//    }
//    const profile = await Profile.findByIdAndUpdate(
//       req.params.id,
//       {
//          $set: {
//             full_name,
//             username,
//             // about,
//             // email,
//             // phone,
//             // location,
//             // website,
//             // twitter,
//             // linkedin,
//             // facebook
//          }
//       },
//       { new: true }
//    )

//    res.redirect(`/api/user/profile/${req.params.id}`)

// })





export {
   createORUpdateProfile,
   getProfileForUpdate,
   // ProfileUpdate
}

