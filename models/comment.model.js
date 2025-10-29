import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  articls :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Articals",
    required : true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  comment_image: {
    type: String, // just a URL string
    required: true
  },
  Comment: {
    type: String,
    required: [true, "comment should not be empty"],
    trim: true,
    minlength: [3, "the comment text should not be less than 3 characters"],
    maxlength: [500, "the comment text should not be more than 500 characters"]
  }
}, { timestamps: true });
const Comment = mongoose.model("comment", commentSchema)
export default Comment
















// import mongoose, { Types } from "mongoose";
// // import { Profile } from "./profile.model";

// const commentSchema = new mongoose.Schema({
//     User :{
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "User"
//     },
//     comment_Image :{
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "Profile",
//         required : true, 
//     },
//     username :{
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "Profile",
//         required : true,
//         trim : true
//     },
//     Comment:{
//         type : String,
//         required: [true, "comment should not be empty"],
//         trim : true,
//         minlength : [3, "the comment text should not less then 3 character"],
//         maxlength : [500, "the comment text should not less then 500 character"]
//     },
// }, {timestamps : true})

// const Comment = mongoose.model("comment", commentSchema)
// export default Comment