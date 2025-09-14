import asyncHandler from "../utils/asyncHandler.js";
import signUp from "../model/signup.model.js";
import customerSignUp from "../model/signUpCustomer.js"
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import uploadOnCloudinary from "../utils/cloudinary.js";




const generateRefreshTokenAndAccessToken = async function (userId) {

    try {
        const user = await signUp.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validityBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access token and refresh toekn")
    }

}




const loginUser = asyncHandler(async function (req, res, next) {

    const { userName, phoneNo, emailId, password } = req.body

    if (!userName && !phoneNo && !emailId) {
        throw new apiError(400, "At least one of userName, phoneNo or emailId is required");
    }

    const user = await signUp.findOne({ $or: [{ userName }, { phoneNo }, { emailId }] })

    if (!user) {
        throw new apiError(400, "User doesn't exist");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) { throw new apiError(400, "Password is Wrong") }

    const { accessToken, refreshToken } = await generateRefreshTokenAndAccessToken(user._id);
    const loggedInUser = await signUp.findById(user._id).select("-accessToken -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully!")
        )


})


const signoutUser = asyncHandler(async function (req, res, next) {



    await signUp.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged Out"))
})


const registerUser = asyncHandler(async function (req, res, next) {

    const { userName, emailId, phoneNo, password, confirmPassword } = req.body;



    //validation 
    if ([userName, emailId, phoneNo, password, confirmPassword].some((elem) => elem === "")) {
        throw new apiError(400, "All fields are required!")
    }

    const existUser = await signUp.findOne({
        $or: [{ userName }, { emailId }, { phoneNo }]
    })

    if (existUser) { throw new apiError(400, "User already exists!") }

    const user = await signUp.create({
        userName,
        emailId,
        phoneNo,
        password,
        confirmPassword
    })

    const createdUser = await signUp.findById(user._id).select("-password -confirmPassword")

    if (!createdUser) {
        throw new apiError(400, "Something went wrong while registering User")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered Successfully!")
    )
    //check any of the userName, emailId, phoneNo already exits or not in DB


});


// Register Customer Ashwani
const registerCustomers =asyncHandler( async (req, res) => {
    const { dob, gender } = req.body;
    try {


        // Checking the fields
        if (!dob) {
            return res.status(400).json(new apiError(400, "Please enter the DOB"));
        }
        if (!["male", "female", "other"].includes(gender)) {
            return res
                .status(400)
                .json(new apiError(400, "Please enter the Gender properly"));
        }

        // data that require in customer sign up
        const { userName, emailId, phoneNo } = req.user;
        console.log(userName, emailId, phoneNo)



        // Adding Data to DB
        await customerSignUp.create(req.body);

        // Send the response to the user
        return res
            .status(201)
            .json("Customer registered successfully!");


    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, "Something went wrong while registering customer", error.message));
    }
})

export { registerUser, loginUser, signoutUser, registerCustomers }
