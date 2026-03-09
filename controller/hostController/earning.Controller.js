import User from "../../models/Signup.model.js";
import { ArticleView } from "../../models/view.Model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js"
import withdraw from "../../models/withdraw.Model.js";
import { milesToDoller } from "../../helper/earningCalculation.js";

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



// console.log("Earning", Earning);

const total =  ((totalEarning[0]?.totalEarningsMills || 0) /1000).toFixed(3)
const month = ((Earning[0]?.monthlyEarn || 0)/1000).toFixed(3)
const day = ((Earning[0]?.dailyEarn || 0)/1000).toFixed(3)
// const balance = ((totalEarning[0]?.balanceMills || 0)/1000).toFixed(3)
// console.log("total", total);
// console.log("month", month);
// console.log("day", day);


const panddingWithdrawals = await withdraw.aggregate([
  {
    $match: { status: "pending" } // filter only pending withdrawals
  },
  {
    $group: {
      _id: null,
      totalPending: { $sum: "$amount" } // sum the "amount" field
    }
  }
]);


console.log("Total pending panddingWithdrawals:", panddingWithdrawals);
// Optional: get the total value
const balance = milesToDoller(panddingWithdrawals[0]?.totalPending || 0).toFixed(2);

console.log("Total pending withdrawals:", balance);

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
        
          title: 'earning',
           total,
           month,
           day,
           balance
        })
})


const earmingHraph = asyncHandler(async (req, res) => {

  const days = parseInt(req.query.days) || 7;

  const now = new Date();
  const dateForGraph = [];

  //  Build last N days
  for (let i = days - 1; i >= 0; i--) {
    const newDate = new Date(now);
    newDate.setDate(now.getDate() - i);
    dateForGraph.push(newDate.toISOString().slice(0, 10));
  }

  //  Single aggregation
  const earning = await ArticleView.aggregate([
    { $project: { daily: 1, _id: 0 } },
    { $project: { dayArray: { $objectToArray: "$daily" } } },
    { $unwind: "$dayArray" },
    { $match: { "dayArray.k": { $in: dateForGraph } } },
    {
      $group: {
        _id: "$dayArray.k",
        totalEarning: { $sum: "$dayArray.v.earningsMills" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  //  Fill missing days
  const graph = dateForGraph.map(day => {
    const found = earning.find(e => e._id === day);
    return {
      day,
      totalEarning: found ? found.totalEarning : 0
    };
  });

  console.log("graph", graph);

  res.status(200).json({
    success: true,
    data: graph
  });

  
  
});


export {
    adminEarning,
    earmingHraph
}
