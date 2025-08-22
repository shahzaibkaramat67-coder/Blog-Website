import express from "express"
const app = express();
// import  CategoryRouter  from "./routes/host.routes.js";
import hostRouter from "./routes/host.routes.js";
import userRouter from "./routes/user.routes.js";
import session from "express-session";
import passport from "passport";

app.use(session({
   secret : "shahzaib1234",
   resave : false,
   saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.set("view engine", "ejs");


app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static('public'))



app.use("/api/user/",userRouter)
app.use("/api/host/",hostRouter)

app.get("/", (req, res)=>{
   res.redirect("api/user/home")
})

app.use('/api/categorys', hostRouter)



// app.get("/Dashbord", (req, res)=>{
//    res.redirect("api/host/Dashbord")
// })
export default app;

