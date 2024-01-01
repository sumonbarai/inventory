/* eslint-disable prefer-destructuring */
require("dotenv").config();

const DATABASE_URI = process.env.DATABASE_URI;
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
const SMTP_USER_NAME = process.env.SMTP_USER_NAME;
const SMTP_USER_PASSWORD = process.env.SMTP_USER_PASSWORD;

module.exports = {
  DATABASE_URI,
  PORT,
  CORS_ORIGIN,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  SMTP_USER_NAME,
  SMTP_USER_PASSWORD,
};
