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
//    console.log("req.params.id", req.params.id);
//    console.log("req.body.id", req.body.id);
   

    const id = req.params.id; // <-- use req.params.id, not req.param.id
    
    const mailId = await ContactMessage.findById(id)
    console.log("mail first", mailId.status);
    if (mailId.status === 'unread') {
        mailId.status = "read"
           await mailId.save({validateBeforeSave : false}) 
        // console.log("mail with read ", mail);
    }
    console.log("mail second", mailId);
    
    
   
   
    //  const unread = await ContactMessage.countDocuments({ status: "unread" });
    // const read = await ContactMessage.countDocuments({ status: "read" });
    
   
    return res.redirect(`/admin/admin-messages?show=${id}`);

});



export {
     AdminMessages,
     readMail
}
