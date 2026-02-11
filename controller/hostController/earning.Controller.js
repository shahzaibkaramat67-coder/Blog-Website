import User from "../../models/Signup.model.js";
import { ArticleView } from "../../models/view.Model.js";
import asyncHandler from "../../utils/asyncHandler.js";


const adminEarning = asyncHandler(async (req, res) => {
    const now = new Date()
    let monthlykey = now.toISOString().slice(0, 7)
    let dailykey = now.toISOString().slice(0, 10)

const totalEarning = await User.aggregate([
    {
        $group :{
            _id: null,
      totalEarningsMills: { $sum: "$totalEarningsMills" },
      balanceMills: { $sum: "$balanceMills" }
        }
    }
])




console.log("totalEarning", totalEarning);
const Earning = await ArticleView.aggregate([
  {
    $project: {
      dailyObj: { $objectToArray: { $ifNull: ["$daily", {}] } },
      monthlyObj: { $objectToArray: { $ifNull: ["$monthly", {}] } }
    }
  },
  {
    $project: {
      dailyEarnings: {
        $sum: {
          $map: {
            input: {
              $filter: {
                input: "$dailyObj",
                as: "d",
                cond: { $eq: ["$$d.k", dailykey] }
              }
            },
            as: "item",
            in: { $ifNull: ["$$item.v.earningsMills", 0] }
          }
        }
      },
      monthlyEarnings: {
        $sum: {
          $map: {
            input: {
              $filter: {
                input: "$monthlyObj",
                as: "m",
                cond: { $eq: ["$$m.k", monthlykey] }
              }
            },
            as: "item",
            in: { $ifNull: ["$$item.v.earningsMills", 0] }
          }
        }
      }
    }
  },
  {
    $group: {
      _id: null,
      dailyEarn: { $sum: "$dailyEarnings" },
      monthlyEarn: { $sum: "$monthlyEarnings" }
    }
  }
]);

//  const month =  Earning.reduce((sum, view) => sum + ((view?.monthly?.get(monthlykey)?.earningsMills || 0)/1000), 0).toFixed(3)
//  const today =  Earning.reduce((sum, view) => sum + ((view?.daily?.get(dailykey)?.earningsMills || 0)/1000), 0).toFixed(3)



console.log("Earning", Earning);

const total =  ((totalEarning[0]?.totalEarningsMills || 0) /1000).toFixed(3)
const month = ((Earning[0]?.monthlyEarn || 0)/1000).toFixed(3)
const day = ((Earning[0]?.dailyEarn || 0)/1000).toFixed(3)
const balance = ((totalEarning[0]?.balanceMills || 0)/1000).toFixed(3)
console.log("total", total);
console.log("month", month);
console.log("day", day);
console.log("balance", balance);



// console.log("today", today);




// const balanceMills = await User.aggregate([
//     {
//         $group :{
//             _id : null, totalEarn:{$sum : "$balanceMills"}
//         }
//     }
// ])
// console.log("balanceMills", balanceMills);




//    const total = totalEarning.forEach
// const totalEarning = await User.find().select("totalEarningsMills")

//  const totalEarwdwdning = totalEarning.reduce((total, earning )=> total + (earning.totalEarningsMills) || 0)

// console.log("totalEarwdwdning", totalEarwdwdning);






// console.log("dailyEarning", dailyEarning);


// const monthlyEarning = await User.aggregate([
//     {
//         $group:{
//             _id: null, totalEarning:{$sum : `$daily.get(monthlykey).earningsMills`}
//         }
//     }
// ])

// console.log("monthlyEarning", monthlyEarning);


    res.render('Admin.Dashbord/earning', {
         layout: false,
          title: 'earning',
           page: "earning",
           total,
           month,
           day,
           balance
        })
})


export {
    adminEarning
}
