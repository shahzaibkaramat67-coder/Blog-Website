import { Articals } from "../../../models/ArticalModel.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import {earningCalculate} from "../../../helper/earningCalculation.js";
import { ArticleView } from "../../../models/view.Model.js";
import { milesToDoller } from "../../../helper/earningCalculation.js";
import withdraw from "../../../models/withdraw.Model.js";
import User from "../../../models/Signup.model.js";

const userEarning = asyncHandler(async(req, res)=>{
    const userId = req.user._id
    const user = await User.findOne(userId).select("Username balanceMills totalEarningsMills")
    console.log("user user user user", user);
    const username = user.Username;
   const total = (user.totalEarningsMills/1000).toFixed(3);
   const available = (user.balanceMills/1000).toFixed(3);



    const now = new Date();
    const monthKey = now.toISOString().slice(0, 7)
    const dayKey = now.toISOString().slice(0, 10)


const views = await ArticleView.find({User : req.user._id})

//  const total =  views.reduce((sum, view) => sum + ((view?.earningsMills || 0)/1000), 0).toFixed(3)
 const month =  views.reduce((sum, view) => sum + ((view?.monthly?.get(monthKey)?.earningsMills || 0)/1000), 0).toFixed(3)
 const today =  views.reduce((sum, view) => sum + ((view?.daily?.get(dayKey)?.earningsMills || 0)/1000), 0).toFixed(3)

 console.log("total", total);
 console.log("month", month);
 console.log("today", today);
 console.log("available", available);
 

//  const  withdrawList = await withdraw.find({User : req.user._id}).populate("user", "usernam")
const withdrawalRequest = await withdraw
  .find({ user: req.user._id })
  .select("amount status createdAt user")   // only needed fields
  .populate("user", "Username")
  .lean();
console.log("withdrawList", withdrawalRequest);

  const result = withdrawalRequest.map(w => ({
  status: w.status,
  amount: milesToDoller(w.amount),
  createdAt: w.createdAt,
  username: w.user?.Username || "Unknown"
}));
// console.log("withdraw result", result);


 console.log("result", result);
 
      


    

    return res.render("Dashbord/EarningPage", {
       title : "EarningPage",
        total,
        month,
        today,
        available,
        withdrawalRequest : result,
    })
    
})
 

export default userEarning;
