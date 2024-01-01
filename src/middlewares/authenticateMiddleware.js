/* eslint-disable prefer-destructuring */
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../../secret");
const UserModel = require("../models/user/UserModel");
const findByPropertyService = require("../services/common/findByPropertyService");
const customError = require("../utilities/customError");

const authenticateMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) throw customError("Unauthorized", 401);

    // token validity checking and user is exits or not
    token = token.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
      throw customError(error.message, 403);
    }

    const { _id, email } = decoded;

    // checking user exits or not
    const user = await findByPropertyService(UserModel, { email });
    if (!user) throw customError("invalid token", 401);

    // everything is ok now go to next controller
    req.headers._id = _id;
    req.headers.email = email;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticateMiddleware;
