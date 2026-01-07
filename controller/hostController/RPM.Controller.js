import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {RPMGroup} from '../../models/RPMGroup.model.js'

const RPMController = asyncHandler(async (req, res) => {

    const { name, rate, status } = req.body;

    console.log("name", name);
    console.log("rate", rate);
    console.log("status", status);
    // console.log("color", color);


    if (!name, !rate, !status) {
        throw new ApiError("somethinf is wrong");
        
    }


   const  RPM = await RPMGroup.create(
    {
        name,
        rate_per_1000 : rate,
        status
    }
   )

   console.log("RPM", RPM);
   



    return res.render("Admin.Dashbord/RPM", {
        layout: false, title: "RPM",
  
})




})


export default RPMController