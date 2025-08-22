import { v2 as cloudinary } from "cloudinary";
import upload from "../middleware/multer.middleware";
import fs from 'fs'


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localPathImage) =>{
  try {
    if (!localPathImage) return null

    const response = await cloudinary.uploader.upload(localPathImage, {
        resource_type :'auto',      
    })
    console.log(`this is ${response} and  this is ${resource_type}`)
    return response
  } catch (error) {
    fs.unlinkSync(localPathImage)
    return null
  }
}

export default uploadOnCloudinary