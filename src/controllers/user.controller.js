import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/*
const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "ok"
    });
}); // asyncHandler will resolve the promise and return the response 

*/



// Main Function

const registerUser = asyncHandler(async (req, res) => {
   /*
   STEPS:
   1) get user details from frontend
   2) validation of user details and not empty
   3) check if user already exists - using username and email
   4) check for images, check for avatar
   5) upload them to cloudinary, check for avatar
   6) create user object - create entry in db
   7) remove password and refresh token field from the response of entry creation
   8) check for user creation - if yes, return res else error
   9) return res
   */

// 1)
   const { username, email, password, fullName } = req.body
   console.log("email: ", email)

// 2)
   /*
   if(fullName ===""){
        throw new ApiError(400, "Full Name cannot be empty")
   }
    if (username === "") {
        throw new ApiError(400, "username cannot be empty")
    }
    // one by one ...
    OR
   */
    if(
        [fullName, username, email, password].some(field => field?.trim() === "")    // checks on a condition and returns true or false. 
    ){
        throw new ApiError(400, "All fields are required")
    }
    if (email.includes("@") === false) {
        throw new ApiError(400, "Invalid email")
    }

// 3)
    const existingUser = await User.findOne({
        $or: [{ username },{ email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User already exists") 
    }

// 4)
    // multer provides '.files' property created by the 'upload' middleware in the request object. this is similar to how express provides '.body'
    const avatarLocalPath = req.files?.avatar[0]?.path; // this path is created by multer defined in the middleware
    const coverLocalPath = req.files?.coverImage[0]?.path;
    if(! avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

// 5)
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath)

    // as avatar is required field in database. so we need to double check if it exists or not in db
    if(! avatar){
        throw new ApiError(400, "Avatar file is required")  
    }

// 6)
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",  // if coverImage is not provided, it will be an empty string. since we didn't check for it in db, we need to do it here otherwise database will break.
        email,
        password,
        username: username.toLowerCase()
    })
// 7, 8)
    const createdUser = await User.findById(user._id).select("-password -refreshToken")// this removes password and refresh token from the response of entry creation. select() parameter takes a string that specifies the fields to be removed using '-' prepended to the field name
    // _id is automatically generated after the user is created

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating user")
    }

// 9)
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )


});


export { registerUser }




















/*

findOne: method is a function provided by Mongoose, a MongoDB object modeling tool for Node.js. This method is used to find a single document in a MongoDB
collection that matches the specified query criteria. It is particularly useful when you need to retrieve one specific document based on certain conditions.

$or: This is a MongoDB query operator used within the query object. It allows you to specify that at least one of the expressions in the array must be true. 
In this case, it means the query will match documents where either the username or the email field matches the provided values.



*/