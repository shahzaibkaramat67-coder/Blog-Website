import mongoose, { Types } from "mongoose";
// import { Profile } from "./profile.model";

const commentSchema = new mongoose.Schema({
    comment_Image :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile",
        required : true, 
    },
    username :{
        type : mongoose.Schema.types.ObjectId,
        ref : "Profile",
        required : true,
        trim : true
    },
    Comment:{
        type : String,
        required: [true, "comment should not be empty"],
        trim : true,
        minlength : [3, "the comment text should not less then 3 character"],
        maxlength : [500, "the comment text should not less then 500 character"]
    },
}, {timestamps : true})

const comment = mongoose.model("comments", commentSchema)
export default comment