import withdraw from "../../models/withdraw.Model.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { milesToDoller } from "../../helper/earningCalculation.js";

const withdrawRequestList = asyncHandler(async(req, res)=>{

    // const withdrawList = await withdraw.find()
    // .select("amount status createAt ")
    // .populate("user", "Username Email")
    // .sort({ createdAt: -1 });
    // console.log(withdrawList);

    const withdrawList = await withdraw.find({})
      .select("amount status createdAt user")   // only needed fields
      .populate("user", "Username Email")
      .lean();
    // console.log("withdrawList", withdrawList);
    
      const result = withdrawList.map(w => ({
        _id : w._id,
      status: w.status,
      amount: milesToDoller(w.amount),
      createdAt: w.createdAt,
      username: w.user?.Username || "Unknown",
      email: w.user?.Email 
    }));
    // console.log("withdraw result", result);
    
    
    //  console.log("result", result);
    
    // const status = withdrawList?.status = "pending" ?  withdrawList.length : 
    
    const  pending = await withdraw.countDocuments({status : "pending"})
    const Approve = await withdraw.countDocuments({status : "approved"})
    const Total = await withdraw.countDocuments()


    res.render('Admin.Dashbord/Withdraw', {
        layout: false,
        title: 'Withdraw',
        page: "Withdraw",
        withdrawList : result,
        pending,
        Approve,
        Total
    })

})


const action = asyncHandler(async(req, res)=>{
console.log("this for action hvfveyfbeyb yb2 y32b rb3urb3 ur3ub");

const {id, action} =req.params;
// const {} = req.body;

console.log("id", id);
console.log("action", action);


if (!["approve", "decline"].includes(action)) {
    throw new ApiError("something went wromg", 401);
    
}





const withdrawList = await withdraw.findById(id)
console.log("withdrawList", withdrawList);

 if (withdrawList.status !== "pending") {
    return res.status(400).json({ success: false, message: "Already processed" });
  }


withdrawList.status = action === "approve" ? "approved" : "rejected";



  await withdrawList.save();

  return res.json({
      success: true,
      message: `Withdrawal ${withdrawList.status} successfully`
    });
})
export {
 withdrawRequestList,
    action

}
