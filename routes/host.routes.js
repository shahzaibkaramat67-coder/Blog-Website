import express from 'express'
// import {Categorys} from '../controller/hostController/host.controller.js'
import {AdminMessages, readMail} from '../controller/hostController/admin-contact.controller.js'
import {articalCategories} from "../controller/hostController/Categories.controller.js"
import {userInfo, userGraph} from "../controller/hostController/user.controller.js"
import {dashboardController, getChartData } from '../controller/hostController/Admin-Dashbord.controller.js'
import {adminLogin} from "../controller/hostController/admin-login.controller.js"
import {RPMController, showRpm} from '../controller/hostController/RPM.Controller.js'
import {getAddCaategoryPage, groutRpm, addCategory} from '../controller/hostController/addToCategory.Controller.js'
import {withdrawRequestList, action} from "../controller/hostController/withdrawRequest.Controller.js"
import {adminEarning, earmingHraph} from "../controller/hostController/earning.Controller.js"
import {updateAnnouncements, getUpdateAnnouncments} from '../controller/hostController/updateAnnouncements.Controller.js'
import AdminDashboardLayout from "../middleware/Admin.layout.js"
import verifijwt from '../middleware/AdminVerifi.js'
// import isAdmin from '../middleware/checkUserForAdmin.js'
// import checkUserRole from '../middleware/checkRole.js'
// import checkUserRole from "../middleware/checkRole.js"
const router = express.Router()


router.get('/login', (req, res)=>{
    return res.render("login", {layout : false, title : "Admin login", isAdmin : true});
})
router.post('/submit-login', adminLogin)
// router.get('/admin-dashboard',)
// app.use(AdminDashboardLayout)

router.get('/admin-dashboard', AdminDashboardLayout,dashboardController)
router.get('/admin-dashboard/chart-data', AdminDashboardLayout, getChartData)

// router.get('/admin-dashboard/chart-data', dashboardChartDataController)
// /admin-dashboard/chart-data?days
router.get('/admin-users',AdminDashboardLayout, userInfo)
router.get('/admin-users/Chart-data',AdminDashboardLayout, userGraph)
router.get('/admin-earning',AdminDashboardLayout,adminEarning)
router.get('/admin-earning/chart-data',AdminDashboardLayout,earmingHraph)
router.get('/admin-categories',AdminDashboardLayout, articalCategories)
// router.get('/admin-articles',  (req, res)=>{res.render('Admin.Dashbord/artical', {layout : false, title : 'user', page: "user"})})
router.get('/admin-messages',AdminDashboardLayout, AdminMessages)
router.post('/admin-messages/message/:id',AdminDashboardLayout, readMail)
router.get('/admin-settings', AdminDashboardLayout, (req, res)=>{res.render('Admin.Dashbord/setting', {title : 'setting', page: "setting"})})
router.get('/admin-withdraw',AdminDashboardLayout, withdrawRequestList)
router.post('/admin-withdraw/withdraw/:id/:action',AdminDashboardLayout, action)
router.get('/admin-RPM',AdminDashboardLayout,showRpm )
router.post('/admin-RPM/submit',AdminDashboardLayout, RPMController)
router.get('/admin-categoryadd',AdminDashboardLayout,groutRpm,getAddCaategoryPage)
router.post('/admin-categoryadd/submit',AdminDashboardLayout,groutRpm,addCategory)
router.get('/admin-Announcements', AdminDashboardLayout,getUpdateAnnouncments)
router.post('/admin-Announcements/update',AdminDashboardLayout,updateAnnouncements)
// router.get('/admin-withdraw',verifijwt, isAdmin, (req, res)=>{res.render('Admin.Dashbord/Withdraw', {layout : false, title : 'Withdraw', page: "Withdraw"})})


// router.get('/admin-dashboard',verifijwt, isAdmin, checkUserRole(["admin"]), admianDashbord)
// router.get('/admin-users', isAdmin, checkUserRole(["admin"]), (req, res)=>{res.render('Admin.Dashbord/user', {layout : false, title : 'artical', page: "artical"})})
// router.get('/admin-earning',isAdmin,  checkUserRole(["admin"]), (req, res)=>{res.render('Admin.Dashbord/earning', {layout : false, title : 'earning', page: "earning"})})
// router.get('/admin-categories',isAdmin,  checkUserRole(["admin"]), articalCategories)
// // router.get('/admin-articles',  (req, res)=>{res.render('Admin.Dashbord/artical', {layout : false, title : 'user', page: "user"})})
// router.get('/admin-messages', isAdmin, checkUserRole(["admin"]), AdminMessages)
// router.get('/admin-messages/message/:id', isAdmin, checkUserRole(["admin"]), readMail)
// router.get('/admin-settings', isAdmin, checkUserRole(["admin"]), (req, res)=>{res.render('Admin.Dashbord/setting', {layout : false, title : 'setting', page: "setting"})})
// router.get('/admin-withdraw', isAdmin, checkUserRole(["admin"]), (req, res)=>{res.render('Admin.Dashbord/Withdraw', {layout : false, title : 'Withdraw', page: "Withdraw"})})
export default router