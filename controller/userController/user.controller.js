import asyncHandler from '../../utils/asyncHandler.js'
import { validationResult } from 'express-validator';
import ApiError from '../../utils/ApiError.js'
import ApiResponse from '../../utils/ApiResponse.js';
import User from '../../models/Signup.model.js'
import crypto, { createHash } from 'crypto'
import sendmail from '../../utils/nodemailer.js'
import { strict } from 'assert';
// import sendmail from '../../utils/nodemailer.js';



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { refreshToken, accessToken }

    } catch (error) {
        throw new ApiError('something is wrong while generating refresh and access token', 500)
    }

}







/*****======== Section singup Form Hendler Start ==========*****/

const submitSingupData = asyncHandler(async (req, res) => {
    const { firstName, lastName, Email, password, confirmPassword } = req.body;

    if ([firstName, lastName, Email, password].some((field => !field))) {
        throw new ApiError('All input fields are required', 400)
    }

    if (password !== confirmPassword) {
        throw new ApiError("Passwords do not match", 400);
    }


    const reasult = validationResult(req)

    if (!reasult.isEmpty()) {
        // console.log(reasult.array());

        const errorMessage = reasult.array().map(error => ({
            field: error.param,
            msg: error.msg
        }))

        throw new ApiError("validation is failed", 400, errorMessage);

    }

    const userExisted = await User.findOne({
        $or: [{ firstName }, { Email }]
    })

    if (userExisted) {
        throw new ApiError('User with this firstName and gmail allready existed', 400)
    }

    const userSingup = await User.create({
        firstName,
        lastName,
        Email,
        password,
    })
    const otpCode = await userSingup.generateOtpCode()
    await userSingup.save({validateBeforeSave : false});


    await sendmail({Email : userSingup.Email, otp : otpCode})

    const redirectToOtpPage = req.headers.accept || "";
    if (redirectToOtpPage.includes("html")) {
        return res.redirect(`/api/user/otp?Email=${userSingup.Email}`)
    }else{
        console.log('the otp page not found');
        
    }

    // After signup, redirect to login page
    const redirection = req.headers.accept || "";
    if (redirection.includes('text/html')) {
        return res.redirect('/api/user/login')
    } else {

        return res
            .status(201)
            // .json(new ApiResponse('The User is Succcessfully Singup', 200, {Email : userSingup.Email}))
            .json(new ApiResponse('The User is Succcessfully Singup', 200, userSingup))

    }



})

const submitLoginData = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body

    const reasult = validationResult(req)
    if (!reasult.isEmpty()) {
        // throw new ApiError('validation failed', 400)
        const errorMessage = reasult.array().map(error => ({
            field: error.param,
            msg: error.msg
        }))

        throw new ApiError("validation failed", errorMessage);
    }


    const normalizeIdentifier = identifier.trim().toLowerCase();
    const isEmail = normalizeIdentifier.includes('@');

    const existedUser = !isEmail

        ? await User.findOne({ firstName: normalizeIdentifier })
        : await User.findOne({ email: normalizeIdentifier })

    if (!existedUser) {
        throw new ApiError('username or gmail does not match', 404)
    }





    const isPasswordCorrect = await existedUser.isCorrectPassword(password)
    if (!isPasswordCorrect) {
        throw new ApiError('password is not corresct', 400)
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(existedUser._id)
    const loginUser = await User.findById(existedUser._id).select("-refreshToken -password")

    const option = {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }


    res.cookie("accessToken", accessToken, option)
    res.cookie("refreshToken", refreshToken, option)


    return res.redirect("/api/user/home")

    // const redirection = req.headers.accept || ""

    // if (redirection.includes('text/html')) {
    //     return res.redirect("/api/user/home")
    // } 
    //     return res
    //         .status(200)
    //         .json(
    //             new ApiResponse(
    //                 200,
    //                 {
    //                     existedUser: loginUser, refreshToken, accessToken
    //                 }, 'login successfull'
    //             )
    //         )
    



})




const submitForgetPassword = asyncHandler(async (req, res) => {

    const { identifier } = req.body

    const result = validationResult(req)
    if (!result.isEmpty()) {
        const errorMessage = result.array().map(error => ({
            field: error.param,
            msg: error.msg
        }))
        throw new ApiError("the validation failed", errorMessage);

    }

    const normalizeIdentifier = identifier.trim().toLowerCase();
    const isEmail = normalizeIdentifier.includes('@');

    const user = !isEmail

        ? await User.findOne({ firstName: normalizeIdentifier })
        : await User.findOne({ Email: normalizeIdentifier })


    if (!user) {
        throw new ApiError("the user is not existed", 400);

    }

    //  const otp = user.generateOtpCode();
    //  user.otpCode = createHash('sha256').update(otp).digest("hex")
    //  user.otpExpiry = Date.now() + 5 * 60 * 1000;
    //  await user.save({validateBeforeSave : false})
    //  await sendmail({Email : identifier})
    const resetToken = await  user.generateResetPasswordToken()

    await user.save({validateBeforeSave : false})

    //  const resetUrl = `${req.protocol}://${req.get("host")}/updatePassword/${resetToken}`;
const resetUrl = `http://localhost:3002/api/user/updatePassword/${resetToken}`;


    const redirection = req.headers.accept || ""
    if (redirection.includes('html')) {
        return res.redirect(`/api/user/updatePassword/${resetToken}`)
    }

    return res
        .status(200)
        .json(
            new ApiResponse("the user match in databse",200,{resetUrl})

        )


})


const updatePassword = asyncHandler(async (req, res) => {
      const token = req.params.token || req.body.token;
      if (!token) {
        throw new ApiError("no token provide ", 400);
        
        
      }
    const {newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
        throw new ApiError("the password does not matched for reset password", 401);

    }

     
      const hashedToken = crypto.createHash("sha256").update(token).digest('hex')



      const userExist = await User.findOne({
         resetPasswordToken: hashedToken,
         resetTokenExpiry: { $gt: Date.now() }
      })

        if (!userExist) {
        throw new ApiError("Invalid or expired reset token", 400);

    }

      userExist.password = newPassword,
      userExist.resetPasswordToken = undefined,
      userExist.resetTokenExpiry = undefined,
      await userExist.save()



    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExist._id)

    const userUpdated = await User.findById(userExist._id).select("-password -refreshToken")
    const  option = {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict'
    }

    res.cookie("accessToken", accessToken, option)
    res.cookie("refreshToken", refreshToken, option)

    const redirect = req.headers.accept || "";
    if (redirect.includes('text/html')) {
        return res.redirect('/api/user/home')
    }

    return res
        .status(201)
        .json(
            new ApiResponse("Password reset successful. now you are  loged in.", 200,
            {
               userUpdated: userUpdated,
                refreshToken,
                accessToken
            }
            )
        )


})



// const otpCodeVarification = asyncHandler(async(req, res)=>{
  
//     const {Email} = req.body;

//     const user = await User.findOne({Email})
//     if (!user) {
//         throw new ApiError("the Email not found", 404);
        
//     }
//     const  otp = user.generateOtpCode()
//     user.otpCode = otp;
//     await user.save({validateBeforeSave : false})


//     console.log("the otp send on email ", otp);

//     return res
//     .status(201)
//     .json(
//        new ApiResponse('otp send successfully', otp)
//     )
    

// })


const logOut = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // secure only in prod
    sameSite: "strict"
  });

  res.redirect("/api/user/home");
});





export {
    submitSingupData,
    submitLoginData,
    submitForgetPassword,
    updatePassword,
    logOut
}
/*****======== Section singup Form Hendler End  ==========*****/