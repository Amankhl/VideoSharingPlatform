import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlerware.js";

const router = Router();

router.route("/register").post(
    upload.fields([    // using 'upload' middleware before the controller. this middleware adds more fields in the req object which will be used by the controller
        { name: "avatar", maxCount: 1 },  // we are taking two fields. 'name' and 'how many files can be uploaded'. same for the cover as well
        { name: "cover", maxCount: 1 }
    ]), // we are taking two objects.avatar image and cover image. frontend field name (where you are taking the file) should also be 'avatar' and 'cover'
    registerUser)


export default router