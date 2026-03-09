import { Articals } from "../../models/ArticalModel.js";
import Categorie from "../../models/categorie.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

const articalCategories = asyncHandler(async (req, res) => {

  const articleCounts = await Articals.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 }
      }
    }
  ]);

  const articleCountMap = {};
  articleCounts.forEach(a => {
    articleCountMap[a._id] = a.count;
  });

  const allCategories = await Categorie.find(
    {},
    { name: 1, topics: 1, _id: 0 }
  ).lean();

  const finalstage = allCategories.map(cat => ({
    name: cat.name,
    topics: cat.topics.map(topic => ({
      title: topic.title,
      slug: topic.slug,
      articleCount: articleCountMap[topic.slug] || 0
    }))
  }));

  return res.render("Admin.Dashbord/artical", {
 
    title: "Blog Categories",
    finalstage
  });
});


const addToCategory = asyncHandler(async(req, res)=>{

console.log("addToCategory", req.body);



})

export {
  articalCategories,
  addToCategory
} 
