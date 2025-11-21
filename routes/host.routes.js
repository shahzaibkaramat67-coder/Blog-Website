import express from 'express'
// import {Categorys} from '../controller/hostController/host.controller.js'
import AdminMessages from '../controller/hostController/admin-contact.controller.js'
// import checkUserRole from "../middleware/checkRole.js"
const router = express.Router()

// router.get('/seed', Categorys)


// router.get('/Dashbord/:role/:page', (req, res)=>{

//     const {role, page} = req.params 
//     res.render('Dashbord', {page : `partial/${role}/${page}`})
// })


// there are for host router sidebar
router.get('/admin-dashboard',  (req, res)=>{res.render('Admin.Dashbord/Dashbord', {layout : false, title : 'Dashbord', page: "Dashbord"})})
router.get('/admin-users',  (req, res)=>{res.render('Admin.Dashbord/artical', {layout : false, title : 'artical', page: "artical"})})
router.get('/admin-articles',  (req, res)=>{res.render('Admin.Dashbord/user', {layout : false, title : 'user', page: "user"})})
router.get('/admin-messages',  AdminMessages)
router.get('/admin-settings',  (req, res)=>{res.render('Admin.Dashbord/setting', {layout : false, title : 'setting', page: "setting"})})


export default router