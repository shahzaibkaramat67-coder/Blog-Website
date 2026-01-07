import { Articals } from "../../../models/ArticalModel.js";
import asyncHandler from "../../../utils/asyncHandler.js";

const userEarning = asyncHandler(async (req, res) => {

    console.log("this is views count for earning page ");



    const diwbdiw = await Articals.countDocuments()
    console.log("diwbdiw", diwbdiw);
    const earningByViews = await Articals.aggregate([
        {
            $match :{User : req.user._id}
        },
        { $unwind: "$views" },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views.view" }
            }
        }
    ]);

    console.log("Total Views:", earningByViews?.[0]?.totalViews || 0);
    
    const monthlyStartViews = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const monthlyEndViews = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23,59,59,999)
    const monthlyEarningByViews = await Articals.aggregate([
        {
            $match :{User : req.user._id}
        },
        {
          $match :{viewdAt : {$gte: monthlyStartViews, $lte:monthlyEndViews}} 
        },
        { $unwind: "$views" },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views.view" }
            }
        }
    ]);
        console.log("monthlyEarningByViews Total Views:", monthlyEarningByViews?.[0]?.totalViews || 0);
    const dayStartViews = new Date()
    dayStartViews.setHours(0,0,0,0)
    const dayEndViews = new Date()
    dayEndViews.setHours(23,59,59,999)
    // const dayEndViews = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23,59,59,999)
    const dayEarningByViews = await Articals.aggregate([
        {
            $match :{User : req.user._id}
        },
        {
          $match :{viewdAt : {$gte: dayStartViews, $lte:dayEndViews}} 
        },
        { $unwind: "$views" },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views.view" }
            }
        }
    ]);
    console.log("dayEarningByViews Total Views:", dayEarningByViews?.[0]?.totalViews || 0);


    return res.render('Dashbord/EarningPage', {
        layout: false,
        title: 'earning',
        // page: "earning"
    })
});

export default userEarning;
