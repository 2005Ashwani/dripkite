import { Schema, model } from "mongoose";


const sampleClothSchema  = new Schema({
    clothType:{
        type:String,
        required:true,
        enum:["Traditional","Casual Wear","Formal Wear"]
    },
     clothGender:{
        type:String,
        required:true,
        enum:["Male","Female"]
    },
    clothName:{
        type:String,
        required:true,
    },
    priceTag:{
        type:Number,
        required:true
    },
    clothSize:{
        type:Number
    }
},{timestamps:true})


const sampleCloth = model("sampleCloth",sampleClothSchema)

export default sampleCloth