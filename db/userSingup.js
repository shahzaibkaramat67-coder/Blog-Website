import mongoose from 'mongoose'
import  {DB_NAME}  from '../constant.js'
// import  {BLOG_DATA}  from '../constant.js'
// import asyncHendler from '../utils/asyncHendler.js'

export const dbConnnection = async() =>{
 try {
       const userConnection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      //   console.log(userConnection, userConnection.host);
       console.log(`✅ Connected to MongoDB! DB: ${userConnection.connection.name}, Host: ${userConnection.connection.host}`);
      } catch (error) {
            console.log(error);
       
      }
      
}

// const blogData = asyncHendler(async(req, res)=>{
//      try {
//        const blogData = await mongoose.connect(`${process.env.MONGODB_URL}/${BLOG_DATA}`)
//        console.log(`✅ Connected to MongoDB! DB: ${blogData.connection.name}, Host: ${blogData.connection.host}`);
 
//      } catch (error) {
//         console.log(error);
        
//      }
// })
// export default blogData;


