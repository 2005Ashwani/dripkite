import Router from "express"
import { registerTailor } from "../controllers/user.controllers.js"

import { upload } from "../middlewares/multer.middlewares.js"

const router = Router()


router.route('/tailorRegBtn').post(upload.single('profilePic'),registerTailor)

export default router