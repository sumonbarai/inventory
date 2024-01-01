const { Schema, model } = require("mongoose");

const dataSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    otp: {
      type: Number,
      trim: true,
    },
    status: {
      type: Number,
      required: true,
      default: 0,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const OTPModel = model("otp", dataSchema);

module.exports = OTPModel;
