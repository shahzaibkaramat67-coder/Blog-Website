import { Articals } from "../../../models/ArticalModel.js";
import asyncHandler from "../../../utils/asyncHandler.js";


// Show all posts in table
const postInTable = asyncHandler(async (req, res) => {
  const artical = await Articals.find().sort({ createdAt: -1 });

  return res.render("Dashbord/postsAnalytics", {
    layout: false,
    title: "postsAnalytics",
    artical,
  });
});

// Return chart data for modal popup
const chart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const days = parseInt(req.query.days) || 7;

  const article = await Articals.findById(id);

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // Starting date
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Prepare arrays
  const labels = [];
  const views = [];
  const likes = [];
  const shares = [];

  // Loop through each DAY backward
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);

    const dayStart = new Date(day.setHours(0, 0, 0, 0));
    const dayEnd = new Date(day.setHours(23, 59, 59, 999));

    labels.push(dayStart.toISOString().slice(0, 10)); // yyyy-mm-dd

    views.push(
      article.views.filter(
        v => v.viewdAt >= dayStart && v.viewdAt <= dayEnd
      ).length
    );

    likes.push(
      article.like.filter(
        l => l.likedAt >= dayStart && l.likedAt <= dayEnd
      ).length
    );

    shares.push(
      article.shareHistory.filter(
        s => s.sharedAt >= dayStart && s.sharedAt <= dayEnd
      ).length
    );
  }



  //  return res.render("Dashbord/postsAnalytics", {
  //   layout: false,
  //   title: "postsAnalytics",
  //   labels,
  //   views,
  //   likes,
  //   shares,
  // });
  return res.json({ labels, views, likes, shares });

   
});



export { postInTable, chart };
