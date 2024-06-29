import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// used in logout, password change, details updation, files updation, authentication as a middleware

// when a user logged in, we sent accessToken and refreshToken in the response. and using them we verify and if the user has both, we add a new object in the req object (req.user) like how cookie-parser gives access to cookie and multer adds its file(s) object and send it to the route handler.

export const verifyJWT = asyncHandler(async (req, _, next) => {   // sometimes res object remains unused so we use underscore '_'
    try {
        // we have access in the request because of cookie-parser middleware. when we logged in, we sent accessToken and refreshToken in the response. they are stored in cookies in client side. we received them in the request. we use this accessToken to verify if the user has both accessToken and refreshToken
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");  // we get accessToken from cookies or header (that's why sent accessToken in two ways, maybe the other one will be used for mobile app and they do not have access to cookies. they have to handle those Tokens from frontend)
        // maybe we get accessToken from cookies or header (use use header function with a value "Authorization" header that has a "Bearer <token>" in it). Now to verify the user, we do not need the full "Bearer <token>" rather we just need the token. so we use .replace("Bearer ", "") to remove "Bearer " from the token and get the actual token.
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) // this method verifies if the accessToken is verified or not, if it has the same secret key we defined while generating accessToken.
    
        // now finding the user in the database using the decodedToken.
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")     // _id is what we defined in the generateAccessToken function (_id: this._id).
        if(!user) {
            throw new ApiError(401, "Invalid access token");
        }
        req.user = user;    
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})