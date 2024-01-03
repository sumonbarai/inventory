const { Schema, model, default: mongoose } = require("mongoose");

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
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const ExpenseModel = model("Expense", dataSchema);

module.exports = ExpenseModel;
