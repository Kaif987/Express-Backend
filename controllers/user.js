const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const { registerSchema, loginSchema } = require("../zod/schema");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { success } = registerSchema.safeParse({
    name,
    email,
    password,
  });

  if (!success) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { success } = loginSchema.safeParse({
    email,
    password,
  });

  if (!success) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  sendTokenResponse(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("token", "");
  res.json({
    success: true,
    message: "User logged out",
  });
};

// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    //Cookie will expire in 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Cookie security is false .if you want https then use this code. do not use in development time
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }
  //we have created a cookie with a token

  res
    .status(statusCode)
    .cookie("token", token, options) // key , value ,options
    .json({
      success: true,
      token,
    });
};
