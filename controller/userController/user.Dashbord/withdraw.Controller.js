import ApiError from "../../../utils/ApiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";

const withdraw = asyncHandler(async(req, res)=>{
     const { amount, method, accountDetails } = req.body;
     const userId = req.user

     console.log("userId", userId);
     

    if (!amount && !method && !accountDetails) {
        throw new ApiError("All fields are required", 404);
        
    }
    

    return res.render("Dashbord/Withdraw", {layout : false})
})

export default withdraw