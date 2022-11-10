const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// creation of token
const signToken = (id) => {
  // console.log(process.env.JWT_EXPIRES_IN);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookiesOptions = {
    httpOnly: true,
    // expires: Date.now() + 10 * 60 * 1000,
  };
  if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

  res.cookie("jwt-cookie", token);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// sign up user
exports.signUp = catchAsync(async (req, res) => {
  // req.body.password = await bcrypt.hash(req.body.password, salt);
  // console.log(req);
  const salt = await bcrypt.genSalt(10);

  const newUser = await User.create({
    name: req.body.name,
    password: await bcrypt.hash(req.body.password, salt),
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
  });

  createSendToken(newUser, 201, res);
});

// log user
exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!!!", 401));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password!!!", 400));
  }
  // console.log(user);

  const token = signToken(await user._id);

  // console.log(token);
  createSendToken(user, 200, res);
});

exports.isLoggedIn = async (req, res, next) => {
  // // get token and check if its there

  try {
    if (req.cookies["jwt-cookie"]) {
      const decoded = await promisify(jwt.verify)(
        req.cookies["jwt-cookie"],
        process.env.JWT_SECRET
      );

      // console.log(decoded);

      // check if user still exists
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }

      // check if user changed password after token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // there is a logged in user
      res.locals.user = currentUser;
      next();
    }

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
};

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
    } else if (req.cookies["jwt-cookie"]) {
      token = req.cookies["jwt-cookie"];
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

    // console.log(currentUser);
    // check whether user changed password after JWT was issued
    // console.log(decoded);
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new AppError(
        "Recently changed password!! please log in again.",
        401
      );
    } //decode.iat --> issued at

    // grant access to the protected rout
    req.user = currentUser;

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on the posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError("User not found!", 404));

  // generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  await user.updateOne({ passwordResetTokenExpires, passwordResetToken });

  console.log(user.passwordResetToken, { resetToken });

  // await user.update();
  // send the token to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to : \n${resetURL}.
  \nif you did not forget your password please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid in 10min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token send to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false, isNew: false });

    next(
      new AppError(
        "Error occured when sending the reset Token....please try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // check if token is valid
  if (!user) {
    return next(new AppError("Token is invalid or has expired!"));
  }

  // set new password
  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(req.body.password, salt);
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  // log in the user
  createSendToken(user, 200, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();

  const token = signToken(await user._id);

  createSendToken(user, 200, res);
});
