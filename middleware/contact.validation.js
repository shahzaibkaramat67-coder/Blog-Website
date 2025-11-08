import { body } from "express-validator";


const contactValidator = [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Name must contain only letters and spaces"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email format"),

    body("subject")
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Subject is too short"),

    body("message")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Message must be at least 10 characters long"),
  ]

export default contactValidator;