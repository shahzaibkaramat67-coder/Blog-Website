import asyncHandler from "../../utils/asyncHandler.js";
import update from "../../models/Announcment.Model.js";
import { title } from "process";
const updateController = asyncHandler(async(req, res)=>{

    const siteUpdate = await update.find().sort({createdAt : -1})
    console.log("siteUpdate", siteUpdate);
    
    const countUpdate = await update.find({status : "unread"}).countDocuments()
   console.log("countUpdate", countUpdate);
   


    res.render("footer/Platform/updates", {
        title : "updates",
        updates : siteUpdate,
        countUpdate
    })

})

const updateView = asyncHandler(async(req, res, next)=>{
 await update.updateMany(
        {status : "unread"},
        {
            $set :{status : "read"}
        }
    )
    next()

})

export {
    updateController,
    updateView
}