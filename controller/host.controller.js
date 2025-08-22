import asyncHendler from "../utils/asyncHendler.js";
import {Category} from '../models/Category.model.js'
import blogCategories from '../constant.js'
const Categorys = asyncHendler(async(req, res)=>{
   const arrayObject = Object.entries(blogCategories).map(([slug, name])=>({
    
        slug,
        name 
    
   }))



  try {
    const result = await Category.insertMany(arrayObject, {ordered : false})
    res.status(201)
    .json(
        {message : 'data enter in db', data : result}
    )
  } catch (error) {
    res.status(500)
    .json(
        {message : 'something went wrong', error}
    )
    
  }
})


export {
    Categorys
}