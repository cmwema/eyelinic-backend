const express = require("express");
const Service = require("../models/serviceModel");
const Booking = require("./../models/bookingModel");
const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");
const Pay = require("./../models/payModel");
const PDFService = require("../utils/receipt");

const {
  postStkController,
  tokenMiddleware,
} = require("./../controllers/payController");

const router = express.Router();

router.route("/").get(authController.isLoggedIn, async (req, res) => {
  try {
    const services = await Service.find({});
    res.render("booking", { user: req.user, services });
  } catch (error) {
    res.send(error.message);
  }
});

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const service = await Service.find({ _id: req.params.id });
      res.render("lipa", { user: req.user, service: service[0] });
      console.log(req.user);
    } catch (error) {
      console.log(error.message);
      res.send(error.message);
    }
  })
  .post(authController.isLoggedIn, tokenMiddleware, postStkController);

router
  .route("/:id/book")
  .get(async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      res.render("confirm-booking", { user: req.user, service });
    } catch (error) {
      res.send(error.message);
    }
  })
  .post(
    authController.isLoggedIn,
    async (req, res) => {
      try {
        const payment = await Pay.find({
          MpesaReceiptNumber: req.body.MpesaReceiptNumber,
        });

        const service = await Service.findById(req.params.id);
        const appointment = req.body.appointment;
        const user = req.user.id;
        console.log(user);

        if (!payment || !service || !appointment || !user) {
          throw new Error("Could not retrieve details");
        }
        if (service.price !== payment[0].Amount) {
          throw new Error("Amount not of this service");
        }

        await Booking.create({
          service: req.params.id,
          user,
          appointment,
          price: payment[0].Amount,
          MpesaReceiptNumber: payment[0].MpesaReceiptNumber,
          PhoneNumber: payment[0].PhoneNumber,
        });

        return res.redirect("/api/v1/bookings");
      } catch (error) {
        console.log(error.message);
        res.send(error.message);
      }
    },
    bookingController.createBooking
  );

router.route("/:id/receipt").get(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    req.booking = booking;
    res.render("receipt", { user: req.user, booking });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

module.exports = router;
