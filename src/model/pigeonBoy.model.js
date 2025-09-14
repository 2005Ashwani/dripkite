import { Schema,model } from "mongoose";
import signUp from "./signup.model.js";

const pigeonBoySchema = Schema({

    userName:{
        type:Schema.Types.ObjectId,
        ref:signUp
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
     profilePic: {
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
    vehicleNumber:{
        type:String,
        required:true,
        unique:true
    },
    licenseNo:{
        type:String,
        required:true,
        unique:true
    },
    insurance:{
        type:Boolean,
        required:true
    },
    insuranceNo:{
        type:String,
        required: function () {
            return this.localAddress && this.localAddress.length > 0
        }
    }
},{timestamps:true})


export const pigeonBoyModel = model("pigeonBoy",pigeonBoySchema)