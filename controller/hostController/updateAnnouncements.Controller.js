// import { create } from "connect-mongo";
import asyncHandler from "../../utils/asyncHandler.js";
import update from "../../models/Announcment.Model.js";

const getUpdateAnnouncments = asyncHandler(async (req, res) => {
  res.render('Admin.Dashbord/Announcements', {
     title: 'Announcements', 
    })
})






const updateAnnouncements = asyncHandler(async (req, res) => {

  const { textName, discrib, Categories } = req.body;

  if (!textName || !discrib || !Categories) {
    throw new Error("something went is wrong", 403);
  }

  const updateSite = await update.create({
    title: textName,
    description: discrib,
    category: Categories
  })

  console.log("updateSite", updateSite);
  
  return res.redirect("/admin-Announcements")

   
})



export  {
  updateAnnouncements,
  getUpdateAnnouncments
}