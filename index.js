import express from "express"
const app = express();
// import  CategoryRouter  from "./routes/host.routes.js";
import hostRouter from "./routes/host.routes.js";
import userRouter from "./routes/user.routes.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import User from "./models/Signup.model.js";
import ApiError from "./utils/ApiError.js";

// import .env from './'




app.use(session({
   secret: "shahzaib1234",
   resave: false,
   saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())





app.set("view engine", "ejs");

app.use(cookieParser())
app.use(async(req, res, next) => {
   try {
      const Token = req.cookies?.accessToken;
      if (Token) {
        const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);


         const user = await User.findById(decodedToken._id).select("role")
         if (user) {
            req.user = { role: user.role };
            res.locals.currentUser = req.user
         } else {
            req.user = null
            res.locals.currentUser = null
         }

      } else {

         throw new ApiError("no Token recive ", 404);
         
         // req.user = null
         // res.locals.currentUser = null
      }

   } catch (error) {    
      req.user = null
      res.locals.currentUser = null

   }
   next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))




app.use("/api/user/", userRouter)
// app.use("/api/host/",hostRouter)

app.get("/", (req, res) => {
   res.redirect("api/user/home")
})

app.use('/api/categorys', hostRouter)



// app.get("/Dashbord", (req, res)=>{
//    res.redirect("api/host/Dashbord")
// })
export default app;

