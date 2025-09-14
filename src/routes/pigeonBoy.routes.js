import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { pigeonBoy } from "../controllers/user.controllers.js";

const router = Router()

router.route('/pigeonBoyRegBtn').post(upload.single("profilePic"),pigeonBoy)

export default router