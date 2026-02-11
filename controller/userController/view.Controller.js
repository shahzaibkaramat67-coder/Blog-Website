import asyncHandler from "../../utils/asyncHandler.js";
import { Articals } from "../../models/ArticalModel.js";
import ApiError from "../../utils/ApiError.js";
import ArticleLike from "../../models/like.Model.js";
import Comment from "../../models/comment.model.js";
import { ArticleView } from "../../models/view.Model.js";
import earningCalculate from "../../helper/earningCalculation.js"
import User from "../../models/Signup.model.js";

const ONE_HOUR = 60 * 60 * 1000; // 1 hour cooldown

const viewControl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!id) throw new ApiError("No article ID provided", 400);

  const now = new Date();
  const dayKey = now.toISOString().slice(0, 10);
  const monthKey = now.toISOString().slice(0, 7);

  // Fetch article RPM for earnings
  const article = await Articals.findById(id).select("rpm totalViews estimatedEarningMills");
  if (!article) throw new ApiError("Article not found", 404);
  const rpmRate = Number(article?.rpm) || 0;
  const perViewEarningMills = earningCalculate(1, rpmRate); // DB-safe integer
  // const perViewEarning = (perViewEarningMills / 1000).toFixed(3); // string for UI

  console.log("perViewEarningMills", perViewEarningMills);

  // 1️ Find existing view document for this user + article
  let viewDoc = await ArticleView.findOne({ article: id, User: userId });
  // let viewDoc = await ArticleView.findOne({ article: id, User: userId });
  console.log("viewDoc", viewDoc);

  if (!viewDoc) {
    // First time viewing this article → create new document & count view
    viewDoc = new ArticleView({
      article: id,
      User: userId,
      total: 1,
      monetized: 1,
      earningsMills: perViewEarningMills,
      daily: { [dayKey]: { views: 1, monetized: 1, earningsMills: perViewEarningMills } },
      monthly: { [monthKey]: { views: 1, monetized: 1, earningsMills: perViewEarningMills } },
      lastDay: dayKey,
      lastMonth: monthKey,
      lastViewedAt: now
    });

    await viewDoc.save();

    // Increment article totals
    await Articals.findByIdAndUpdate(
      id,
      { $inc: { totalViews: 1, estimatedEarningMills: perViewEarningMills } },
      { new: true }
    );
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          totalEarningsMills: perViewEarningMills,
          balanceMills: perViewEarningMills
        }
      },
      { new: true }
    )
    console.log("updatedUser", updatedUser);

  } else {
    // Already viewed before → check 1-hour cooldown
    if (!viewDoc.lastViewedAt || now - viewDoc.lastViewedAt >= ONE_HOUR) {
      // Cooldown passed → increment view counts
      await ArticleView.findByIdAndUpdate(viewDoc._id, {
        $inc: {
          total: 1,
          monetized: 1,
          earningsMills: perViewEarningMills,
          [`daily.${dayKey}.views`]: 1,
          [`daily.${dayKey}.monetized`]: 1,
          [`daily.${dayKey}.earningsMills`]: perViewEarningMills,
          [`monthly.${monthKey}.views`]: 1,
          [`monthly.${monthKey}.monetized`]: 1,
          [`monthly.${monthKey}.earningsMills`]: perViewEarningMills
        },
        $set: {
          lastDay: dayKey,
          lastMonth: monthKey,
          lastViewedAt: now
        }
      });

      // Increment article totals
      await Articals.findByIdAndUpdate(
        id,
        { $inc: { totalViews: 1, estimatedEarningMills: perViewEarningMills } },
        { new: true }
      );
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            totalEarningsMills: perViewEarningMills,
            balanceMills: perViewEarningMills
          }
        },
        { new: true }
      )
      console.log("updatedUser", updatedUser);

    }

    // else → viewed within last hour → do nothing (view not counted)
  }

  // 2️ Fetch like status, comments, and article data for rendering
  const liked = userId ? await ArticleLike.exists({ article: id, user: userId }) : false;
  const comments = await Comment.find({ article: id }).sort({ createdAt: -1 });
  const articalById = await Articals.findById(id)
    .select("title featured_image username publish_date content _id")
    .populate("username", "username");

  // 3️ Render blog content
  return res.render("blog-contant", {
    title: "blog-contant",
    articalById,
    liked: !!liked,
    comments
  });
});

export { viewControl };
