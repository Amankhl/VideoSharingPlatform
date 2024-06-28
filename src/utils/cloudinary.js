import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



// Configuring cloudinary (login with your credentials)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null  //file exists or not on the server (locally)
        // Upload file on cloudinary
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})
        // file is uploaded
        // console.log("File uploaded successfully: ", uploadResult.url)
        fs.unlinkSync(localFilePath)    //remove the locally saved temporary file
        return uploadResult 
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        return null;
    }// In file system, when we delete a file, it is unlinked from the file system. That's how OS handles it. we use 'unlink' to delete a file rather than using 'delete' itself.
}

export { uploadOnCloudinary }
