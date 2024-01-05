const { Schema, model, default: mongoose } = require("mongoose");

const dataSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    vat: {
      type: Number,
      default: 0,
      trim: true,
    },
    shipping: {
      type: Number,
      default: 0,
      trim: true,
    },
    otherCost: {
      type: Number,
      default: 0,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
      trim: true,
    },
    grandTotal: {
      type: Number,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const ReturnModel = model("Return", dataSchema);

module.exports = ReturnModel;
