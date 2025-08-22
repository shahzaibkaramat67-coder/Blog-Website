import User from "../models/Singup.model";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import asyncHendler from "../utils/asyncHendler";


const verifijwt = asyncHendler(async (req, res, next)=>{
try {
    const token = req.cookie?.token || req.header('Authorization')?.replace("Bearer", "")
    if(!token){
        throw new ApiError(401,'no token found')
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    const user = User.find(decodedToken._id).select('-password -refreshToken')
    
    if (!user) {
        throw new ApiError(401, 'invalid access token')
    }
    
    req.user= user;
} catch (error) {
    throw new ApiError("404", error?.message || 'user not found');
    
    
}
})

export default verifijwt;
