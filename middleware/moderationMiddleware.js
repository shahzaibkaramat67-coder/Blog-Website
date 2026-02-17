import openai from "../helper/openaiClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import delay from "delay"; // npm install delay

const moderationMiddleware = asyncHandler(async (req, res, next) => {

  const { title, short_description, content } = req.body

  try {
    const textToCheck = `${title} ${short_description} ${content} `;

    if (!textToCheck.trim()) {
      return res.status(400).json({
        success: false,
        message: "No content to check"
      });
    }

    // Retry logic for 429
    let response;
    const retries = 3;
    for (let i = 0; i < retries; i++) {
      try {
        response = await openai.moderations.create({
          model: "omni-moderation-latest",
          input: textToCheck
        });
        break; // success, exit loop
      } catch (err) {
        if (err.response && err.response.status === 429) {
          console.log(`Rate limit hit, retrying in 2s (${i + 1}/${retries})`);
          await delay(2000); // wait 2 seconds
        } else {
          throw err;
        }
      }
    }

    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Failed to check article for harmful content"
      });
    }

    const result = response.results[0];
    if (result.flagged) {
      return res.status(400).json({
        success: false,
        message: "Article contains harmful or unsafe content ❌"
      });
    }

    next();

  } catch (error) {
    console.log("Moderation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Article upload failed due to moderation error ❌"
    });
  }
});

export { moderationMiddleware };


// import openai from "../helper/openaiClient.js";
// // import ApiResponse from "../utils/ApiResponse.js";
// import asyncHandler from "../utils/asyncHandler.js";


// const moderationMiddleware = asyncHandler(async(req, res, next)=>{

// try {

//   const textToCheck  = `
//    ${req.body.title || 0}  
//    ${req.body.short_description  || 0}  
//    ${req.body.content || 0}  

//   `;

   
//     const moderation =await openai.moderations.create({
//       model : "omni-moderation-latest",
//       input : textToCheck 
//     })
  
//     const result = moderation.results[0]

//     if (result.flagged) {
//     return res.status(400).json({
//       success : false,
//         message: "Article contains harmful or unsafe content.",
//     }) 
//     }
  
//     next()
// } catch (error) {
//   console.log("message error", error.message);
//   return res.status(500).json({
//     success : false,
//     message: "AI moderation failed",
//   })
  
// }


// })

// export {
//     moderationMiddleware
// }