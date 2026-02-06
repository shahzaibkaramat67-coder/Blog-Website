import User from "../../models/Signup.model.js";
import { ArticleView } from "../../models/view.Model.js";
import asyncHandler from "../../utils/asyncHandler.js";


const adminEarning = asyncHandler(async (req, res) => {
    const now = new Date()
    let monthlykey = now.toISOString().slice(0, 7)
    let dailykey = now.toISOString().slice(0, 10)

const totalEarning = await User.aggregate([
    {
        $group:{
            _id: null, totalEarning:{$sum : "$totalEarningsMills"}
        }
    }
])

console.log("totalEarning", totalEarning);



const dailyEarning = await ArticleView.aggregate([
    {
        $group:{
            _id: null, totalEarning:{$sum : `$daily.get(dailykey).earningsMills`}
        }
    }
])

console.log("dailyEarning", dailyEarning);


const monthlyEarning = await User.aggregate([
    {
        $group:{
            _id: null, totalEarning:{$sum : `$daily.get(monthlykey).earningsMills`}
        }
    }
])

console.log("monthlyEarning", monthlyEarning);


    res.render('Admin.Dashbord/earning', {
         layout: false,
          title: 'earning',
           page: "earning" 
        })
})


export {
    adminEarning
}
