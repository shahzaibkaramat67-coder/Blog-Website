import express from 'express'
// import seesionValidation from '../middleware/Session.js'
import validatorForRegistration from '../middleware/singup-validator.js'
import {loginValidationRules} from '../middleware/login.middleware.js'
import {
      // login,
      // singupUser, 
      submitSingupData, 
      submitLoginData,
      artherProfile
} from '../controller/user.controller.js'
import passport from 'passport'
import '../auth/google-Strategy.js'

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
router.get('/profile',(req, res)=>{res.render('Profile', { title: "Profile" })})
router.get('/profile/edit-profile',(req, res)=>{res.render('edit-profile', { title: "edit-profile" })})
router.post('/profile/profile-save',artherProfile,(req, res)=>{res.json(req.body)})
router.get('/profile/Artical',(req, res)=>{res.render('Artical', { title: "Artical" })})



router.get('/singup',(req, res)=>{res.render('singup', { title: "singup" })})
router.post('/submit-singup' ,validatorForRegistration, submitSingupData)






//  user with login 
router.get("/login",(req, res) => { res.render('login', { title: "login" })})
router.post('/submit-login',loginValidationRules, submitLoginData)

//  user with login by forget password 
router.get("/forgetPassword",(req, res) => { res.render("forgetPassword", { title: "forgetPassword" })})


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



// router.get('/contact', )
// router.post('/submit-login',loginValidationRules, submitLoginData)


export default router