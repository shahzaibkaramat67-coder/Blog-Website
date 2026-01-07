import express from "express"
const app = express();
// import  CategoryRouter  from "./routes/host.routes.js";
import hostRouter from "./routes/host.routes.js";
import userRouter from "./routes/user.routes.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import jwt from "jsonwebtoken";
import User from "./models/Signup.model.js";
import ApiError from "./utils/ApiError.js";
import expressEjsLayouts from "express-ejs-layouts";
import Categorie from "./models/categorie.model.js";
import flash from "connect-flash"
import isAdmin from "./middleware/checkUserForAdmin.js";
import checkUserRole from "./middleware/checkRole.js"

// import .env from './'




app.use(session({
  secret: process.env.SESSION_ID,
  resave: false,
  saveUninitialized: false, // better for production
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL, //  MongoDB connection 
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60 // session expiration in seconds 
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // only HTTPS in production
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 14 days
  },
    rolling: true
}));

app.use(passport.initialize())
app.use(passport.session())




app.use(flash())
app.set("view engine", "ejs");
app.use(expressEjsLayouts)
app.set("layout", "layout")

app.use(cookieParser())
app.use((req, res,next)=>{
   res.locals.scripts = "";
   next()
})

app.use((req, res, next)=>{
   res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
  next()
})


app.use(async (req, res, next) => {
  try {
    const Token = req.cookies?.accessToken;
    
    if (Token) {
      const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken.id).select("-password -refreshToken");
      if (user) {
           //  Block unverified users from being treated as logged-in
        if (!user.emailVerified || !user.isValid) {
          req.user = null;
          res.locals.currentUser = null;
          return next();
        }
        req.user = user;                  //  full user object
        res.locals.currentUser = user;    //  EJS can access `currentUser`
      } else {
         req.user = null;                       
         res.locals.currentUser = null;          
                                                      
      }
    } else {
      req.user = null;
      res.locals.currentUser = null;
    }
    
  } catch (error) {
    req.user = null;                                   
    res.locals.currentUser = null;                      
  }                                                       
  next();
});

// app.use(async (req, res, next) => {
//   try {
//     const Token = req.cookies?.accessToken;
    
//     if (Token) {
//       const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);

//       const user = await User.findById(decodedToken.id).select("-password -refreshToken");
//       if (user) {
//         req.user = user;                  //  full user object
//         res.locals.currentUser = user;    //  EJS can access `currentUser`
//       } else {
//          req.user = null;                        // res.clearCookie("accessToken");
//          res.locals.currentUser = null;          // res.clearCookie("accessToken");
//                                                       // return res.redirect("/login"); 
//       }
//     } else {
//       req.user = null;
//       res.locals.currentUser = null;
//     }
//   } catch (error) {
//     req.user = null;                                    // res.clearCookie("accessToken");
//     res.locals.currentUser = null;                       // res.clearCookie("accessToken");
//   }                                                       // return res.redirect("/login"); 
//   next();
// });


app.use(async(req, res, next)=>{
   try {
      const category = await Categorie.find()
      res.locals.category = category
      } catch (error) {
         res.locals.category = []
   }
   next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))



app.use("/", userRouter)


app.get("/", (req, res) => {
  res.redirect("/home")
})
app.use("/Api", hostRouter)


export default app;

