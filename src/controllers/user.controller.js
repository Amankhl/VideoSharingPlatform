import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "ok"
    });
}); // asyncHandler will resolve the promise and return the response 



export { registerUser }
