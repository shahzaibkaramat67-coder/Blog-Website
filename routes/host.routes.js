import express from 'express'
// import {Categorys} from '../controller/hostController/host.controller.js'
import {AdminMessages, readMail} from '../controller/hostController/admin-contact.controller.js'
import articalCategories from "../controller/hostController/artical.controller.js"
// import checkUserRole from "../middleware/checkRole.js"
const router = express.Router()

// router.get('/seed', Categorys)


// router.get('/Dashbord/:role/:page', (req, res)=>{

//     const {role, page} = req.params 
//     res.render('Dashbord', {page : `partial/${role}/${page}`})
// })


// there are for host router sidebararticalCategories
router.get('/admin-dashboard',  (req, res)=>{res.render('Admin.Dashbord/Dashbord', {layout : false, title : 'Dashbord', page: "Dashbord"})})
router.get('/admin-users',  (req, res)=>{res.render('Admin.Dashbord/user', {layout : false, title : 'artical', page: "artical"})})
router.get('/admin-earning',  (req, res)=>{res.render('Admin.Dashbord/earning', {layout : false, title : 'earning', page: "earning"})})
router.get('/admin-categories',  articalCategories)
// router.get('/admin-articles',  (req, res)=>{res.render('Admin.Dashbord/artical', {layout : false, title : 'user', page: "user"})})
router.get('/admin-messages',  AdminMessages)
router.get('/admin-messages/message/:id',  readMail)
router.get('/admin-settings',  (req, res)=>{res.render('Admin.Dashbord/setting', {layout : false, title : 'setting', page: "setting"})})
router.get('/admin-Withdraw',  (req, res)=>{res.render('Admin.Dashbord/Withdraw', {layout : false, title : 'Withdraw', page: "Withdraw"})})


export default router