
import asyncHandler from "../../utils/asyncHandler.js";

import { Articals } from "../../models/ArticalModel.js";
import { Profile } from "../../models/profile.model.js";
import {ArticleShare} from "../../models/share.Model.js"


const shareArtical = asyncHandler(async (req, res) => {
  const { articalId, platform } = req.body;
  
  console.log("articalId", articalId);
  console.log("platform", platform);
 
  


  if (!(articalId && platform)) {
    return res.status(400).json({ error: "Missing article ID or platform" });
  }

  const validPlatform = [
    "messenger", "linkedin", "snapchat", "telegram", "whatsapp",
    "twitter", "instagram", "facebook", "google"
  ];

  if (!validPlatform.includes(platform)) {
    return res.status(400).json({ error: "Invalid platform" });
  }

  const artical = await Articals.findById(articalId);
  console.log("artical", artical);
  
  if (!artical) {
    return res.status(404).json({ error: "Article not found" });
  }

  // if (!artical.shares) artical.shares = {};
  // artical.shares[platform] = (artical.shares[platform] || 0) + 1;

  // artical.shareHistory.push({
  //   platform,
  //   sharedAt: new Date()
  // })

  await ArticleShare.create({
    platform,
    article : artical
  })

  await artical.save();

  return res.json({ success: true, message: "Share updated!" });
});

const profile_Image = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ User: req.user._id })
    .select("profile_Image username");

  req.profile = profile; // ✅ object, not array
  next();
});




export {
 
  shareArtical,
  profile_Image

}