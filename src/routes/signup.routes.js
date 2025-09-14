import { Router } from "express"
import { upload } from "../middlewares/multer.middlewares.js"
import { registerUser, registerCustomers } from "../controllers/user.controllers.js"
import verifyJWT from "../middlewares/auth.middlewares.js";


const router = Router()

router.route('/register').post(
    registerUser
);

// Register as a customer
router.route('/registerCustomer').post(verifyJWT,
    registerCustomers
);



export default router