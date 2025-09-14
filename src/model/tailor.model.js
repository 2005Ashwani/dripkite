import mongoose, { Schema,  model } from "mongoose";
import signUp from "./signup.model.js";
import sampleCloth from "./sampleCloth.model.js";



const tailorSchema = new Schema({
    userName: {
        type: Schema.Types.ObjectId,
        ref: signUp,

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
    shopLocation: {
        type: String,
        required: function () {
            return this.localAddress && this.localAddress.length > 0
        }
    },
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
    sellRawCloth: {
    type:Boolean,
    // required: true
},
    sampleCloth: {
    type: Schema.Types.ObjectId,
    ref: sampleCloth
}

}, { timestamps: true })


const tailor = model("tailor", tailorSchema)

export default tailor