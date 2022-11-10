const Service = require("../models/serviceModel");
const catchAsync = require("../utils/catchAsync");

exports.overview = catchAsync(async (req, res, next) => {
  // get services
  const services = await Service.find({});

  res.status(200).render("overview", {
    title: "overview",
    services: services,
  });
});

exports.signIn = (req, res) => {
  res.status(200).render("signin", {
    title: "sign in",
  });
};

exports.signUp = (req, res) => {
  res.status(200).render("signup", {
    title: "sign up",
  });
};

exports.forgotPassword = (req, res) => {
  res.status(200).render("forgotpassword", {
    title: "forgot password",
  });
};

exports.updatePassword = (req, res) => {
  res.status(200).render("change-password", {
    title: "change password",
  });
};

exports.profileSettings = (req, res) => {
  res.status(200).render("profile-settings", {
    title: "profile settings",
  });
};

exports.payment = (req, res) => {
  res.status(200).render("payment", {
    title: "payment",
  });
};
