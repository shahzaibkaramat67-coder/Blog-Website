import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Articals } from "../../models/ArticalModel.js";
import ArticleLike from "../../models/like.Model.js";

// This can support owners, logged-in users, and guests
const likeArtical = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError("Article ID missing", 400);

  const article = await Articals.findById(id).select("username totalLikes");
//   if (!article) throw new ApiError("Article not found", 404);

  // Determine user: logged-in or guest
  let userId = req.user?._id;
  let isGuest = false;
  if (!userId) {
    // guest handling: generate a unique guestId in session
    if (!req.session.guestId) req.session.guestId = "guest_" + Date.now() + "_" + Math.random();
    userId = req.session.guestId;
    isGuest = true;
  }

  // Owner always counts as liked
  const isOwner = req.user && String(req.user._id) === String(article.username);

  let liked = false;

  if (!isOwner) {
    // check if this user (or guest) already liked
    const existingLike = await ArticleLike.findOne({ article: id, user: userId });

    if (existingLike) {
      // unlike
      await ArticleLike.findByIdAndDelete(existingLike._id);
      await Articals.findByIdAndUpdate(id, { $inc: { totalLikes: -1 } });
      liked = false;
    } else {
      // like
      await ArticleLike.create({ article: id, user: userId, likedAt: Date.now(), isGuest });
      await Articals.findByIdAndUpdate(id, { $inc: { totalLikes: 1 } });
      liked = true;
    }
  } else {
    // Owner always liked
    liked = true;
  }

    return res.json({ success: true, liked });
});

export { likeArtical };










// import ApiError from "../../utils/ApiError.js";
// import asyncHandler from "../../utils/asyncHandler.js";
// import { Articals } from "../../models/ArticalModel.js";
// import ArticleLike from "../../models/like.Model.js"



// const likeArtical = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const userId = req.user?.id;

//     if (!id) throw new ApiError("Article ID missing", 400);

//     let liked;
//     const isLikeExisted = await ArticleLike.findOne({ article: id, user: userId });

//     if (isLikeExisted) {
//         await ArticleLike.findOneAndDelete({ article: id, user: userId });
//         await Articals.findByIdAndUpdate(id, { $inc: { totalLikes: -1 } });
//         liked = false;
//     } else {
//         await ArticleLike.create({ article: id, user: userId, likedAt: Date.now() });
//         await Articals.findByIdAndUpdate(id, { $inc: { totalLikes: 1 } });
//         liked = true;
//     }

//     return res.json({ success: true, liked });
// });


// export {

//     likeArtical

// }