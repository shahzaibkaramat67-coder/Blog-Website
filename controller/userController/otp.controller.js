import User from "../../models/Signup.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendmail from "../../utils/nodemailer.js";

const sendOtpMail = asyncHandler(async(req, res)=>{
    const {Email} = req.body;
    if (!Email) {
        throw new ApiError("the Email not found", 404);
    }

   let account = await User.findOne(
     {Email}
)

   if (!account) {
      throw new ApiError("Account not found", 404);
   }


   const otpCode = await account.generateOtpCode();
   await account.save({validateBeforeSave : false})

   await sendmail({Email:account.Email, otp: otpCode})
   
    return res
    .status(200)
    .json(
        new ApiResponse('the otp send successfull', 200, {Email:account.Email})
    )


})

export default sendOtpMail