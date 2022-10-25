const User = require("./../models/userModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");

// creation of token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// sign up user
exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: await User.findById({ _id: `${newUser._id}` }),
    },
  });
});

// log user
exports.logIn = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return next(new AppError("Please provice email and password!!!", 401));
  }

  const user = await User.findOne({ phoneNumber }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password!!!", 400));
  }
  // console.log(user);

  const token = signToken(await user._id);

  console.log(token);
  res.status(200).json({
    status: "success",
    token: token,
  });
});

// check whether user is signed in to access protected routes
exports.protect = catchAsync(async (req, res, next) => {
  // get token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log(token);
  }

  if (!token) {
    next(new AppError("You are not authorized!! please log in to access", 401));
  }
  // verify the token

  // Check if user still exists

  // check whether user changed password after JWT was issued

  next();
});
