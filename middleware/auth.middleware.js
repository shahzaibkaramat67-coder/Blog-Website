import User from "../models/Signup.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";


const verifijwt = asyncHandler(async (req, res, next)=>{
try {
    // const token = req.cookies?.token || req.header('Authorization')?.replace("Bearer", "")
    const token = req.cookies?.accessToken  || req.header('Authorization')?.replace("Bearer", "").trim()
 
    
    if(!token){
 
    throw new ApiError("the noken is not found", 404);
    
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)    

    const user = await User.findById(decodedToken.id).select('-password -refreshToken')

    console.log("this is user ",user);
    
    
    if (!user) {
        throw new ApiError(404, 'invalid access token')
    }
    
    req.user= user;
    next()
} catch (error) {
     return res.redirect("/login");
    
    
}
})

export default verifijwt;
