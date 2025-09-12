import { Router } from "express";
import { loginUser } from "../controllers/user.controllers.js";

const router  =Router();


router.route('/login').post(loginUser)

export default router