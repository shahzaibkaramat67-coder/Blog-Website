import { validationResult } from "express-validator";
import User from "../../models/Signup.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ms from "ms";
import ApiError from "../../utils/ApiError.js"; // make sure you have this

const generateAccessAndRefreshToken = async(userId)=>{
    const user = await User.findById(userId);

    // const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    user.refreshToken = refreshToken;
     await user.save({validateBeforeSave : false})
    return {refreshToken}

}


const adminLogin = asyncHandler(async (req, res) => {

  const { identifier, password } = req.body;
  
  

  
  if (!identifier || !password) {
    req.flash("error", "Both username/email and password are required.");
    return res.redirect("/api/login");
  }

  const reasult = validationResult(req)
  if (!reasult.isEmpty()) {
    reasult.array().forEach((err) => res.flash("error", err.msg))
    return res.redirect("/api/login");
  }

  const normalizeIdentifier = identifier.trim().toLowerCase()
  const Email = normalizeIdentifier.includes("@");

  const existedUser = Email ? await User.findOne({ Email: normalizeIdentifier }) : await User.findOne({ Username: normalizeIdentifier })

  if (!existedUser) {
    req.flash("error", "invalid input data")
    return res.redirect("/api/login");
  }

  const isCorrectPassword = await existedUser.isCorrectPassword(password)
  console.log("isCorrectPassword", isCorrectPassword);
  
  if (!isCorrectPassword) {
    req.flash("error", "password must be matched")
    return res.redirect("/api/login");
  }

  if (existedUser.role !== "admin") {
    req.flash("error", "Access denied. Admin only.");
   return res.redirect("/api/login");

  }

  const { refreshToken } =await generateAccessAndRefreshToken(existedUser._id)




  const refreshTokenOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'strict',
    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY)
  }

//   res.cookie("accessToken", accessToken, accessTokenOption)
  res.cookie("refreshToken", refreshToken, refreshTokenOption)

return res.redirect("/api/admin-dashboard");




})

export {
  adminLogin,

}

