import asyncHandler from "../../utils/asyncHandler.js";
import Categorie from '../../models/categorie.model.js'
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import { Articals } from "../../models/ArticalModel.js";
import { query } from "express-validator";



const categoryHendler = asyncHandler(async(req, res)=>{
    const category = await Categorie.find()
  res.render("Categorie", { category });
   
})



// const getTopicBlog = asyncHandler(async(req, res)=>{
//   const Topic = req.query.Search;   

//   if (!Topic) {
//     throw new ApiError("not Content found for this topic", 404);
//   }

//   const ArticalOfTopic  =  await Articals.find({category : Topic})
 
//   if (!ArticalOfTopic || ArticalOfTopic.length === 0) {
//     throw new ApiError(`the artical with that topic name is ${Topic} not exist`, 400);
//   }
  
//   return res
//   .status(200)
//      .json(new ApiResponse("the Artical with specific topic now created", 200, ArticalOfTopic))
    
  
  

// })


export {
  categoryHendler,
  // getTopicBlog
}