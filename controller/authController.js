const { promisify } = require("util");
const User = require("./../models/userModel");
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
    passwordChangedAt: req.body.passwordChangedAt,
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
    return next(
      new AppError("Please provice phoneNumber and password!!!", 401)
    );
  }

  const user = await User.findOne({ phoneNumber }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid phoneNumber or password!!!", 400));
  }
  // console.log(user);

  const token = signToken(await user._id);

  // console.log(token);
  res.status(200).json({
    status: "success",
    token: token,
  });
});

// check whether user is signed in to access protected routes
exports.protect = catchAsync(async (req, res, next) => {
  // // get token and check if its there

  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "You are not logged in! Please log in to get access.",
        401
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // console.log(await decoded.id);

    // check whether the user exists
    const currentUser = await User.findById(await decoded.id);
    if (!currentUser) {
      throw new AppError("User belonging to this token no longer exist", 401);
    }

    // check whether user changed password after JWT was issued
    // console.log(decoded);
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new AppError(
        "Recently changed password!! please log in again.",
        401
      );
    } //decode.iat --> issued at

    // grant access to the protected rout
    res.user = currentUser;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new AppError("Invalid token. Please log in again!", 401));
    }

    if (error.name === "TokenExpiredError") {
      next(new AppError("Your token has expired! Please log in again.", 401));
    }

    next(error);
  }
});

exports.restrict = catchAsync(async (req, res, next) => {});
