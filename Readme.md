Backend for the video sharing platform

Database connect function is in the 'src/db/index.js'

Express 'src/app.js' which is exported to 'src/index.js'

utils - ApiError.js, asyncHandler.js, ApiResponse.js

Models - writing schemas
       - mongooseAggregatePaginate to the schema
       - encrypting password before saving it
       - jwt tokens + adding tokens in env 

file upload using multer, cloudinary - utils - cloudinary.js

routes and controller:
registration (controller)
login (+ auth middleware) & logout
refreshAccessToken (when a user's access token has expired)
change password
update details
update avatar + also delete the old image
update coverImage + also delete the old image
currentUser

subscription model
