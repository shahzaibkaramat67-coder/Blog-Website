import { body } from "express-validator";

const updatePasswordValidation = [
     body('password')
        .notEmpty().withMessage('password is required')
        .escape().withMessage('space not allowed')
        .trim()
        .isLength({ min: 7, max: 13 }).withMessage('min lenght should be 7 and max should be 13')
        .isStrongPassword().withMessage('password should be contain uppercase, lowercase, symbols and numbers'),
    body('confirmPassword')
        .notEmpty().withMessage('confirmPassword is required')
        .escape().withMessage('space not allowed')
        .trim()
        .isLength({ min: 7, max: 13 }).withMessage('min lenght should be 7 and max should be 13')
        .isStrongPassword().withMessage('confirmPassword should be contain uppercase, lowercase, symbols and numbers')
]

export default updatePasswordValidation