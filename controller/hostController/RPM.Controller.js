import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { RPMGroup } from '../../models/RPMGroup.model.js'

const RPMController = asyncHandler(async (req, res) => {



    const { name, rate, status } = req.body;

    console.log("name", name);
    console.log("rate", rate);
    console.log("status", status);
    // console.log("color", color);


    if (!name || !rate || !status) {
        throw new ApiError("somethinf is wrong");

    }

    const existing   = await RPMGroup.findOne({name})
    // console.log("findEpm", findEpm);
    
    if (existing) {
          const RPMUpdate = await RPMGroup.findOneAndUpdate({name}, {rate_per_1000 : rate,  status })

         console.log("RPMUpdate", RPMUpdate);
         
        } else {
            const RPM = await RPMGroup.create(
                {
                    name,
                    rate_per_1000: rate,
                    status
                }
            )
            console.log("RPM", RPM);
    }


    

   



     


    return res.redirect("/Api/admin-RPM");
})


const showRpm = asyncHandler(async(req, res)=>{
    
    const allRpmData = await RPMGroup.find()
    console.log("allRpmData", allRpmData);

    // console.log("rpmData", rpmData);
  
    // console.log("rpmData", rpmData);
return res.render("Admin.Dashbord/RPM", {
    title: "RPM",
    allRpmData
});


    
    
})



export  {
    RPMController,
    showRpm
}