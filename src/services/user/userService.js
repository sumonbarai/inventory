const bcrypt = require("bcrypt");
const UserModel = require("../../models/user/UserModel");
const customError = require("../../utilities/customError");
const findByPropertyService = require("../common/findByPropertyService");
const createToken = require("../../utilities/createToken");
const createOTP = require("../../utilities/createOTP");
const OTPModel = require("../../models/user/OtpModel");
const sendEmail = require("../../utilities/sendEmail");
const createService = require("../common/createService");
const updateService = require("../common/updateService");
const { ACCESS_TOKEN_EXPIRY } = require("../../../secret");

const registerService = async (data) => {
  const user = await findByPropertyService(UserModel, { email: data.email });
  if (user) throw customError("User already register", 400);

  const newUser = await createService(UserModel, data);
  return newUser;
};

const loginService = async ({ email, password }) => {
  const user = await findByPropertyService(UserModel, { email });
  if (!user) throw customError("invalid credential", 400);

  // checking user password
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw customError("invalid credential", 400);

  // create token for login user
  const token = createToken(
    { _id: user._id, email: user.email },
    ACCESS_TOKEN_EXPIRY
  );

  return {
    user,
    token,
  };
};

const profileDetailsService = async (email) => {
  const user = await findByPropertyService(UserModel, { email });
  if (!user) throw customError("user profile not found", 404);

  return user;
};

const profileUpdateService = async (_id, updatedData) => {
  const updatedUser = await updateService(UserModel, { _id }, updatedData, {
    select: "-password -createdAt -updatedAt",
  });

  if (!updatedUser) throw customError("user profile not found", 404);
  return updatedUser;
};

const changePasswordService = async (_id, { password, newPassword }) => {
  const user = await findByPropertyService(UserModel, { _id });
  if (!user) throw customError("user is not registered", 400);

  // checking user password
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw customError("invalid password", 400);
  user.password = newPassword ? newPassword : user.password;
  await user.save();
  return true;
};

const sendOTPService = async (email) => {
  const user = await findByPropertyService(UserModel, { email });
  if (!user) throw customError("invalid email address", 400);

  // create a new opt code and save to opt model
  const otp = createOTP();
  const filter = { userEmail: email };
  const updatedData = { userEmail: email, otp, status: 0 };

  const result = await updateService(OTPModel, filter, updatedData, {
    upsert: true,
  });
  if (!result) throw customError("updated information error", 400);

  await sendEmail({
    to: email,
    text: `your otp code is= ${otp}`,
    subject: "OTP verification",
  });
};

const verifyOTPService = async (email, otp) => {
  const otpUser = await findByPropertyService(OTPModel, { userEmail: email });

  if (!otpUser) throw customError("invalid email address", 400);

  // for checking user opt code
  if (otpUser.otp !== otp) throw customError("invalid otp code", 400);

  // update opt
  otpUser.otp = 0;
  otpUser.status = 1;

  await otpUser.save();
  return true;
};

const recoveryPasswordService = async (email, password) => {
  const otpUser = await findByPropertyService(OTPModel, { userEmail: email });

  if (!otpUser) throw customError("invalid email address", 400);

  // for checking otp user status
  if (otpUser.status !== 1) {
    throw customError("password recovery request reject", 400);
  }
  // update status
  otpUser.status = 0;
  await otpUser.save();
  return updateService(UserModel, { email }, { password });
};

module.exports = {
  registerService,
  loginService,
  profileDetailsService,
  profileUpdateService,
  changePasswordService,
  sendOTPService,
  verifyOTPService,
  recoveryPasswordService,
};
