import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import uploadOnCloudinary from "../../utils/cloudinary.js";
import  {Articals}  from "../../models/ArticalModel.js";

const articalUpload = asyncHandler(async (req, res) => {

  const { title, tags, short_description, content, publish_date, meta_title, meta_description } = req.body;

  const imageUrl = await uploadOnCloudinary(req.file?.path)

  if (!imageUrl) {
    throw new ApiError("the artical image is messing", 404);

  }

  const createArtical = await Articals.create({
    title,
    featured_image: imageUrl.secure_url,
    tags,
    short_description,
    content,
    publish_date,
    meta_description,
    meta_title,
    author: req.user._id,
  })

  if (!createArtical) {
    throw new ApiError("something went wrong to create  createArtical ", 404);

  }
  

  return res
    .status(201)
    .json(new ApiResponse(200, createArtical, "the Artical is create successfully"))

})

export default articalUpload