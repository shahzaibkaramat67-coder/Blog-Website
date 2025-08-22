import express from 'express'
import {Categorys} from '../controller/host.controller.js'
const router = express.Router()

router.get('/seed', Categorys)


// router.get('/Dashbord/:role/:page', (req, res)=>{

//     const {role, page} = req.params 
//     res.render('Dashbord', {page : `partial/${role}/${page}`})
// })


// there are for host router sidebar
// router.get('/Dashbord/', (req, res)=>{res.render('Dashbord', {title : 'Dashbord', page: "Dashbord"})})
// router.get('/Dashbord/appDetailUploadPage', (req, res)=>{res.render('admin/appDetailUploadPage', {title : 'appDetailUploadPage'})})
// router.get('/Dashbord/blogFileUpload', (req, res)=>{res.render('admin/blogFileUpload', {title : 'blogFileUpload'})})

// blog upload file route
// router.get('/Dashbord/blogContentUpload', (req, res)=>{res.render('admin/blogContentUpload', {title : 'blogContentUpload'})})
// router.post('/Dashbord/blogContentUpload/upload-blog', upload.single("featured_image"),(req, res)=>{
//     console.log(req.body);
//     console.log(req.file);
    
    
// })


// router.get('/Dashbord/postsAnalytics', (req, res)=>{res.render('admin/postsAnalytics', {title : 'postAnalytics'})})
// router.get('/Dashbord/appDetailUploadPage', (req, res)=>{res.render('admin/appDetailUploadPage', {title : 'app-Detail-Upload-Page'})})
// router.get('/Dashbord/EarningPage', (req, res)=>{res.render('admin/EarningPage', {title : 'Earning-Page'})})
// router.get('/Dashbord/BlogGraph', (req, res)=>{res.render('admin/BlogGraph', {title : 'BlogGraph-Page'})})
// router.get('/Dashbord/Appgraph', (req, res)=>{res.render('admin/Appgraph', {title : 'Appgraph-Page'})})


export default router