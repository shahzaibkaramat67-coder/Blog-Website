import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/Signup.model.js";

const verifijwt = asyncHandler(async (req, res, next) => {
  try {
    // Read token from cookie
    const token = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer", "").trim();
    // const token = req.cookies?.refreshToken;
    console.log("token ", token);
    
    
    // If you also want to support Authorization header:

    if (!token) {
      return res.redirect("/Api/login");
    }

    // Verify token
    const decodedToken = jwt.verify(token,process.env.ADMIN_REFRESH_TOKEN);
       console.log("decodedToken", decodedToken);
       
    // Fetch user
    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) return res.redirect("/Api/login");

    // **This is the key**: attach user to req, not res
    req.user = user;
    console.log("this admin user ", user);
    console.log("this admin user ", req.user);
    

    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    return res.redirect("/Api/login");
  }
});

export default verifijwt;
