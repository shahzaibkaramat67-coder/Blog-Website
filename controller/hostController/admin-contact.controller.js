import ContactMessage from "../../models/mail.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

const AdminMessages = asyncHandler(async(req, res)=>{
    const adminMessages = await ContactMessage.find().sort({createdAt : -1})


const totalMail = await ContactMessage.countDocuments();

console.log("totalMail", totalMail);


const readsMails = await ContactMessage.countDocuments({status : "read"})
console.log("readsMails", readsMails);



const unreadMails = await ContactMessage.countDocuments({ status: "unread" });
console.log("unreadMails", unreadMails);


    const showId = req.query.show || null


    

return res.render("Admin.Dashbord/message", { layout: false,  adminMessages, totalMail, readsMails, unreadMails, showId});


})


const readMail = asyncHandler(async (req, res) => {


    const id = req.params.id;   // <-- use req.params.id, not req.param.id
    
   
    const mail = await ContactMessage.findByIdAndUpdate(
        id,
        {status : "read"},
        {new : true}
    )
    //  const unread = await ContactMessage.countDocuments({ status: "unread" });
    // const read = await ContactMessage.countDocuments({ status: "read" });
    console.log("mail", mail);
    
   
    return res.redirect(`/admin/admin-messages?show=${id}`);

});



export {
     AdminMessages,
     readMail
}
