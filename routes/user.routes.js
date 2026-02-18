import express from 'express'
import validatorForRegistration from '../middleware/singup-validator.js'
import profileValivation from '../middleware/profile.validation.js'
import articalValidation from '../middleware/artical.validations.js'
import loginValidationRules from '../middleware/login.middleware.js'
import { createORUpdateProfile } from '../controller/userController/profile.controller.js'
import { getProfileForUpdate } from '../controller/userController/profile.controller.js'
// import {ProfileUpdate} from '../controller/userController/profile.controller.js'
import forgetPasswordValidation from '../middleware/forgetPassword.js'
import verifijwt from '../middleware/auth.middleware.js'
import {
  submitSingupData,
  submitLoginData,
  forgetPassword,
  submitForgetPassword,
  updatePassword,
  logOut,
  googlecontroller
} from '../controller/userController/user.controller.js'
import {
  articalUpload,
  getArticales,
  categoryShareToArtical,
  getSearchAndRandomArticals,
 
} from '../controller/userController/artical.controller.js'
import { viewControl } from '../controller/userController/view.Controller.js'
import { likeArtical } from '../controller/userController/like.Controller.js'
import { shareArtical, profile_Image } from '../controller/userController/share.Controller.js'
import userEarning from '../controller/userController/user.Dashbord/Earning.Controller.js'
import contactValidator from '../middleware/contact.validation.js'
import { contactController } from '../controller/userController/contact.controller.js'
import { OTP, otpVerify } from '../controller/userController/otp.controller.js'
import { userDashboard, getDashbordChartData } from "../controller/userController/user.Dashbord/Dashbord.Controller.js"
// import {categoryShareToArtical} from '../controller/userController/artical.controller.js'
import { categoryHendler } from '../controller/userController/category.controller.js'
// import {getTopicBlog} from '../controller/userController/category.controller.js'
// import {commentHendeler} from '../controller/userController/comment.controller.js'
import {getArticalComment, commentHendeler, deleteComment } from '../controller/userController/comment.controller.js'
import passport from 'passport'
import '../auth/google-Strategy.js'
import upload from '../middleware/multer.middleware.js'
import updatePasswordValidation from '../middleware/updatePassword.js'
// import sendOtpMail from '../controller/userController/otp.controller.js'
// import { getProfileUserDarta } from '../controller/userController/profile.controller.js'
// import verifiOtp from "../middleware/otp.varification.js"
import { title } from 'process'
import { postInTable, chart } from "../controller/userController/user.Dashbord/postAnalysist.controller.js"
import { Profile } from '../models/profile.model.js'
import isAdmin from '../middleware/checkUserForAdmin.js'
import withdrawController from '../controller/userController/user.Dashbord/withdraw.Controller.js'
import {updateController, updateView} from "../controller/userController/update.controller.js"
import { moderationMiddleware } from '../middleware/moderationMiddleware.js'
import { deleteArticle, updateArticle } from '../controller/userController/user.Dashbord/delete&Update.Controller.js'
// import { profile } from 'console'
// import { title } from 'process'
// import { profile } from 'console'
// import ApiError from '../utils/ApiError.js'
// import { Profile } from '../models/profile.model.js'
// import ApiResponse from '../utils/ApiResponse.js'


const router = express.Router()


// singup user with register 

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/auth/google/callback',passport.authenticate('google'), googlecontroller);



router.get('/profile', verifijwt, getProfileForUpdate)
router.post('/edit-profile',verifijwt, (req, res)=>{res.render('edit-profile', {layout : false, title: 'edit-profile'})})
router.post('/profile', verifijwt, upload.single("profile_Image"), profileValivation, createORUpdateProfile)
// router.get('/profile/postsAnalytics', (req, res) => { res.render('postsAnalytics', {layout : false, title: "postsAnalytics" }) })
router.get('/profile/Dashbord/postsAnalytics',verifijwt, postInTable)
router.get('/profile/Dashbord/postsAnalytics/update/:id', updateArticle)
router.delete('/profile/Dashbord/postsAnalytics/delete/:id', deleteArticle)
router.get('/profile/Dashbord/EarningPage',verifijwt,userEarning)
router.get('/profile/Dashbord/my-Dashboard', verifijwt, userDashboard)
router.get('/profile/Dashbord/my-Dashboard/data', verifijwt, getDashbordChartData)
// router.get('/profile/Dashbord/my-Dashboard', likedBlogs)
router.get('/profile/Dashbord/Withdraw',verifijwt, (req, res) => { res.render('Dashbord/Withdraw', { layout: false, title: 'Withdraw-Page' }) })
router.post('/profile/Dashbord/Withdraw/submit',verifijwt, withdrawController)
// router.get('/profile/Dashbord/postsAnalytics', postInTable);

router.get('/profile/Dashbord/postsAnalytics/:id', chart);

router.get('/profile/Dashbord/craete-Artical',verifijwt, categoryShareToArtical)
router.post('/profile/Dashbord/craete-Artical/upload-blog', verifijwt, articalValidation,upload.single("featured_image"), articalUpload)


//  there are Singup , Login , forgetPassport , Logout logicss
// router.get('/signup', (req, res) => {
//   if (req.isAuthenticated()) {
//     return res.redirect("/login");
//   }

//   res.render("signup", { layout: false, title: "Signup" });
// });
 // if (req.user) {
  //   return res.redirect("/home");
  // }

router.get('/signup', (req, res) => {res.render("signup", { layout: false, title: "Signup" })});


router.post('/submit-singup', validatorForRegistration, submitSingupData)
router.get('/otp', OTP)
// router.get('/otp', verifijwt, (req, res) => {
// router.get('/otp', verifijwt, (req, res) => {
//   const Email = req.query.Email
//   //     const Email =  req.body.Email
//   if (!Email) {
//     return res.status(400).send('Email is required')
// } else {
//     res.render('otp', {layout : false, title: "otpPage", Email })
//   }s
// })
router.post('/otp-submit', otpVerify)
router.get("/login", (req, res) => { res.render('login', { layout: false, title: "login", isAdmin: false }) })
router.get("/logOut", logOut)
router.post('/submit-login', loginValidationRules, submitLoginData)
router.get("/forgetPassword", forgetPassword)
router.post("/submit-forgetPassword", forgetPasswordValidation, submitForgetPassword)
router.get('otp', (req, res) => {

})
router.get("/updatePassword/:token", (req, res) => { res.render("updatePassword", { layout: false, title: "updatePassword", token: req.params.token }) })
router.post("/submit-updatePassword", updatePasswordValidation, updatePassword)


// home mavbar icons router 
// router.get("/home",(req, res) => {res.render("home", { title: "home" })})


router.get("/home", verifijwt, (req, res) => { res.render("home", { title: "home" }) })
// router.get("/Profile", (req, res) => { res.render("Profile", { title: "Profile"}) })
router.get("/about", verifijwt, (req, res) => { res.render("about", { title: "about" }) })

// blog roytes
router.get("/blog", getSearchAndRandomArticals)
// router.post("/blog/blog-contant/:id", getArticalesById)

router.get("/topics/:slug", verifijwt, getArticales)
router.get("/blog/blog-contant/:id",viewControl)
// router.get(
//   "/blog/blog-contant/:id",
//   verifijwt,
//   viewControl,
//   getArticalesById,
//   getArticalComment,
//   profile_Image,
//   (req, res) => {
//       res.set("Cache-Control", "no-store");
//     res.render("blog-contant", {
//       title: "blog-contant",
//       artical: req.artical,
//       comments: req.comments,
//       profile: req.profile?.profile_Image,
//       username: req.profile?.username,
//     });
//   }
// );


router.get("/blog/blog-contant/:id/comments",verifijwt, getArticalComment)
router.post('/blog/blog-contant/submit-comment',verifijwt, commentHendeler)
router.delete('/blog/blog-contant/delete-comment/:id', verifijwt, deleteComment)
router.post("/blog/blog-contant/like/:id",verifijwt, likeArtical)
router.post("/blog/share/update",verifijwt, shareArtical);



//  const blofId = "<%= articalById._id %>";

router.get("/Categorie", categoryHendler)
router.get("/contact", verifijwt, (req, res) => { res.render("contact", { title: "contact" }) })
// router.get("/my-blogs", verifijwt, (req, res) => { res.render("my-blogs", { title: "my-blogs" }) })
router.post("/contact/contact-form-submit", verifijwt, contactValidator, contactController)



// footers routes
      // Legel Routes 
router.get("/cookies", (req, res)=>{res.render("footer/Legal/CookiePolicy", {title : "CookiePolicy"})})
router.get("/privacy", (req, res)=>{res.render("footer/Legal/PrivacyPolicy", {title : "Privacy"})})
router.get("/terms", (req, res)=>{res.render("footer/Legal/Terms&Conditions", {title : "Terms & Condition"})})
      
// Support Routes 

router.get("/help", (req, res)=>{res.render("footer/Support/help", {title : "help"})})
router.get("/help/getting-started", (req, res)=>{res.render("footer/Support/help/gettingStart", {title : "getting-started"})})
router.get("/help/publishing", (req, res)=>{res.render("footer/Support/help/Publish&Content", {title : "Publish & Content"})})
router.get("/help/payments", (req, res)=>{res.render("footer/Support/help/payments", {title : "payments"})})
router.get("/faq", (req, res)=>{res.render("footer/Support/faq", {title : "FAQ"})})
// router.get("/contact", (req, res)=>{res.render("footer/Support/contact", {title : "contact"})})

// For Creator Routes 
router.get("/Dashbord", (req, res)=>{res.render("footer/ForCreator/ArticalPAge", {title : "ArticalPAge"})})
router.get("/Artical", (req, res)=>{res.render("footer/ForCreator/Dahbord", {title : "Dahbord"})})
router.get("/EarningPage", (req, res)=>{res.render("footer/ForCreator/Earnings", {title : "Earnings"})})
router.get("/Withdraw", (req, res)=>{res.render("footer/ForCreator/WithdrawFunds", {title : "WithdrawFunds"})})

// For Platform Routes 
router.get("/blogs", (req, res)=>{res.render("footer/Platform/blogInfo", {title : "blogs"})})
router.get("/categories", (req, res)=>{res.render("footer/Platform/category", {title : "category"})})
// router.get("/trending", (req, res)=>{res.render("footer/Platform/Earnings", {title : "Earnings"})})
router.get("/authors", (req, res)=>{res.render("footer/Platform/Author", {title : "Trending"})})
router.get("/trending", (req, res)=>{res.render("footer/Platform/Trending", {title : "Trending"})})
router.get("/updates",updateView,  updateController)
// router.get("/updates/view", )






/*****======== Section Blog Content Start ==========*****/
// router.get("/blog-contant", (req, res) => { res.render("blog-contant", { title: "blog-contant" }) })


/*****======== Section End  ==========*****/

/*****======== Section product app detail page Start ==========*****/
// router.get("/app-details", (req, res) => { res.render("appDetail", { title: "Detail" }) })

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