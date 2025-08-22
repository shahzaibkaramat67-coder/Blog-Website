import asyncHendler from '../utils/asyncHendler.js'
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js';
import User from '../models/Singup.model.js'
// import passport from 'passport';
import { Profile } from '../models/profile.model.js';

// get request routes 
// const singupUser = asyncHendler(async (req, res) => {
//     res.render('singup', { tital: "singup" })
// })
// const login = asyncHendler(async (req, res) => {
//     res.render('login', { tital: "login" })
// })


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

const submitSingupData = asyncHendler(async (req, res) => {
    const { firstName, lastName, gmail, password, confirmPassword } = req.body;

    if ([firstName, lastName, gmail, password, confirmPassword].some((field => !field))) {
        throw new ApiError('All input fields are required', 400)
    }
    const reasult = validationResult(req)

    if (!reasult.isEmpty()) {
        // console.log(reasult.array());

        const errorMessage = reasult.array().map(error => ({
            field: error.param,
            meg: error.msg
        }))

        throw new ApiError("validation is failed", 400, errorMessage);

    }

    const userExisted = await User.findOne({
        $or: [{ firstName }, { gmail }]
    })

    if (userExisted) {
        throw new ApiError('User with this firstName and gmail allready existed', 400)
    }


    if (password !== confirmPassword) {
        throw new ApiError("passwords not match", 400);

    }

    const userSingup = await User.create({
        firstName,
        lastName,
        gmail,
        password,
    })

    return res
        .status(201)
        .json(
            new ApiResponse('The User is Succcessfully Singup', 200, userSingup)
        )

})

const submitLoginData = asyncHendler(async (req, res) => {
    const { firstName, gmail, password } = req.body

    if (!(firstName || gmail)) {
        throw new ApiError('username or gmail is required', 400)
    }

    const reasult = validationResult(req)
    if (!reasult.isEmpty()) {
        // throw new ApiError('validation failed', 400)
        const errorMessage = reasult.array().map(error => ({
            field: error.param,
            msg: error.msg
        }))

        throw new ApiError("validation failed", errorMessage);
    }




    const existedUser = await User.findOne({
        $or: [{ firstName }, { gmail }]
    })

    if (!existedUser) {
        throw new ApiError('username or gmail not exist ', 404)
    }





    const isPasswordCorrect = await existedUser.isCorrectPassword(password)
    if (!isPasswordCorrect) {
        throw new ApiError('password is not corresct', 400)
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(existedUser._id)
    const loginUser = await User.findById(existedUser._id).select("-refreshToken -password")

    const option = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    existedUser: loginUser, refreshToken, accessToken
                }, 'login successfull'
            )
        )


})

const artherProfile = asyncHendler(async(req, res)=>{
    const {full_name,username,about,email,phone,location,website,socials,category} = req.body
     const {profile_image} = req.file

     const prodile = await Profile.craeteOne({
        full_name,
        username,
        about,
        email,
        phone,
        location,
        website : website,
        socials : socials,
        category,
        profile_image 
     })

     res.status(201)
     throw new ApiResponse("prodile data add successfull", 200, prodile);
     
})

export {
    // singupUser,
    // login,
    submitSingupData,
    submitLoginData,
    artherProfile

}
/*****======== Section singup Form Hendler End  ==========*****/