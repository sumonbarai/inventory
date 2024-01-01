const { Schema, model } = require("mongoose");

const dataSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const CustomerModel = model("Customer", dataSchema);

module.exports = CustomerModel;
