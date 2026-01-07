import asyncHandler from "../../utils/asyncHandler.js";
import { Profile } from '../../models/profile.model.js';
import { Articals } from "../../models/ArticalModel.js";
import User from "../../models/Signup.model.js";


const userInfo = asyncHandler(async (req, res) => {
  const totalProfiles = await Profile.countDocuments();
  console.log("totalProfiles", totalProfiles);

  const startMonthlyProfiles = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0);
  const endMonthlyProfiles = new Date(new Date().getFullYear(), new Date().getMonth(), + 1, 0, 23, 59, 59);

  const MonthlyProfiles = await Profile.countDocuments({ createdAt: { $gte: startMonthlyProfiles, $lte: endMonthlyProfiles } })
  console.log("MonthlyProfiles", MonthlyProfiles);

  const startDayProfile = new Date();
  startDayProfile.setHours(0, 0, 0, 0);
  const endDayProfile = new Date();
  endDayProfile.setHours(23, 59, 59, 999)

  const dayProfile = await Profile.countDocuments({ createdAt: { $gte: startDayProfile, $lte: endDayProfile } })

  console.log("dayProfile", dayProfile);

  // const activeUser = await User.find([
  //   {$unwind :{status : "active"}},
  //   {
  //     $group:{ _id : null, activeUserCount :{$sum : 1}}
  //   }
  // ])

  // const countActiveUser = activeUser[0]?.activeUserCount;

  const activeUser = await User.countDocuments({ status: "active" })
  console.log("activeUser", activeUser);


  const bandUser = await User.countDocuments({ status: "banned" })

  const admin = await User.countDocuments({ role: "admin" })

  const user = await User.countDocuments({ role: "user" })


  const startTodayLogin = new Date()
  startTodayLogin.setHours(0, 0, 0, 0)
  const endTodayLogin = new Date()
  endTodayLogin.setHours(23, 59, 59, 999)

  const TodayLogin = await User.countDocuments({ lastLoginAt: { $gte: startTodayLogin, $lte: endTodayLogin } })

  console.log("TodayLogin", TodayLogin);

  const startTodaySignups = new Date()
  startTodaySignups.setHours(0, 0, 0, 0)
  const endTodaySignups = new Date()
  endTodaySignups.setHours(23, 59, 59, 999)

  const newSignups = await User.countDocuments({ createdAt: { $gte: startTodaySignups, $lte: endTodaySignups } })

  const thirtyDayAgo = new Date()
  thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30)

  const greaterThenThirty = await User.countDocuments({ lastLoginAt: { $lte: thirtyDayAgo } })


  return res.render("Admin.Dashbord/user",
    {
      layout: false,
      title: "user",
      totalProfiles,
      MonthlyProfiles,
      dayProfile,
      activeUser,
      bandUser,
      admin,
      user,
      TodayLogin,
      newSignups,
      greaterThenThirty
    });

})

const userGraph = asyncHandler(async (req, res) => {

  const days = parseInt(req.query.days) || 7;


  const labelsArr = [];
  const activeUserArr = [];
  const userArr = [];
  const TodayLoginUserArr = [];

  const startDay = new Date();
  startDay.setDate(startDay.getDate() - (days - 1))
  startDay.setHours(0, 0, 0, 0);

  const endDay = new Date();
  endDay.setHours(23, 59, 59, 999)



 const activeUser = await User.aggregate([
  {
    $facet:{
      dailyUsers:[
        {$match :{createdAt :{$gte : startDay, $lte : endDay}}},
        {
          $group:{
            _id :{$dateToString :{format : "%Y-%m-%d", date : "$createdAt"}},
            count :{$sum : 1}
          }
        },
      ],
      status:[
        { $match :{ status: "active"} }, 
        {
          $group:{
            _id :{ $dateToString :{format : "%Y-%m-%d", date : "$updatedAt"}},
            count :{$sum: 1}
          }
        }
      ],
      lastLoginAt:[
        {$match :{lastLoginAt :{$gte : startDay, $lte : endDay}}},
        {
          $group:{
            _id :{$dateToString :{format : "%Y-%m-%d", date :"$lastLoginAt",   timezone: "+05:00" }},
            count :{$sum : 1}
          }
        }
      ]
    }
  }
 ])


  for (let i = 0; i < days; i++) {
    const date = new Date(startDay);
    date.setDate(startDay.getDate() + i)
    const labels = date.toISOString().split("T")[0];

    labelsArr.push(labels)

    const userActive = activeUser[0].dailyUsers.find(u => u._id === labels)?.count || 0;
    const totalUser = activeUser[0].status.find(u => u._id === labels)?.count || 0;
    const LoginUser = activeUser[0].lastLoginAt.find(u => u._id === labels)?.count || 0;

    activeUserArr.push(userActive);
    userArr.push(totalUser);
    TodayLoginUserArr.push(LoginUser)
  }


  return res.json({
    labelsArr,
    activeUserArr,
    userArr,
    TodayLoginUserArr
  })

})


export {
  userInfo,
  userGraph
}