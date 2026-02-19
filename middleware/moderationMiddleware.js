import asyncHandler from "../utils/asyncHandler.js";
import vettlyApi from "../helper/openaiClient.js"; // your axios instance for Vettly

const moderationMiddleware = asyncHandler(async (req, res, next) => {



  const { title, short_description, content } = req.body;

  const textToCheck = `${title} ${short_description} ${content}`.trim();

  if (!textToCheck) {
    return res.status(400).json({ success: false, message: "No content to check" });
  }

  try {
    // Send to Vettly (single check)
    const response = await vettlyApi.post("/check", {
      policyId: "moderate",     // required
      content: textToCheck       // required
    });

    const result = response.data;

    if (result.flagged === true || result.safe === false) {
      return res.status(400).json({
        message: "Content violates policy",
        reason: result.reason || "Unsafe content"
      });
    }

    next(); // content is safe

  } catch (error) {
    console.error("Moderation error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Article upload failed due to moderation error ❌"
    });
  }
});

export { moderationMiddleware };
