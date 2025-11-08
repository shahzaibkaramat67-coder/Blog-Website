import express from 'express'
import validatorForRegistration from '../middleware/singup-validator.js'
import profileValivation from '../middleware/profile.validation.js'
import articalValidation from '../middleware/artical.validations.js'
import loginValidationRules from '../middleware/login.middleware.js'
import { createORUpdateProfile } from '../controller/userController/profile.controller.js'
import {getProfileForUpdate} from '../controller/userController/profile.controller.js'
// import {ProfileUpdate} from '../controller/userController/profile.controller.js'
import forgetPasswordValidation from '../middleware/forgetPassword.js'
import verifijwt from '../middleware/auth.middleware.js'
import {
  submitSingupData,
  submitLoginData,
  submitForgetPassword,
  updatePassword,
  logOut
} from '../controller/userController/user.controller.js'
import {
  articalUpload,
  getArticales,
categoryShareToArtical,
getSearchAndRandomArticals,
  getArticalesById,
  like,
  viewControl,
  shareArtical,
  profile_Image
} from '../controller/userController/artical.controller.js'
import contactValidator from '../middleware/contact.validation.js'
import contactController from '../controller/userController/contact.controller.js'
import {allPostedBlogs} from "../controller/userController/user.Dashbord/Dashbord.Controller.js"
// import {categoryShareToArtical} from '../controller/userController/artical.controller.js'
import {categoryHendler} from '../controller/userController/category.controller.js'
// import {getTopicBlog} from '../controller/userController/category.controller.js'
// import {commentHendeler} from '../controller/userController/comment.controller.js'
import {commentHendeler, getArticalComment, deleteComment} from '../controller/userController/comment.controller.js'
import passport from 'passport'
import '../auth/google-Strategy.js'
import upload from '../middleware/multer.middleware.js'
import updatePasswordValidation from '../middleware/updatePassword.js'
import sendOtpMail from '../controller/userController/otp.controller.js'
// import { getProfileUserDarta } from '../controller/userController/profile.controller.js'
import verifiOtp from "../middleware/otp.varification.js"
import { title } from 'process'
import {postInTable} from "../controller/userController/user.Dashbord/post.controller.js"
import { profile } from 'console'
// import { title } from 'process'
// import { profile } from 'console'
// import ApiError from '../utils/ApiError.js'
// import { Profile } from '../models/profile.model.js'
// import ApiResponse from '../utils/ApiResponse.js'


const router = express.Router()


// singup user with register 

router.get('/auth/google',
  passport.authenticate(
    'google',
    { scope: ['profile', 'email'] }
  ));
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const { user, access_Token, refresh_Token } = req.user

    const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",   // strict breaks OAuth redirects
      maxAge: 7 * 24 * 60 * 60 * 1000
    }

    res.cookie("refreshToken", refresh_Token, option)
    res.cookie("accessToken", access_Token, option)
    return res.redirect('/profile/edit-profile')

  }

);



router.get('/profile', verifijwt, getProfileForUpdate)
router.post('/profile', verifijwt, upload.single("profile_Image"), profileValivation, createORUpdateProfile)
router.get('/profile/postsAnalytics', (req, res) => { res.render('postsAnalytics', {layout : false, title: "postsAnalytics" }) })
router.get('/profile/postsAnalytics/Artical', (req, res) => { res.render('Artical', {layout : false, title: "Artical" }) })
router.get('/profile/Dashbord/EarningPage', (req, res) => { res.render('Dashbord/EarningPage', {layout : false, title: 'Earning-Page' }) })
router.get('/profile/Dashbord/my-Dashboard', allPostedBlogs)
// router.get('/profile/Dashbord/my-Dashboard', likedBlogs)
router.get('/profile/Dashbord/Withdraw', (req, res) => { res.render('Dashbord/Withdraw', {layout : false, title: 'Withdraw-Page' }) })
router.get('/profile/Dashbord/postsAnalytics',postInTable)
router.get('/profile/Dashbord/craete-Artical', categoryShareToArtical)
router.post('/profile/Dashbord/craete-Artical/upload-blog', verifijwt, upload.single("featured_image"), articalValidation, articalUpload)


//  there are Singup , Login , forgetPassport , Logout logics
router.get('/singup', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/login")
  }else{

    res.render('singup', {layout : false, title: "singup" })
  }
  
})
router.post('/submit-singup', validatorForRegistration, submitSingupData)
router.get('/otp', (req, res) => {
  const Email = req.query.Email
  //     const Email =  req.body.Email
  if (!Email) {
    return res.status(400).send('Email is required')
  } else {
    res.render('otp', {layout : false, title: "otpPage", Email })
  }
})
router.post('/otp-submit', verifiOtp)
router.get("/login", (req, res) => { res.render('login', {layout : false, title: "login" }) })
router.get("/logOut", logOut)
router.post('/submit-login', loginValidationRules, submitLoginData)
router.get("/forgetPassword", (req, res) => { res.render("forgetPassword", {layout : false, title: "forgetPassword" }) })
router.post("/submit-forgetPassword", forgetPasswordValidation, submitForgetPassword)
router.get('otp', (req, res) => {
  
})
router.get("/updatePassword/:token", (req, res) => { res.render("updatePassword", {layout : false, title: "updatePassword", token: req.params.token }) })
router.post("/submit-updatePassword", updatePasswordValidation, updatePassword)


// home mavbar icons router 
// router.get("/home",(req, res) => {res.render("home", { title: "home" })})


router.get("/home",verifijwt, (req, res) => { res.render("home", { title: "home"}) })
// router.get("/Profile", (req, res) => { res.render("Profile", { title: "Profile"}) })
router.get("/about",verifijwt, (req, res) => { res.render("about", { title: "about" }) })

// blog roytes
router.get("/blog", getSearchAndRandomArticals)
// router.post("/blog/blog-contant/:id", getArticalesById)

router.get("/topics/:slug",verifijwt, getArticales)
router.get(
  "/blog/blog-contant/:id",
  verifijwt,
  viewControl,
  getArticalesById,
  getArticalComment,
  profile_Image,
  (req, res) => {
    res.render("blog-contant", {
      title: "blog-contant",
      artical: req.artical,
      comments: req.comments,
      profile: req.profile?.profile_Image,
      username: req.profile?.username,
    });
  }
);


// router.get("/blog/blog-contant/:id",verifijwt, )
router.post('/blog/blog-contant/submit-comment',verifijwt, commentHendeler)
router.post('/blog/blog-contant/delete-comment/:id',verifijwt, deleteComment)
router.post("/blog/blog-contant/like/:articalId", like)
router.post("/blog/share/update", shareArtical);





router.get("/Categorie", categoryHendler)
router.get("/contact",verifijwt, (req, res) => { res.render("contact", { title: "contact" }) })
router.post("/contact/contact-form-submit", verifijwt, contactValidator, contactController)










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