import nodemailer from 'nodemailer';
// import asyncHendler from '../utils/asyncHandler.js';


const sendmail = async({Email, otp})=>{
    const transporter = nodemailer.createTransport({
        host : "smtp.gmail.com",
        port: 465,
        secure : true,
        auth :{
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
      from : `your Email <${process.env.EMAIL_USER}>`,
      to : Email,
      subject : 'your Otp is',
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`

    })
}
export default sendmail






























// import nodemailer from 'nodemailer';

// import asyncHendler from './asyncHendler';


// const craeteMail = asyncHendler(async(req, res)=>{
//     const transporter = nodemailer.createTransport({
//         host : "smtp.gmail.com",
//         port : 567,
//         secure : true,
//         auth :{
//             user : process.env.host,
//             pass : process.env.pass
//         }
//     })

//     const info = transporter.sendMail({
//         from : process.env.Email,
//         to : "",
//         subject : 'Here is your message',
//         text : 'this is your messsage',
       
// //    html :" <h1>this is your message</h1>"    OR   text : 'this is your messsage',


//     })
// })

// export default craeteMail































































// const sendmail = asyncHendler(async (req, res) => {
//     const transporter = nodemailer.createTransport({
//         host: "smpt.gmail.com",
//         post: 587,
//         secure: false,
//         auth: {
//             user: "Shahzaib@gmail.com",
//             pass: "Shah1234!@#$"
//         }
//     })


//     const info = transporter.sendMail({
//         from: "Shahzaib@gmail.com",
//         to: "",
//         subject: "this is text mail",
//         text: "here is your massage",
//         html : "<h1>hi i am shahzaib</h1>"
//     })

// })

// export default sendmail