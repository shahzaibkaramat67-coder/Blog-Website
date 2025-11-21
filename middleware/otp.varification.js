// import User from "../models/Signup.model.js";
// import ApiError from "../utils/ApiError.js";
// import ApiResponse from "../utils/ApiResponse.js";
// import asyncHandler from "../utils/asyncHandler.js";
// import crypto from "crypto"

// const verifiOtp = asyncHandler(async(req, res)=>{

//    const {otp, Email} = req.body;
   
//    if (!(otp && Email)) {
//     throw new ApiError("otp not found", 404);
    
//    }

   

//   const  hashedOtp = crypto.createHash('sha256').update(otp).digest('hex')
  
//   if (!hashedOtp) {
//     throw new ApiError("hashed otp not create ", 400);
    
//   }

//   const otpFound = await User.findOne({
//     Email,
//     otpCode : hashedOtp,
//     otpExpiry: { $gt: Date.now() }
//   })

//   if (!otpFound) {
//     throw new ApiError("invalid or expair otp");
    
//   }
// otpFound.isValid = true
// otpFound.otpCode = undefined,
// otpFound.otpExpiry = undefined
//   await otpFound.save({validateBeforeSave : false})


//  const redirect = req.headers.accept || "";
//     if (redirect.includes('text/html')) {
//         return res.redirect('/login')
//     }
   


//   return res
//   .status(200)
//   .json(
//     new ApiResponse("the verification is successfull", 200, {Email :otpFound.Email})
//   )

// })

// export default verifiOtp;