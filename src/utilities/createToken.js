const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../../secret");

const createToken = (data, expires) => {
  return jwt.sign(
    {
      ...data,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: expires }
  );
};

module.exports = createToken;
