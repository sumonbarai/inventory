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
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const ExpenseTypeModel = model("ExpenseType", dataSchema);

module.exports = ExpenseTypeModel;
