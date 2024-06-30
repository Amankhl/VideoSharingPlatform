import { v2 as cloudinary } from 'cloudinary';


// Configuring cloudinary (login with your credentials)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null
        await cloudinary.uploader.destroy(publicId, { resource_type: "auto" })
        return true
    } catch (error) {
        console.error('Error deleting the old image while updating new image from Cloudinary:', error);
        return null;
    }
}