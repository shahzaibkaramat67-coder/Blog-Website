
import { validationResult } from "express-validator";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendMail from "../../utils/nodemailer.js";
// import { ContactMessage } from "../../constant.js";
import ContactMessage from "../../models/mail.model.js";
import User from "../../models/Signup.model.js";
import ApiResponse from "../../utils/ApiResponse.js";


const contactController = asyncHandler(async (req, res) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    console.log("validations  error are ", result.array());
    const errorMessage = result.array().map(error => ({
      field: error.param,
      msg: error.msg
    }));

    throw new ApiError("the validation failed", errorMessage, 400);
  }

  const { name, email, subject, message } = req.body;
  const ipAddress = req.ip;

  const saveMassage = await ContactMessage.create({
    name,
    email,
    subject,
    message,
    ipAddress
  })

  console.log("saveMassage", saveMassage);

  // await saveMassage.save()


  await sendMail({
    to: process.env.EMAIL_USER, // admin
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p>${message}</p>`
  });



  // await sendMail({
  //   to: process.env.EMAIL_USER,
  //   subject: `New contact message from ${name}`,
  //   text: `
  //          Name: ${name}
  //          Email: ${email}
  //          Subject: ${subject}
  //          Message: ${message}
  // `
  // });




  return res
    .status(200)
    .json({
      name,
      email,
      subject,
      message
    })

});


const sendOtpMail = asyncHandler(async (req, res) => {
  const { Email } = req.body;
  if (!Email) {
    throw new ApiError("the Email not found", 404);
  }

  let account = await User.findOne({ Email })

  if (!account) {
    throw new ApiError("Account not found", 404);
  }


  const otpCode = await account.generateOtpCode();
  console.log("otpCode", otpCode);

  await account.save({ validateBeforeSave: false })

  await sendMail({
    to: account.Email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otpCode}.`,
    html: `<p>Your OTP is <b>${otpCode}</b>.</p>`
  });


  return res
    .status(200)
    .json(
      new ApiResponse('the otp send successfull', 200, { Email: account.Email })
    )


})




// const otpverify = as

export {
  sendOtpMail,
  contactController
}