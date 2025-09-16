import dotenv from "dotenv";
dotenv.config(); 
import {v2 as cloudinary } from 'cloudinary'
import fs from 'fs'



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,   // ✅ correct
  api_secret: process.env.CLOUDINARY_API_SECRET, // ✅ correct
});


const uploadOnCloudinary =async (localPath)=>{   
    try {
        if (!localPath)  return null
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type : 'auto'
        })
        return response
        
    } catch (error) {
        console.log(`this cloudinary upload  is error `, error);
        
    }

    if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath)
        
    }
}

export default uploadOnCloudinary