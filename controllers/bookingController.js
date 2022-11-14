const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Service = require("../models/serviceModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked service
  const service = await Service.findById(req.params.serviceId);
  console.log(service);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/my-services/?service=${
      req.params.serviceId
    }&user=${req.user.id}&price=${service.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/service/${service.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.serviceId,
    line_items: [
      {
        name: `${service.name} service`,
        description: service.summary,

        amount: service.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { service, user, price } = req.query;

  if (!service && !user && !price) return next();
  await Booking.create({ service, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
