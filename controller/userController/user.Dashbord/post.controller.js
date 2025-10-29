import { Articals } from "../../../models/ArticalModel.js";
import asyncHandler from "../../../utils/asyncHandler.js";

const postInTable = asyncHandler(async(req, res)=>{
 
   const artical = await Articals.find().sort({ createdAt : -1})   

   return res.render('Dashbord/postsAnalytics', {layout : false, title : "postsAnalytics", artical })

})

export {
    postInTable
}