import { Router } from "express";
import { refreshAccessToken } from "../controllers/user.controllers.js";

const router = Router()

router.route('/refreshAccessToken').post(refreshAccessToken)


export default router