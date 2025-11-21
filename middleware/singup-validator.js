import { body } from "express-validator"
// import , body from 'express-validator'

const validatorForRegistration = [
    body('firstName')
        .notEmpty().withMessage('firstName is required')
        .escape().withMessage('space not allowed')
        .trim()
        .isLength({ min: 5, max: 10 }).withMessage('min lenght should be 5 and max lenght  10')
        .isAlphanumeric().withMessage('just use number and letters'),

    body('lastName')
        .notEmpty().withMessage('lastName is required')
        .escape().withMessage('space not allowed')
        .trim()
        .isLength({ min: 5, max: 10 }).withMessage('min lenght should be 5 and max lenght  10')
        .isAlphanumeric().withMessage('just use number and letters'),

    body('Email')
        .notEmpty().withMessage('gmail is required')
        .escape().withMessage('space not allowed')
        .trim().normalizeEmail()
        .isEmail().withMessage('please input gmail according to the standered formate'),
    body('password')
        .notEmpty().withMessage('password is required')
        .escape().withMessage('space not allowed')
        .trim()
        .isLength({ min: 8, max: 20 }).withMessage('min lenght should be 7 and max should be 13')
        .isStrongPassword().withMessage('password should be contain uppercase, lowercase, symbols and numbers'),
    body('confirmPassword')
        .notEmpty().withMessage('confirmPassword is required')
        .escape().withMessage('space not allowed')
        .trim()
        .isLength({ min: 8, max: 20 }).withMessage('min lenght should be 7 and max should be 13')
        .isStrongPassword().withMessage('confirmPassword should be contain uppercase, lowercase, symbols and numbers')
]

export default validatorForRegistration;
