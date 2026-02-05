import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import Comment from "../../models/comment.model.js";

import uploadOnCloudinary from "../../utils/cloudinary.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Profile } from "../../models/profile.model.js";
import User from "../../models/Signup.model.js";
import { Articals } from "../../models/ArticalModel.js";
// import { title } from "process";
const getArticalComment = asyncHandler(async (req, res, next) => {
  const articalId = req.params.id;
  console.log("params", articalId);
  
  const artical = await Articals.findById(articalId);
  console.log("all comments for specfic artical id", artical);
  
  // if (!artical) throw new ApiError("Article not found", 404);
  if (!artical) throw new ApiError("Article not found", 404);

  const comments = await Comment.find({ articls: artical._id })
    .sort({ createdAt: -1 })
    console.log("comments", comments);
    
// req.comments = comments;
  // res.render("blog-contant", {
  //   title: "blog-contant",
  //   artical, //  consistent with EJS
  //   comments,
  // });
     return res.json({success : true , comments, articalId})
  // next()
});


const commentHendeler = asyncHandler(async (req, res) => {
  const { text, articalId } = req.body;

// console.log("text", text);
// console.log("articalId", articalId);


  if (!text || !articalId) {
    throw new ApiError("something is wrong", 400);
  }
  // console.log("text is", text , articalId);


  // console.log("artical is", articalId);


  const profile = await Profile.findOne({ User: req.user._id }).select("username profile_Image")
    // .populate("username", "username profile_Image")

  if (!profile) {
    throw new ApiError("profile not found", 404);
  }

  // console.log("this is profiel", profile);


   const newComments = await Comment.create({
    User: req.user._id,
    articls: articalId,
    Comment: text,
    comment_image: profile.profile_Image,
    username: profile.username
  });

  // console.log("comment", newComments);

 return res.json({ success: true, newComments});
  
   
 
  // res.redirect(`/blog/blog-contant/${articalId}`);
  // return res.render("blog-contant", articalId)

});

const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;

  // console.log("commentId", );
  console.log("commentId", commentId);
  console.log("commentId", req.params);
  

  if (!commentId) {
    throw new ApiError("the comment id not found", 404);


  }

  const deleteComment = await Comment.findByIdAndDelete(commentId)
  // deleteComment.save()
  console.log("deleteComment", deleteComment);
  



  if (!deleteComment) {
    throw new ApiError("the cooment not delete", 201);

  }
  return res.json({success : true, deleteComment})
  // res.redirect(303, `/blog/blog-contant/${deleteComment.articls}`)
  // res.send(`<script>window.location.replace('/blog/blog-contant/${deleteComment.articls}');</script>`);


})


export {
  commentHendeler,
  getArticalComment,
  deleteComment
}