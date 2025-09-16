import { body } from "express-validator";

const commetValidation = [
    body("text")
      .toString().withMessage("the image is require")
      .trim()
      .minlenght(3).withMessage("comment should contain min 3  character")
      .minlenght(500).withMessage("comment should contain max 500 character")
]

export default commetValidation;