import mongoose from 'mongoose'
import  {DB_NAME}  from '../constant.js'
// import  {BLOG_DATA}  from '../constant.js'
// import asyncHendler from '../utils/asyncHendler.js'

import dns from "dns"
dns.setServers(["1.1.1.1", "8.8.8.8"])
export const dbConnnection = async () => {
    try {
        const userConnection = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`
        );

        console.log(
            `✅ Connected to MongoDB! DB: ${userConnection.connection.name}, Host: ${userConnection.connection.host}`
        );

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        throw error;
    }
};

// const blogData = asyncHendler(async(req, res)=>{
//      try {
//        const blogData = await mongoose.connect(`${process.env.MONGODB_URL}/${BLOG_DATA}`)
//        console.log(`✅ Connected to MongoDB! DB: ${blogData.connection.name}, Host: ${blogData.connection.host}`);
 
//      } catch (error) {
//         console.log(error);
        
//      }
// })
// export default blogData;


