const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const passport = require("passport");
const flash = require("connect-flash");
const Email = require("./../utils/email");

// sign up user
exports.getSignUp = (req, res) => {
  res.render("signup");
};
exports.postSignUp = catchAsync(async (req, res, next) => {
  const username = req.body.username;
  const phone = req.body.phone;
  const email = req.body.email;
  const dateOfBirth = req.body.dateOfBirth;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  if (password !== passwordConfirm) {
    throw new AppError("Passwords do not match");
  }

  try {
    const newUser = await User.register(
      new User({
        username,
        email,
        dateOfBirth,
        phone,
      }),
      password
    );
    console.log("User sign up successfull");

    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/profile-settings`;
    // new Email(newUser, url).sendWelcome();
    res.redirect("/api/v1/users/login");
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});
// log user
exports.getLogIn = (req, res, next) => {
  res.render("login");
};
exports.postLogIn = async (req, res) => {
  console.log(req.body);
  passport.authenticate("local", {
    failureRedirect: "/api/v1/users/login",
    successRedirect: "/api/v1/users/dashboard",
  });
};

exports.getLogout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
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
exports.isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated) {
    return next();
  } else {
    res.redirect("/api/v1/users/login");
  }
};

exports.getForgotPassword = (req, res) => {
  res.render("forgot-password");
};
exports.postForgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with the email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  if (password !== passwordConfirm) {
    throw new AppError("Passwords do not match");
  }

  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.redirect("/api/v1/users/login");
});
