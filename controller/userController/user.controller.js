import asyncHandler from '../../utils/asyncHandler.js'
import { validationResult } from 'express-validator';
import ApiError from '../../utils/ApiError.js'
import ApiResponse from '../../utils/ApiResponse.js';
import User from '../../models/Signup.model.js'
import crypto, { createHash } from 'crypto'
import sendMail from '../../utils/nodemailer.js'
import { strict } from 'assert';
import flash from "connect-flash"
import { Profile } from '../../models/profile.model.js';
import ms from 'ms';
import { title } from 'process';
// import sendmail from '../../utils/nodemailer.js';



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { refreshToken, accessToken }

    } catch (error) {
        throw new ApiError('something is wrong while generating refresh and access token', 500)
    }

}







/*****======== Section singup Form Hendler Start ==========*****/

const submitSingupData = asyncHandler(async (req, res) => {
    const { Username, Email, password, confirmPassword, role } = req.body;

    if ([Username, Email, password].some((field => !field))) {
        req.flash("error", "All fields are required!");
        return res.redirect("/singup");
    }

    if (password !== confirmPassword) {
        req.flash("error", "Password should be matched");
        return res.redirect("/singup");
    }


    const reasult = validationResult(req)

    if (!reasult.isEmpty()) {
        reasult.array().forEach(err => req.flash("error", err.msg))
        return res.redirect("/singup");
    }

    const userExisted = await User.findOne({ Email });
    if (userExisted) {
        req.flash("error", "User already exists with that Email");
        return res.redirect("/singup");
    }


    // continue with creating the user


    const userSingup = await User.create({
        Username,
        Email,
        password,
        role: "user"
    })

    const otpCode = await userSingup.generateOtpCode()
    await userSingup.save({ validateBeforeSave: false });



    try {
        await sendMail({
            to: userSingup.Email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otpCode}. It will expire in 5 minutes.`,
            html: `<p>Your OTP code is <b>${otpCode}</b>. It will expire in 5 minutes.</p>`,
        });
    } catch (err) {
        console.error("Failed to send OTP email:", err.message);
        // optional: log in DB or flag user

    }
    req.session.Email = userSingup.Email;
    // req.flash("success", "Signup successful! OTP sent to your email.");
    return res.redirect('/otp');



})

const submitLoginData = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body

    if (!identifier || !password) {
        req.flash("error", "Both username/email and password are required.");
        return res.redirect("/login");
    }


    const reasult = validationResult(req)
    if (!reasult.isEmpty()) {
        reasult.array().forEach(err => req.flash("error", err.msg))
        return res.redirect("/login");
    }


    const normalizeIdentifier = identifier.trim().toLowerCase();
    const isEmail = normalizeIdentifier.includes('@');

    const existedUser = !isEmail

        ? await User.findOne({ Username: normalizeIdentifier })
        : await User.findOne({ Email: normalizeIdentifier })

    if (!existedUser) {
        req.flash("error", "Invalid Username or Email");
        return res.redirect('/login');

    }


    const isPasswordCorrect = await existedUser.isCorrectPassword(password)
    if (!isPasswordCorrect) {
        req.flash("error", " Input data is incorrect");
        return res.redirect('/login');
    }


    // Check email verification before login
    if (!existedUser.isValid || !existedUser.emailVerified) {
        req.flash("error", "Please verify your email before logging in.");
        return res.redirect("/login");
    }

    existedUser.lastLoginAt = new Date();
    await existedUser.save({validateBeforeSave : false});
    //   userExist.lastLoginAt = new Date();

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(existedUser._id)
    const loginUser = await User.findById(existedUser._id).select("-refreshToken -password")


    const accessTokenOption = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY)
    }
    const refreshTokenOption = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY)
    }


    res.cookie("accessToken", accessToken, accessTokenOption)
    res.cookie("refreshToken", refreshToken, refreshTokenOption)

    req.flash("success", "login successfully");
    return res.redirect("/profile")


})


const forgetPassword = asyncHandler(async (req, res) => {
    res.render("forgetPassword", { layout: false, title: "forgetPassword" })
})

const submitForgetPassword = asyncHandler(async (req, res) => {

    const { identifier } = req.body
    if (!identifier) {
        req.flash("error", "Input Email or Username")
        return res.redirect("forgetPassword")
    }

    const result = validationResult(req)
    if (!result.isEmpty()) {
        result.array().forEach(err => req.flash("error", err.msg))
        return res.redirect("forgetPassword")
    }

    const normalizeIdentifier = identifier.trim().toLowerCase();
    const isEmail = normalizeIdentifier.includes('@');

    const user = !isEmail

        ? await User.findOne({ Username: normalizeIdentifier })
        : await User.findOne({ Email: normalizeIdentifier })


    if (!user) {
        req.flash("error", "User not exist with this Email or Username")
        return res.redirect("forgetPassword")

    }
    const resetPasswordToken = await user.generateResetPasswordToken()
    await user.save({ validateBeforeSave: false })
    const resetUrl = `${req.protocol}://${req.get("host")}/updatePassword/${resetPasswordToken}`;

    try {
        await sendMail({
            to: user.Email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>
            <p>This link will expire in ${process.env.RESET_PASSWORD_EXPIRY}.</p>`
        });
        req.flash("success", "Password reset link sent to your email");
        return res.redirect("forgetPassword");
    } catch (err) {
        console.error("Failed to send OTP email:", err.message);
        user.resetPasswordToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false })
        req.flash("error", "Failed to send email. Try again later.");
        return res.redirect("/forgot-password");

        // optional: log in DB or flag user
    }
})


const updatePassword = asyncHandler(async (req, res) => {
    const token = req.params.token || req.body.token;
    if (!token) {
        req.flash("error", "Please verify your email before reset Password.");
        return res.redirect("forgot-password");


    }
    const { newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
        req.flash("error", "Passwords do not match.");
        return res.redirect(`/updatePassword/${token}`);
    }


    const hashedToken = crypto.createHash("sha256").update(token).digest('hex')



    const userExist = await User.findOne({
        resetPasswordToken: hashedToken,
        resetTokenExpiry: { $gt: Date.now() }
    })

    if (!userExist) {
        req.flash("error", "Please verify your email before reset Password.");
        return res.redirect("forgot-password");

    }

        userExist.password = newPassword;
        userExist.resetPasswordToken = undefined;
        userExist.resetTokenExpiry = undefined;
        // await userExist.save({ validateBeforeSave: false })


         userExist.lastLoginAt = new Date();

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExist._id)
    //  userExist.refreshToken = refreshToken;
     await userExist.save({validateBeforeSave : false})

    const userUpdated = await User.findById(userExist._id).select("-password -refreshToken")
    const accessTokenOption = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY),
        sameSite: 'strict'
    }
    const refreshTokenOption = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY),
        sameSite: 'strict'
    }

    res.cookie("accessToken", accessToken, accessTokenOption)
    res.cookie("refreshToken", refreshToken, refreshTokenOption)

    return res.render("home", { title: "home" })
})

const googlecontroller = asyncHandler(async (req, res) => {
      
    const { user, access_Token, refresh_Token } = req.user;

    const accessTokenOption = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY),
    };
    const refreshTokenOption = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY),
    };

    res.cookie("accessToken", access_Token, accessTokenOption)
    res.cookie("refreshToken", refresh_Token, refreshTokenOption)


    const profile = await Profile.findOne({ User: req.user._id })
    if (profile) {
        return res.render("profile", { title: "profile", profile });
    } else {
        return res.render("edit-profile", { layout: false, title: "edit-profile", profile });
    }
    //  return res.render("/edit-profile", { layout : false, title: "Edit Profile", profile });

})


const logOut = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // secure only in prod
        sameSite: "strict"
    });

    res.redirect("/home");
});





export {
    submitSingupData,
    submitLoginData,
    forgetPassword,
    submitForgetPassword,
    updatePassword,
    logOut,
    googlecontroller
}
/*****======== Section singup Form Hendler End  ==========*****/