// import { title } from "process";
import { Articals } from "../../models/ArticalModel.js";
import asyncHandler from "../../utils/asyncHandler.js";

const ArticleList = asyncHandler(async(req, res)=>{

     const cate = req.params.cat;
     const userId = req.user._id
 

  const article = await Articals.find({User : userId, category : cate})
  .sort({createdAt : -1})
  .limit(2)
  .lean()

  
  const cat = cate.replace(/-/g, " ")
    

    return res.render("ArticleList", {
        title : "Articles in"+ cat,
        page : "Articles in"+ cat,
        // layout : false,
        allArtical : article,
        cat
    })


})


const articleListByApi = asyncHandler(async(req, res)=>{

    const category = req.params.category;
   const page = parseInt(req.query.page) || 1; 
    console.log("page", page);
    
    const userId = req.user._id
    const limit = 2;


  const article = await Articals.find({User : userId, category})
  .sort({createdAt : -1})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean()

  console.log("article", article);
  
  res.json(article)
})

export  {
    ArticleList,
    articleListByApi
}