import mongoose, { Schema, Model } from "mongoose";
import signUp from "./signup.model";


const tailorSchema = new Schema({
    userName: {
        type: Schema.Types.ObjectId,
        ref: signUp
    },
    emailId: {
        type: Schema.Types.ObjectId,
        ref: signUp
    },
    phoneNo: {
        type: Schema.Types.ObjectId,
        ref: signUp
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    middleName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    profiePic: {
        type: String,
    },
    aadharNo: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    localAddress: [{
        state: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true
        },
        pinCode: {
            type: Number,
            required: true
        },

        streetNo: {
            type: Number,
            required: true
        },
        streetName: {
            type: String,
            required: true
        }
    }],
    experience: {
        type: Number,
        required: true
    },
    shopName: {
        type: String,
    },
    shopRegistrationNo: {
        type: String,
        required: function () {
            // Only required if shopName is provided
            return this.shopName && this.shopName.trim().length > 0;
        }
    },
   sellRawCloth:{
    type:Boolean,
    required:true
   },
   sampleCloth:{
    ref:Schema.Types.ObjectId,
    ref:sameCloth

   }

}, { timestamps: true })


const tailor = Model("tailor", tailorSchema)

export default tailor