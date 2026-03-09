import asyncHandler from "../../utils/asyncHandler.js";
import { Profile } from "../../models/profile.model.js";

const editProfile = asyncHandler(async(req, res)=>{
   const userId = req.user._id;
   const profile = await Profile.findOne({ User: userId });
   return res.render('edit-profile', {layout : false, title: 'edit-profile', profile})
})

export {
    editProfile
}
