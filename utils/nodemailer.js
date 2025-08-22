// import nodemailer from 'nodemailer';
// import asyncHendler from './asyncHendler';


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