import User from "../../models/Signup.model.js"
import ApiError from "../../utils/ApiError.js"
import asyncHandler from "../../utils/asyncHandler.js"
import crypto from "crypto";



const otpVerify = asyncHandler(async (req, res) => {
console.log("this is for the otp controller");


    const otp = req.body.otp;
    const Email = req.session.Email;

    if (!otp || !Email) {
        req.flash("error", "Invalid request");
        return res.redirect("/otp");
    }

    const hashedOtp = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    const otpFound = await User.findOne({
        Email,
        otpCode: hashedOtp,
        otpExpiry: { $gte: Date.now() }
    });

    if (!otpFound) {
        req.flash("error", "Invalid or expired OTP");
        return res.redirect("/otp");
    }

    otpFound.isValid = true;
    otpFound.emailVerified = true;
    otpFound.otpCode = undefined;
    otpFound.otpExpiry = undefined;

    await otpFound.save({ validateBeforeSave: false });

    delete req.session.Email

    console.log("this is controller befor the lohin");
    req.flash("success", "OTP verified successfully! You can now login.");
    console.log("this is controller befor the massage ");
    return res.redirect("/login")
    console.log("this is controller after the massage ");


});

export { otpVerify };
