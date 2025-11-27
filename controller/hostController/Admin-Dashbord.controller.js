import asyncHandler from "../../utils/asyncHandler.js";
import { Profile } from '../../models/profile.model.js';
import { Articals } from "../../models/ArticalModel.js";

const admianDashbord = asyncHandler(async(req, res)=>{
  const  totalProfiles = await Profile.countDocuments();
  console.log("profiles", totalProfiles);
  

const startMonthlyProfiles = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0);
const endMonthlyProfiles = new Date(new Date().getFullYear(), new Date().getMonth(), + 1, 0, 23, 59, 59);

const MonthlyProfiles = await Profile.countDocuments({createdAt : {$gte : startMonthlyProfiles, $lte : endMonthlyProfiles}})

console.log("MonthlyProfiles", MonthlyProfiles);

const startDayProfile = new Date();
startDayProfile.setHours(0,0,0,0);
const endDayProfile = new Date();
endDayProfile.setHours(23,59,59,999)

const dayProfile =await Profile.countDocuments({createdAt: {$gte : startDayProfile, $lte : endDayProfile}})
console.log('dayProfile', dayProfile);


// const articals = await Articals.aggregate([
//     //  {
//     //     $lookup :{
//     //         "from" : ar
//     //     }
//     //  }
// ])

// console.log("articals", articals);



return res.render("Admin.Dashbord/Dashbord", {layout : false,title : "Dashbord"});

})

export default admianDashbord