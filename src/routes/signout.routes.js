import { Router } from "express";
import { signoutUser } from "../controllers/user.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";

const router = Router()

router.route('/signout').post(verifyJWT,signoutUser)

export default router