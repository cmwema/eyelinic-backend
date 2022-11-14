const Service = require("../models/serviceModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getHome = catchAsync(async (req, res, next) => {
  res.render("home");
});

exports.getService = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const service = await Service.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!service) {
    return next(new AppError("There is no service with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("service", {
    title: `${service.name} service`,
    service,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.getMyServices = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const serviceID = bookings.map((el) => el.service);
  const services = await Service.find({ _id: { $in: serviceID } });

  res.status(200).render("overview", {
    title: "My services",
    services,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});
