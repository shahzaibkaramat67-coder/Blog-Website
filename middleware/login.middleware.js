import { body } from 'express-validator';

export const loginValidationRules = [
    body('username')
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Username must be provided'),
    body('gmail')
        .optional()
        .isEmail()
        .withMessage('Valid email must be provided'),
    body('password')
        .exists()
        .withMessage('Password is required')
];
