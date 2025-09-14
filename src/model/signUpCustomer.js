import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    dob: {
      type: String,   
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
  },
  { timestamps: true }
);

const customerSignUp = mongoose.model("customerSignUp", userSchema);

export default customerSignUp;   
