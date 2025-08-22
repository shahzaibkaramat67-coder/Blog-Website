import mongoose from "mongoose";
import asyncHendler from "../utils/asyncHendler";
import BLOGCATEGORY from '../constant.js'


export const CategoryConnection = asyncHendler(async(req, res)=>{
  try {
      const connect = await mongoose.connect(`${process.env.MONGODB_URL}/${BLOGCATEGORY}`)
      console.log(connect.connection.host);
      
  } catch (error) {
    console.log(error);
    
  }
})