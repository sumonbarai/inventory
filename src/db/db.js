const mongoose = require("mongoose");
const { DATABASE_URI } = require("../../secret");
const { DATABASE_NAME } = require("../../app/constants");

const connectDb = () => {
  return mongoose.connect(DATABASE_URI + DATABASE_NAME, { autoIndex: true });
};
module.exports = connectDb;
