const {
  registerService,
  loginService,
  profileDetailsService,
  profileUpdateService,
  changePasswordService,
  sendOTPService,
  verifyOTPService,
  recoveryPasswordService,
} = require("../../services/user/userService");
const customError = require("../../utilities/customError");

const register = async (req, res, next) => {
  try {
    const { email, firstName, lastName, mobile, password } = req.body;

    // for basic input data validation
    if (!email || !firstName || !lastName || !mobile || !password) {
      throw customError("invalid data", 400);
    }

    // for password minimum length
    if (password.length < 6) {
      throw customError("password length minimum 6 character", 400);
    }

    // now go to register service
    const user = await registerService(req.body);
    delete user._doc.password;

    // every think is ok now response to client
    res.status(200).json({
      message: "registration success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // for basic input data validation
    if (!email || !password) {
      throw customError("invalid data", 400);
    }

    // now go to login service
    const { user, token } = await loginService({ email, password });
    delete user._doc.password;

    // every think is ok now response to client
    res.status(200).json({
      message: "login success",
      data: user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const ProfileDetails = async (req, res, next) => {
  try {
    const { email } = req.headers;

    // now go to profile details service
    const user = await profileDetailsService(email);
    delete user._doc.password;

    // every think is ok now response to client
    res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const ProfileUpdate = async (req, res, next) => {
  try {
    const { _id } = req.headers;
    const reqBody = req.body;
    const { email, password } = req.body;

    // user can't change email address and password for this checking
    if (email) throw customError("user can't update email address", 400);
    if (password) throw customError("user can't update password", 400);

    // now go to profile update service
    const updatedUser = await profileUpdateService(_id, reqBody);

    // every think is ok now response to client
    res.status(200).json({
      message: "profile update successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { _id } = req.headers;
    const { password, newPassword } = req.body;

    // user password for this checking
    if (newPassword.length < 6) {
      throw customError("user new password minimum 6 character", 400);
    }

    // now go to profile update service
    await changePasswordService(_id, {
      password,
      newPassword,
    });

    // every think is ok now response to client
    res.status(200).json({
      message: "password update successfully",
    });
  } catch (error) {
    next(error);
  }
};

const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.params;
    if (!email) throw customError("email params is required", 400);

    await sendOTPService(email);

    // every think is ok now response to client
    res.status(200).json({
      message: "otp send successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email } = req.params;
    const otp = Number(req.params.otp);

    if (!email) throw customError("email params is required", 400);

    if (!otp || otp === 0) throw customError("invalid otp code", 400);

    await verifyOTPService(email, otp);

    // every think is ok now response to client
    res.status(200).json({
      message: "otp verify successfully",
    });
  } catch (error) {
    next(error);
  }
};

const recoveryPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { password } = req.body;
    // for basic input data validation
    if (!email || !password) {
      throw customError("invalid data", 400);
    }

    // for password minimum length
    if (password.length < 6) {
      throw customError("password length minimum 6 character", 400);
    }

    //  now go to recoveryPassword service
    await recoveryPasswordService(email, password);

    // every think is ok now response to client
    res.status(200).json({
      message: "password change successfully please login",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  ProfileDetails,
  ProfileUpdate,
  changePassword,
  sendOTP,
  verifyOTP,
  recoveryPassword,
};
