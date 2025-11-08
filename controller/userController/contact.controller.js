
import {validationResult}  from "express-validator";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendMail from "../../utils/nodemailer.js";


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

  await sendMail({
    name: `the user name : ${name}`,
    email: `the user name : ${email}`,
    subject: `the user name : ${subject}`,
    message: `the user name : ${message}`

  })

  return res
    .status(200)
    .json({
      name,
      email,
      subject,
      message
    })

});


export default contactController;