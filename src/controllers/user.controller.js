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

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();   //AccessToken are short lived, their time span already defined in this function. when access tokens are expired, but they have refreshToken, their refreshToken and the one in the database are matched if they are same a new accessToken is generated.
        const refreshToken = await user.generateRefreshToken(); //RefreshToken are long lived

        user.refreshToken = refreshToken;   // as user is an object document and it already has a field called 'refreshToken' and we can set its value
        await user.save({ validateBeforeSave: false });   // now after adding the value, we save it in the db using save() from mongoose. we also use {validateBeforeSave: false} to avoid any validation errors as password field has validation and everytime we add something and save the user, password has to be filled. here we are not creating a new user, we are just updating the db, so we have to set validation of password to false as we don't need validation here.

        return { accessToken, refreshToken }; 

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Refresh and Access token");  
    }
}




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
//    console.log("email: ", email)
//    console.log(req.body);

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
    if (!email || !email.includes("@")) {
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
    // console.log("req.files: ", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path; // this path is created by multer defined in the middleware
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;  // this code throws error if a user uploads no cover image

    // if user doesn't upload any cover image, then we need to set it to an empty string
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

// 5)
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // as avatar is required field in database. so we need to double check if it exists or not in db
    if(!avatar){
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


const loginUser = asyncHandler(async (req, res) => {
    /*
    STEPS:
    1) get user details from frontend (req body)
    2) username & email validation
    3) find the user
    4) check for password
    5) generate access token and refresh token
    6) send secure cookies
    */

//1)
    const { username, email, password } = req.body;

//2)
    if(!(username || email)){   // you can also check one by one or you can use '&&' operator to check both (!username && !email)
        throw new ApiError(400, "Username or email are required");
    }

//3)
    const user = await User.findOne({
        $or: [{ username }, { email }]   // you could also use only one data entry to login i.e. username or email without using $or operator, but it's better to use both
    })

    if(!user){
        throw new ApiError(404, "Invalid credentials");
    }

//4)
    const isPasswordValid = await user.isPasswordCorrect(password);   // this function is created by you in User models so you can't use this on 'User' model. these functions are available for our 'user' we fetched (instance) from database.   you can also use this -> await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        throw new ApiError(401, "Password is incorrect");
    }

//5)
    // we commonly generate access token and refresh token many times that's why we create a seperate function for this.
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);     // we know that mongodb creates a unique _id for each document, so we can use that to generate access and refresh tokens

//6)
    // if we used 'user' to access refreshToken we just saved in the database using generateAccessAndRefreshTokens(), we couldn't access it as we are still accessing the old 'user' variable and that field is still empty. so we need to update it or call database query again. (using db call again can be expensive)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");    // we don't send password and refreshToken in response of login

    const options = {
        httpOnly: true,    // we don't want to access this cookie from frontend
        secure: true,
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options) // it is necessary to send access token because we do not have it in the db. we also need to send refresh token because we match that with the one in the db.
    .json(
        new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }, "User logged in successfully")
    ) // the reason why we are sending access and refresh token twice (through cookies and as json response) because maybe user wants to save these token in local storage, or maybe it will be used in mobile App and we can't set cookies there.
// we are able to add cookies in response object because we have used cookie-parser middleware in app - this cookie is now available in request (req.cookie()) as well as response (res.cookie()), meaning two way access.
});


const logoutUser = asyncHandler(async (req, res) => {
// cookies are httpOnly, so we can only clear cookies through the backend.
// we need to delete the refreshToken data from the database as well. because refreshTokens are generated everytime a user logs in, we need to delete them from the database. 
// we don't have any access of any values of the fields of db (like having access while loggining). so how will we able to delete refreshToken from db since a id or username is required to fetch (instance) data from 'User' model? Here, we need middlewares, so we use verifyJWT middleware. although the login in this middleware could have been used in this function, this verifyJWT is not only used in logout functionality but also in other functionalities like where we need authentication.
    
// we now have req.user because of verifyJWT middleware.
    await User.findByIdAndUpdate(
        req.user._id,      // we find the user using this id
        {
            $set: { 
                refreshToken: undefined,
             },         // $set is a mongodb operator that takes object of fieldnames that needs to be updated in document in a MongoDB collection.
        },
        {
            new: true,   // this ensures you get new return value 
        }
    )
// now the refreshToken in the db is removed and its time to remove cookies
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))


});

export { registerUser, loginUser, logoutUser };




















/*

findOne: method is a function provided by Mongoose, a MongoDB object modeling tool for Node.js. This method is used to find a single document in a MongoDB
collection that matches the specified query criteria. It is particularly useful when you need to retrieve one specific document based on certain conditions.

$or: This is a MongoDB query operator used within the query object. It allows you to specify that at least one of the expressions in the array must be true. 
In this case, it means the query will match documents where either the username or the email field matches the provided values. we pass objects in the array [{username},{email}]



*/