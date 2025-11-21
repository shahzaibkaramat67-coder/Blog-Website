import User from "../../models/Signup.model.js"
import ApiError from "../../utils/ApiError.js"
import asyncHandler from "../../utils/asyncHandler.js"
import crypto from "crypto";

const OTP = asyncHandler(async (req, res) => {
    res.render("otp", { layout: false, title: "OTP Page" });
});

const otpVerify = asyncHandler(async (req, res) => {
    const otp = req.body.otp;
    const Email = req.user.Email;

    if (!otp || !Email) {
        throw new ApiError("OTP or Email not found", 404);
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
console.log("otpFound", otpFound);

    if (!otpFound) {
        throw new ApiError("OTP is expired or invalid", 400);
    }

    otpFound.isValid = true;
    otpFound.otpCode = undefined;
    otpFound.otpExpiry = undefined;

    await otpFound.save({ validateBeforeSave: false });

    const acceptHeader = req.headers.accept || "";

    if (acceptHeader.includes("text/html")) {
        return res.redirect("/login");
    }

    res.status(200).json({ success: true, message: "OTP verified" });
});

export { OTP, otpVerify };
