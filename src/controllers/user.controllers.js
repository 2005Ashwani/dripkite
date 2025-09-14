import asyncHandler from "../utils/asyncHandler.js";
import signUp from "../model/signup.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import uploadOnCloudinary from "../utils/cloudinary.js";
import tailor from "../model/tailor.model.js";


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


})


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

const registerTailor = asyncHandler(async (req, res, next) => {

    const { firstName, middleName, lastName, profilePic, aadharNo, gender, localAddress, shopLocation,
        experience, shopName, shopRegistrationNo, sellRawCloth
    } = req.body




    const avatarInfo = await uploadOnCloudinary(req.file.path);

    let localAddressJson = []
    const avatarUrl = avatarInfo?.url;
    if (req.body.localAddress) {
        if (typeof req.body.localAddress === "string") {
            try {
                localAddressJson = JSON.parse(req.body.localAddress);
            } catch (e) {
                console.error("Invalid localAddress JSON:", e);
            }
        } else {
            localAddressJson = req.body.localAddress;
        }
    }


    let sellRawClothBool;

    if (typeof sellRawCloth === "string") {
        sellRawClothBool = (sellRawCloth === "true");
    } else {
        sellRawClothBool = sellRawCloth;
    }







    if ([firstName, lastName, aadharNo, gender, localAddress, experience, shopName, sellRawCloth].some((elem) => elem == "")) {
        throw new apiError(400, "Fields are must")
    }



    const tailorReg = await tailor.create({
        firstName,
        middleName,
        lastName,
        profilePic: avatarUrl,
        aadharNo,
        gender,
        localAddress: localAddressJson,
        shopLocation,
        experience,
        shopName,
        shopRegistrationNo,
        sellRawCloth: sellRawClothBool
    })


    return res.status(201).json(
        new apiResponse(201, "Tailor registered Successfully!")
    )



})


const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = await req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized Access!");
    }


    try {
        const decodedToken =  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        
        const user = await signUp.findById(decodedToken._id)
        
        if (!user) {
            throw new apiError(401, "Invalid Refresh Token")
        }
        
        if (incomingRefreshToken != user?.refreshToken) {
            throw new apiError(401, "Refresh token is expired or used")
        }
        

        const { accessToken, refreshToken } = await generateRefreshTokenAndAccessToken(user._id)
        


        const options = {
            httpOnly: true,
            secure: true
        }
        return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new apiResponse(
                200,
                { accessToken, refreshToken: refreshToken },
                "Access token refreshed"
            )
        )
    } catch (error) {

        throw new apiError(401, error?.message || "Invalid refresh Token")
    }


})
export { registerUser, loginUser, signoutUser, registerTailor, refreshAccessToken }
