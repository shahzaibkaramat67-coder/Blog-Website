import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import comment from "../../models/comment.model";

import uploadOnCloudinary from "../../utils/cloudinary";
import asyncHandler from "../../utils/asyncHandler";

const commentHendeler = asyncHandler(async(req, res)=>{
         const {textarea} = req.body;
         if (!textarea) {
            throw new ApiResponse("something is wrong", 404);
            
         }
})
export default commentHendeler