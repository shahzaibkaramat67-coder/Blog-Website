import { Articals } from "../../../models/ArticalModel.js";
import asyncHandler from "../../../utils/asyncHandler.js";
// import { logOut } from "../user.controller.js";

const updateArticle = asyncHandler(async(req, res)=>{
  const id = req.params.id;
  const data = req.body
  console.log("id", id);
  console.log("data", data);
  
  
  if (req.file) {
      articalUpdate.featured_image = req.file.path;
    }
    // const articalUpdate = await Articals.findByIdAndUpdate(id, data).sort({createdAt : -1})
    const findArticle = await Articals.findById(id);
    console.log("findArticle", findArticle);
    


 
  
  // console.log("articalUpdate", articalUpdate);
  
res.render("Dashbord/Artical", { title: "Article Update", articalUpdate : findArticle});

    

})
const deleteArticle = asyncHandler(async(req, res)=>{
  const id = req.params.id;

  if (!id) return res.send("No id");

  await Articals.findByIdAndDelete(id)
  
  console.log("article is deleet successfully ");
  
  const Analysist = await Articals.find({ User: req.user._id }).sort({ createdAt: -1 });

  res.render("Dashbord/postsAnalytics", { title : "postsAnalytics", Analysist})
// res.redirect('/profile/Dashbord/postsAnalytics');

    
})

export {
    updateArticle,
    deleteArticle
}