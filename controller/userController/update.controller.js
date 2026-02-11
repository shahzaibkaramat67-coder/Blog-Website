import asyncHandler from "../../utils/asyncHandler.js";
import update from "../../models/Announcment.Model.js";
import { title } from "process";
const updateController = asyncHandler(async(req, res)=>{

    const siteUpdate = await update.find() 
    console.log("siteUpdate", siteUpdate);
    

    res.render("footer/Platform/updates", {
        title : "updates",
        updates : siteUpdate
    })

})

export {
    updateController
}