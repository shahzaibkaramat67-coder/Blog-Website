import mongoose from "mongoose";
import asyncHendler from "../utils/asyncHendler";
import { PROFILE } from "../models/profile.model";


const profileDb = asyncHendler(async(req, res)=>{
   try {
     const profile = await mongoose.connect(`${process.env.MONGODB_URL}/${PROFILE}`)
     console.log(`profie db connection is ${profile.connection.host}`);
     
   } catch (error) {
    console.log("profile db error ", error);
    
   }
})

export default profileDb