import { body } from "express-validator";


const articalValidation = [

    body("title")
        .trim()
        .isLength({ max: 25 }).withMessage("title should contain at lest 25 charater")
        .notEmpty().withMessage("title is required")
        .matches(/^[A-Za-z0-9 ,.?'""!]+$/),

    body("tags")
        .trim()
        .isLength({ max: 50 }).withMessage("tags should contain at lest 50 charater")
        .notEmpty().withMessage("title is required")
        .matches(/^[A-Za-z0-9 ,.?'""!]+$/),

    body("short_description")
        .trim()
        .isLength({ max: 300 }).withMessage("tags should contain at lest 300 charater")
        .notEmpty().withMessage("title is required")
        .matches(/^[A-Za-z0-9 ,.?'""!]+$/),

    body("content")
        .trim()
        .notEmpty().withMessage("title is required")
        .matches(/^[A-Za-z0-9 ,.?'""!]+$/),

    body("publish_date")
        .trim()
        .notEmpty().withMessage("title is required")
        .matches(/^[A-Za-z0-9 -]+$/),

    // body("author")
    //     .trim()
    //     .notEmpty().withMessage("title is required")
    //     .matches(/^[A-Za-z0-9 _-]+$/),

    body("meta_title")
        .trim()
        .notEmpty().withMessage("title is required")
        .matches(/^[A-Za-z0-9 ,.?'""!]+$/),

    body("meta_description")
        .trim()
        .notEmpty().withMessage("title is required")
        .matches(/^[A-Za-z0-9 ,.?'""!]+$/),





]

export default articalValidation