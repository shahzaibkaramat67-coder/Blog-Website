import User from "../models/Signup.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

const verifijwt = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer", "").trim();

    const isApiRequest = req.originalUrl.startsWith("/blog/blog-contant"); // API route

    if (!token) {
      if (isApiRequest) return res.status(401).json({ success: false, message: "Not authenticated" });
      return res.redirect("/login");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken.id).select('-password -refreshToken');
             console.log("user", user);
             
    if (!user) {
      if (isApiRequest) return res.status(401).json({ success: false, message: "Not authenticated" });
      return res.redirect("/login");
    }

    if (!user.emailVerified || !user.isValid) {
      if (isApiRequest) return res.status(401).json({ success: false, message: "Not authenticated" });
      req.flash("error", "Please verify your OTP to access your account.");
      return res.redirect("/otp");
    }

    req.user = user;
    next();

  } catch (error) {
    const isApiRequest = req.originalUrl.startsWith("/blog/blog-contant");
    if (isApiRequest) return res.status(401).json({ success: false, message: "Not authenticated" });
    return res.redirect("/login");
  }
});

export default verifijwt;
