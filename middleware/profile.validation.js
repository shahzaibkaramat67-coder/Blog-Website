import { body } from "express-validator";
import ApiError from "../utils/ApiError.js";

const profileValivation = [
   


    body('full_name')
        .notEmpty().withMessage('first Name is required')
        .matches(/^\S*$/).withMessage("No spaces allowed")
        .trim()
        .isLength({ min: 5, max: 15 }).withMessage('min lenght should be 5 and max lenght 15')
        .isAlphanumeric().withMessage('just use number and letters'),

    body('username')
        .notEmpty().withMessage('username is required')
        .matches(/^\S*$/).withMessage("No spaces allowed")
        .trim()
        .isLength({ min: 5, max: 15 }).withMessage('min lenght should be 5 and max lenght 15')
        .isAlphanumeric().withMessage('just use number and letters'),
    body('about')
        .notEmpty().withMessage('about section  is required')
        .matches(/^[A-Za-z ,.?'""!]+$/).withMessage("just use number, letters ")
        .trim()
        .isLength({ min: 5, max: 500 }).withMessage('min lenght should be 5 and max lenght 500'),

    body('email')
        .notEmpty().withMessage('gmail is required')
        .matches(/^\S*$/).withMessage("No spaces allowed")
        .trim().normalizeEmail()
        .isEmail().withMessage('please input gmail according to the standered formate')
         .custom(value => {
            if (!value.endsWith("@gmail.com")) {
                throw new ApiError("Only Gmail addresses are allowed", 400);
            }

            return true
        }),
       
    body('phone')
        .matches(/^\S*$/).withMessage("No spaces allowed")
        .trim()
        .optional({ checkFalsy: true })
        .isMobilePhone("any")
        .withMessage("please enter valid phone number"),

    body('location')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 100 }).withMessage('min lenght should be less then 100'),
    body('website')
        .optional({ checkFalsy: true })
        .matches(/^\S*$/).withMessage("No spaces allowed")
        .trim()
        .isURL({ protocols: ["https"], require_protocol: true })
        .withMessage("Please enter a valid website URL starting with  https://")
        .custom(value =>{
        if (value.startsWith("javascript:") || value.startsWith("data:")) {
            throw new ApiError("enter valid link", 400);    
        }
        return true
        }),
    body('twitter')
        .optional({ checkFalsy: true })
        .matches(/^\S*$/).withMessage("No spaces allowed")
        .trim()
        .isURL({ protocols: ["https"], require_protocol: true })
        .withMessage("Invalid twitter profile URL")
        .custom(value =>{
            if (value.startsWith("javascript :") || value.startsWith("data:")) {
                 throw new ApiError("enter valid link", 400);
            }
            return true
        }),
    body('linkedin')
        .optional({ checkFalsy: true })
        .matches(/^\S*$/).withMessage("No spaces allowed")
        .trim()
        .isURL({ protocols: ["https"], require_protocol: true })
        .withMessage("Invalid LinkedIn profile URL")
        .custom(value =>{
            if (value.startsWith("javascript :") || value.startsWith("data:")) {
                 throw new ApiError("enter valid link", 400);
            }
            return true
        }),
    body('facebook')
        .optional({ checkFalsy: true })
        .matches(/^\S*$/).withMessage("No spaces allowed")
        .trim()
        .isURL({ protocols: ["https"], require_protocol: true })
        .withMessage("Invalid facebook profile URL")
        .custom(value =>{
            if (value.startsWith("javascript :") || value.startsWith("data:")) {
                 throw new ApiError("enter valid link", 400);
            }
            return true
        }),
]

export default profileValivation
