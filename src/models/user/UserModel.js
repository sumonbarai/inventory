const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const dataSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// eslint-disable-next-line prefer-arrow-callback, consistent-return, func-names
dataSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = model("users", dataSchema);

module.exports = UserModel;
