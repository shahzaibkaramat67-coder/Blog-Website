import ContactMessage from "../../models/mail.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

const AdminMessages = asyncHandler(async(req, res)=>{
    const adminMessages = await ContactMessage.find().sort({createdAt : -1})

console.log("adminMessages", adminMessages);
  

return res.render("Admin.Dashbord/message", { layout: false, adminMessages });


})

export default AdminMessages;
