import { Articals } from "../../models/ArticalModel.js";
import Categorie from "../../models/categorie.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

const articalCategories = asyncHandler(async(req, res)=>{
const artical = await Articals.find().select("category");

console.log("profile", artical);


const allArticals = await Categorie.find().countDocuments()
const allArticalCategories = await Categorie.find()
    allArticalCategories.forEach(category =>{
        category.topics.forEach(topic =>{ 
        })
    })


return res.render("Admin.Dashbord/artical", {layout : false,title : "artical", allArticalCategories, allArticals});
})

export default articalCategories;