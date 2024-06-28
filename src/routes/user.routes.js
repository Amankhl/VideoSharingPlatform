import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlerware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([    
        // using 'upload' middleware before the controller. this middleware adds more fields in the req object which will be used by the controller
        { name: "avatar", maxCount: 1 },  // we are taking two fields. 'name' and 'how many files can be uploaded'. same for the coverImage as well
        { name: "coverImage", maxCount: 1 }
    ]), // we are taking two objects. avatar image and cover image. frontend field name (where you are taking the file) should also be 'avatar' and 'coverImage'
    registerUser)

router.route("/login").post(loginUser)

// secured routes (only logged in users can access these routes):

router.route("/logout").post(verifyJWT, logoutUser)   // that's why we used next() in verifyJWT so that after running this function, logoutUser will also be called. in verifyJWT we've added a new object in the req object (req.user). and we know that any changes made in the middleware will remain for next middleware and route handler, so that means we have added user object in the req, and this will be passed to logoutUser (can be accessed as req.user).
//logout can also be handled with get method then you would need to use get method in your frontend as well.

router.route("/refresh-token").post(refreshAccessToken)

export default router






/*

- Intercepting Requests: When a request with file uploads is made, Multer intercepts the request and processes the multipart/form-data before it reaches your route handler.

- Processing the Request:
Extracting Files: Multer parses the multipart/form-data request and extracts the files.
Storing Files: Based on your configuration, Multer stores the files either in memory or on disk (permanently or temporarily depends upon your use case). It can also store file metadata.
Adding Fields: Multer adds a file or files field to the req object based on whether single or array is used, depending on whether you are handling a single file or multiple files. These fields contain information about the uploaded files, such as the original name, size, MIME type, path and, if stored in memory, the file buffer. It extracts the file(s) and makes their info available in req.file or req.files 

- The extracted file is temporarily stored in memory (or disk if configured).
- This file info is then used to upload files on services like cloudinary (if your are using it) and then remove that temporary files uploaded in the location specified while creating the multer middleware from that location (unlinking (deleting) them in uploadOnCloudinary).

upload.single(fieldName) is used when you expect a single file upload from the client. fieldName specifies the name attribute of the HTML <input> element used to upload the file.
upload.fields(fields) is used when you expect multiple files to be uploaded from the client, each identified by different field names.
                - fields is an array of objects specifying each file upload field and its configuration. Each object specifies the field name and optional configuration options like maximum number of files (maxCount).

*/