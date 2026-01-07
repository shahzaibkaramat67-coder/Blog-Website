import express from 'express'
// import {Categorys} from '../controller/hostController/host.controller.js'
import {AdminMessages, readMail} from '../controller/hostController/admin-contact.controller.js'
import {articalCategories} from "../controller/hostController/Categories.controller.js"
import {userInfo, userGraph} from "../controller/hostController/user.controller.js"
import {dashboardController, getChartData } from '../controller/hostController/Admin-Dashbord.controller.js'
import {adminLogin} from "../controller/hostController/admin-login.controller.js"
import RPMController from '../controller/hostController/RPM.Controller.js'
import {getAddCaategoryPage, groutRpm, addCategory} from '../controller/hostController/addToCategory.Controller.js'
// import verifijwt from '../middleware/AdminVerifi.js'
// import isAdmin from '../middleware/checkUserForAdmin.js'
// import checkUserRole from '../middleware/checkRole.js'
// import checkUserRole from "../middleware/checkRole.js"
const router = express.Router()


router.get('/login', (req, res)=>{
    return res.render("login", {layout : false, title : "Admin login", isAdmin : true});
})
router.post('/submit-login', adminLogin)
router.get('/admin-dashboard',dashboardController)
router.get('/admin-dashboard/chart-data', getChartData)

// router.get('/admin-dashboard/chart-data', dashboardChartDataController)
// /admin-dashboard/chart-data?days
router.get('/admin-users', userInfo)
router.get('/admin-users/Chart-data', userGraph)
router.get('/admin-earning', (req, res)=>{res.render('Admin.Dashbord/earning', {layout : false, title : 'earning', page: "earning"})})
router.get('/admin-categories', articalCategories)
// router.get('/admin-articles',  (req, res)=>{res.render('Admin.Dashbord/artical', {layout : false, title : 'user', page: "user"})})
router.get('/admin-messages', AdminMessages)
router.get('/admin-messages/message/:id', readMail)
router.get('/admin-settings',  (req, res)=>{res.render('Admin.Dashbord/setting', {layout : false, title : 'setting', page: "setting"})})
router.get('/admin-withdraw', (req, res)=>{res.render('Admin.Dashbord/Withdraw', {layout : false, title : 'Withdraw', page: "Withdraw"})})
router.get('/admin-RPM', (req, res)=>{res.render('Admin.Dashbord/RPM', {layout : false, title : 'price', page: "RPM Price"})})
router.post('/admin-RPM/submit', RPMController)
router.get('/admin-categoryadd',groutRpm,getAddCaategoryPage)
router.post('/admin-categoryadd/submit',groutRpm,addCategory)
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