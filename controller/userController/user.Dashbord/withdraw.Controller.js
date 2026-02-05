import ApiError from "../../../utils/ApiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import withdraw from "../../../models/withdraw.Model.js"
// import { check } from "express-validator";
import User from "../../../models/Signup.model.js";
// import { use } from "passport";
// import User from "../../../models/Signup.model.js";

const withdrawController = asyncHandler(async (req, res) => {

    const { amount, method, accountDetails } = req.body;
    const userId = req.user._id;

    if (!userId) {
        req.flash("error", "something went wrong");
        return res.redirect("/profile/Dashbord/Withdraw");
    }


     if (!amount || !method || !accountDetails) {
        req.flash("error", "something went wrong");
        return res.redirect("/profile/Dashbord/Withdraw");
    }

    if (amount < 10) {
         req.flash("error", "For Withdraw Amount Must be Greator then 10$");
        return res.redirect("/profile/Dashbord/Withdraw");
    }

    await withdraw.create({
        user : userId,
        amount,
        accountDetails,
        method,
    })

    const user = await User.findOne({_id : userId}).select("balanceMills");

     if (!user) {
        req.flash("error", "something went wrong");
        return res.redirect("/profile/Dashbord/Withdraw");
    }
    const withdrawAmount = user.balanceMills  - amount;
    
    user.withdrawAmount = withdrawAmount;

     
     
     res.redirect("/profile/Dashbord/Withdraw");

    // const userId = req.user._id
    // console.log("userId", userId);


    // const user = await User.find(userId).select("username")
    
    // console.log("user from the withdrawController", user);


    // if (!amount || !method || !accountDetails) {
    //     req.flash("error", "something went wrong");
    //     return res.redirect("/profile/Dashbord/Withdraw");

    // }

    // if (amount >= 10) {
    //     req.flash("error", "the ammount should be greater then 10$!");
    //     return res.redirect("/profile/Dashbord/Withdraw");
    // }


    // console.log("here i am going to create withdraw request");

    // const withdrawData = await withdraw.create({
    //     user: userId,
    //     amount,
    //     method,
    //     accountDetails,
    // })
    // console.log("withdrawData", withdrawData);
    // console.log("here i am going to create withdraw request");

    // await User.findById(id, {})


    // await withdrawData.save({validateBeforeSave : false})


})

export default withdrawController