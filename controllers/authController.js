const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const passport = require("passport");
const flash = require("connect-flash");

// sign up user
exports.getSignUp = (req, res) => {
  res.render("signup");
};
exports.postSignUp = catchAsync(async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const dateOfBirth = req.body.dateOfBirth;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  if (password !== passwordConfirm) {
    throw new AppError("Passwords do not match");
  }

  const newUser = await User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
    }),
    password
  );

  console.log(newUser);
  res.redirect("/api/v1/users/login");
});
// log user
exports.getLogIn = (req, res, next) => {
  res.render("login");
};
exports.postLogIn = (req, res) => {
  console.log(req.body);
  passport.authenticate("local", {
    failureRedirect: "/api/v1/users/login",
    successRedirect: "/",
  });
};

exports.getLogout = (req, res) => {
  req.logout();
  res.redirect("/");
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // ask user for email to send the reset password
});

exports.resetPassword = catchAsync(async (req, res, next) => {});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // check whether the user is logged in
  // clear salt and hash properties of the user
  // create new salt and hash for the password
});
