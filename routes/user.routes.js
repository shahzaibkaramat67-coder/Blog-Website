import express from 'express'
import validatorForRegistration from '../middleware/singup-validator.js'
import profileValivation from '../middleware/profile.validation.js'
import articalValidation from '../middleware/artical.validations.js'
import loginValidationRules from '../middleware/login.middleware.js'
import  createProfile from '../controller/userController/profile.controller.js' 
import forgetPasswordValidation from '../middleware/forgetPassword.js'
import verifijwt from '../middleware/auth.middleware.js'
import {
      submitSingupData, 
      submitLoginData,
      submitForgetPassword,
      updatePassword,
      logOut
} from '../controller/userController/user.controller.js'
import articalUpload from '../controller/userController/Artical.controller.js'
import passport from 'passport'
import '../auth/google-Strategy.js'
import upload from '../middleware/multer.middleware.js'
import updatePasswordValidation from '../middleware/updatePassword.js'
import sendOtpMail from '../controller/userController/otp.controller.js'
import verifiOtp from '../middleware/otp.varification.js'
import { title } from 'process'
import { profile } from 'console'
import ApiError from '../utils/ApiError.js'
import { Profile } from '../models/profile.model.js'


const router = express.Router()


// singup user with register 
router.get('/auth/google',
      passport.authenticate("google",{
            scope : ["profile", "email"]
      }
      )
)
router.get("/auth/google/callback",
      passport.authenticate("google",
            {
                  failureRedirect : "/singup",
                  successRedirect : "/home"
            }
      )
)



// user profile route
router.get('/profile',async(req, res)=>{
     try {
       const profile = await Profile.findOne({User : req.user._id})
     if (!profile) {
       throw new ApiError("profile not found", 404);
     }
       res.render('Profile', { title: "Profile" , profile})
     } catch (error) {
      console.log(error);
      throw new ApiError("Sever Error ", 500);
      
     }
})


router.get('/profile/edit-profile',(req, res)=>{res.render('edit-profile', { title: "edit-profile" })})
router.post('/profile/edit-profile/profile-save',verifijwt,upload.single("profile_Image"),profileValivation,createProfile, (req, res)=>{res.json(req.body)})
router.get('/profile/postsAnalytics',(req, res)=>{res.render('postsAnalytics', { title: "postsAnalytics" })})
router.get('/profile/postsAnalytics/Artical',(req, res)=>{res.render('Artical', { title: "Artical" })})

// router.get('/profile/Dashbord', (req, res)=>{res.render('Dashbord', {title : 'Dashbord', page: "Dashbord"})})
// router.get('/profile/Dashbord/blogFileUpload', (req, res)=>{res.render('blogFileUpload', {title : 'blogFileUpload'})})
// router.get('/profile/Dashbord/blogContentUpload', (req, res)=>{res.render('blogContentUpload', {title : 'blogContentUpload'})})
router.get('/profile/Dashbord/EarningPage', (req, res)=>{res.render('Dashbord/EarningPage', {title : 'Earning-Page'})})
router.get('/profile/Dashbord/BlogGraph', (req, res)=>{res.render('Dashbord/BlogGraph', {title : 'BlogGraph-Page'})})
router.get('/profile/Dashbord/Withdraw', (req, res)=>{res.render('Dashbord/Withdraw', {title : 'Withdraw-Page'})})
router.get('/profile/Dashbord/postsAnalytics', (req, res)=>{res.render('Dashbord/postsAnalytics', {title : 'postsAnalytics'})})
router.get('/profile/Dashbord/craete-Artical', (req, res)=>{res.render('Dashbord/Artical', {title : 'craete-Artical-Page'})})
router.post('/profile/Dashbord/craete-Artical/upload-blog',verifijwt,upload.single("featured_image"),articalValidation,articalUpload)


//  there are Singup , Login , forgetPassport , Logout logics
router.get('/singup',(req, res)=>{res.render('singup', { title: "singup" })})
router.post('/submit-singup' ,validatorForRegistration, submitSingupData) 
router.get('/otp', (req, res)=>{
    const Email =  req.query.Email
//     const Email =  req.body.Email
    if (!Email) {
      return res.status(400).send('Email is required')
    }else{
         res.render('otp', {title : "otpPage", Email})
    }})
router.post('/otp-submit', verifiOtp)
router.get("/login",(req, res) => { res.render('login', { title: "login" })})
router.get("/logOut", logOut)
router.post('/submit-login',loginValidationRules, submitLoginData)
router.get("/forgetPassword",(req, res) => { res.render("forgetPassword", { title: "forgetPassword" })})
router.post("/submit-forgetPassword",forgetPasswordValidation, submitForgetPassword)
router.get('otp', (req, res)=>{
      
})
router.get("/updatePassword/:token",(req, res) => { res.render("updatePassword", { title: "updatePassword",token : req.params.token })})
router.post("/submit-updatePassword", updatePasswordValidation,  updatePassword) 


// home mavbar icons router 
// router.get("/home",(req, res) => {res.render("home", { title: "home" })})


router.get("/home",(req, res) => {res.render("home", { title: "home" })})
router.get("/about",(req, res)=>{res.render("about", { title: "about" })})

// blog roytes
router.get("/blog",(req, res) => {res.render("blog", { title: "blog" })})
router.get("/share", (req, res)=>{})





router.get("/product",(req, res) => { res.render("product", { title: "product" })})
router.get("/contact",(req, res) => { res.render("contact", { title: "contact" })})










/*****======== Section Blog Content Start ==========*****/
router.get("/blog-contant",(req, res) => { res.render("blog-contant", { title: "blog-contant" })})


/*****======== Section End  ==========*****/

/*****======== Section product app detail page Start ==========*****/
router.get("/app-details",(req, res) => { res.render("appDetail", { title: "Detail" })})

/*****======== Section product app detail page  End  ==========*****/





// there are for host router sidebar

// router.get('/Dashbord/appDetailUploadPage', (req, res)=>{res.render('appDetailUploadPage', {title : 'appDetailUploadPage'})})

// blog upload file route
// router.post('/Dashbord/blogContentUpload/upload-blog', upload.single("featured_image"),(req, res)=>{
//     console.log(req.body);
//     console.log(req.file);
    
    
// })


// router.get('/Dashbord/postsAnalytics', (req, res)=>{res.render('postsAnalytics', {title : 'postAnalytics'})})
// router.get('/Dashbord/appDetailUploadPage', (req, res)=>{res.render('appDetailUploadPage', {title : 'app-Detail-Upload-Page'})})
// router.get('/Dashbord/Appgraph', (req, res)=>{res.render('Appgraph', {title : 'Appgraph-Page'})})



// router.get('/contact', )
// router.post('/submit-login',loginValidationRules, submitLoginData)


export default router