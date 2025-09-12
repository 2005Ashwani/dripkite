import asyncHandler from "../utils/asyncHandler";
import signUp from "../model/signup.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose  from "mongoose";
import uploadOnCloudinary from "../utils/cloudinary.js";


const generateRefreshTokenAndAccessToken = async function(userId){


}

const registerUser = asyncHandler(async function(req,res,next){


})



export {registerUser}
