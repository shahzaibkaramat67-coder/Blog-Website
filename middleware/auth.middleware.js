import User from "../models/Signup.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";


const verifijwt = asyncHandler(async (req, res, next)=>{
try {
    // const token = req.cookies?.token || req.header('Authorization')?.replace("Bearer", "")
    const token = req.cookies?.accessToken  || req.header('Authorization')?.replace("Bearer", "").trim()
 
    
    if(!token){
        throw new ApiError(401,'no token found')
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)    

    const user = await User.findById(decodedToken._id).select('-password -refreshToken')

    
    
    if (!user) {
        throw new ApiError(404, 'invalid access token')
    }
    
    req.user= user;
    next()
} catch (error) {
    throw new ApiError(404, error?.message || 'user not found');
    
    
}
})

export default verifijwt;
