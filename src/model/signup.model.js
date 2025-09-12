import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const signUpSchema = mongoose.Schema({

   
    

}, { timestamps: true })


// *Hashing the Password - only if Password is Modified
signUpSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
    next()

})


// *Custom Method to Compare Password
signUpSchema.methods.comparePassword = async function (inputPassword) {

    return await bcrypt.compare(inputPassword, this.password)

}

//* Custom Method to Generate Acces Token: generateAccessToken

signUpSchema.methods.generateAccessToken = function () {

    return jwt.sign({
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
        userId: this.userId
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

//*Custom Method to Generate Refresh Token: generateRefreshToken

signUpSchema.methods.generateRefreshToken = function () {

    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })

}

const signUp = mongoose.model("SignUp", signUpSchema)



export default signUp