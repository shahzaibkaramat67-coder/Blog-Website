import { Articals } from "../../../models/ArticalModel";
import asyncHandler from "../../../utils/asyncHandler";


const totalBlog = asyncHandler(async(req, res)=>{
    const allArtical = await Articals.countDocuments()
}) 

const monthlyBlog = asyncHandler(async(req, res)=>{
    const startDate = new Date(new Date().getFullYear, new Date().getMonth(), 1)
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth + 1, 23,59,59,999)
    const monthlyCreatedBlog = await Articals.countDocuments({createdAt : {$gte : startDate, $lte : endDate}})
}) 

const todayBlog = asyncHandler(async(req, res)=>{
    const startDay = new Date()
    startDay.setHours(0,0,0,0)
    const endDay = new Date()
    endDay.setHours(23, 59, 59, 999)
}) 

export {
    todayBlog,
    monthlyBlog,
    todayBlog
}

