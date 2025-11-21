import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000, // increase timeout to 60s
});

const uploadOnCloudinary = async (localPath) => {
  if (!localPath) {
    console.error("No local path provided for Cloudinary upload.");
    return null;
  }

  try {
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });

    // Delete local file after successful upload
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Attempt to delete the file even on error
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    // Return null or throw error depending on how you want to handle it
    return null;
  }
};

export default uploadOnCloudinary;
