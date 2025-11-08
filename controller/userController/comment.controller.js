import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import Comment from "../../models/comment.model.js";

import uploadOnCloudinary from "../../utils/cloudinary.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Profile } from "../../models/profile.model.js";
import User from "../../models/Signup.model.js";
import { Articals } from "../../models/ArticalModel.js";
import { title } from "process";
const getArticalComment = asyncHandler(async (req, res, next) => {
  const artical = await Articals.findById(req.params.id);
  if (!artical) throw new ApiError("Article not found", 404);

  const comments = await Comment.find({ articls: artical._id })
    .sort({ createdAt: -1 })
    
req.comments = comments;
  // res.render("blog-contant", {
  //   title: "blog-contant",
  //   artical, // ✅ consistent with EJS
  //   comments,
  // });

  next()
});


const commentHendeler = asyncHandler(async (req, res) => {
  const { text, articalId } = req.body;

  if (!text) {
    throw new ApiError("Comment text required", 400);
  }
  console.log("text is", text);
  if (!articalId) {
    throw new ApiError("articalId text required", 400);
  }

  console.log("artical is", articalId);


  const profile = await Profile.findOne({ User: req.user._id })
    .populate("username", "username profile_Image")

  if (!profile) {
    throw new ApiError("profile not found", 404);
  }

  console.log("this is profiel", profile);


  const comment = await Comment.create({
    User: req.user._id,
    articls: articalId,
    Comment: text,
    comment_image: profile.profile_Image,
    username: profile.username
  });

 
  res.redirect(`/blog/blog-contant/${articalId}`);

});

const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id

  if (!commentId) {
    throw new ApiError("the comment id not found", 404);


  }

  const deleteComment = await Comment.findByIdAndDelete(commentId)
  // deleteComment.save()



  if (!deleteComment) {
    throw new ApiError("the cooment not delete", 201);

  }

  res.redirect(`/blog/blog-contant/${deleteComment.articls}`)
  // res.send(`<script>window.location.replace('/blog/blog-contant/${deleteComment.articls}');</script>`);


})


export {
  commentHendeler,
  getArticalComment,
  deleteComment
}