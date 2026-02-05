import withdraw from "../../models/withdraw.Model.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";

const withdrawRequestList = asyncHandler(async(req, res)=>{

    const withdrawList = await withdraw.find().populate("user", "Username Email").sort({ createdAt: -1 });
    // console.log(withdrawList);
    
    // const status = withdrawList?.status = "pending" ?  withdrawList.length : 
    
    const  pending = await withdraw.countDocuments({status : "pending"})
    const Approve = await withdraw.countDocuments({status : "approved"})
    const Total = await withdraw.countDocuments()


    res.render('Admin.Dashbord/Withdraw', {
        layout: false,
        title: 'Withdraw',
        page: "Withdraw",
        withdrawList,
        pending,
        Approve,
        Total
    })

})


const action = asyncHandler(async(req, res)=>{

const {id} =req.params;
const {action} = req.body;

if (!["Approve", "Decline"].includes(action)) {
    throw new ApiError("something went wromg", 401);
    
}



const withdrawList = await withdraw.findById(id)
console.log("withdrawList", withdrawList);

withdrawList.status = action === "Approve" ? "approved" : "rejected";
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
