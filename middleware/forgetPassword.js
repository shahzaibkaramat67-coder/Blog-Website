import { body } from "express-validator";
import ApiError from "../utils/ApiError.js";

const forgetPasswordValidation = [
        body('identifier')
        .exists().withMessage('Username or email is required')
        .toLowerCase()
        .isString()
        .trim()
        .notEmpty().withMessage('Username must be provided')
        .custom((value) => {
            const isEmail = value.includes('@')
            if (isEmail && !/^\S+@\S+\.\S+$/.test(value)) {
                throw new ApiError("the email formate is invalid");
            }

            return true;
        }),
]
export default forgetPasswordValidation;