const { Schema, model, default: mongoose } = require("mongoose");

const dataSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    salesId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    qty: {
      type: Number,
      required: true,
      trim: true,
    },
    unitCost: {
      type: Number,
      required: true,
      trim: true,
    },
    total: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const salesProductModel = model("salesProduct", dataSchema);

module.exports = salesProductModel;
