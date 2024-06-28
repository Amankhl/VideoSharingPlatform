import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb)  // user's request, file being uploaded,  cb = callback
    {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.originalname + '-' + uniqueSuffix);
    }
})

export const upload = multer({ storage, })




/*
Multer processes the request, extracts the file, and stores it according to the specified storage configuration.

- we export 'upload' so that we can use it as a middleware to the request.
- It intercepts the request and extracts the files, stores them in location and name specified.
- Multer adds a file or files field to the req object, depending on whether you are handling a single file or multiple files. (like how we used this object in controller ->  req.files?.avatar[0]?.path)


*/