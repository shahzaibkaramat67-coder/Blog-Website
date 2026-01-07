import asyncHandler from "../utils/asyncHandler.js";

const isAdmin = asyncHandler(async (req, res, next) => {
    if (!req.user) {

        return res.render("403", { layout: false, title: "403" });
    }
    if (!req.user || req.user.role !== "admin") {
        return res.render("403", { layout: false,title: "403"  });
    }

    if (req.user._id.toString() !== "692eeace5493f6ad655e3f82") {
        //   admin id = 692ef4567f29e141fe202659
        return res.render("403", { layout: false, title: "403" });
    }
    next()
})
export default isAdmin;