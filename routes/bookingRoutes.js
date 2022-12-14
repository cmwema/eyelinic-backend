const express = require("express");
const Service = require("../models/serviceModel");
const Booking = require("./../models/bookingModel");
const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");
const Pay = require("./../models/payModel");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const payController = require("./../controllers/payController");

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
  .post(
    authController.isLoggedIn,
    payController.generateToken,
    payController.mpesaPayMent
  );

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

router.route("/:id/receipt").get(async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      throw new Error("No booking found");
    }
    // console.log(booking);
    const service = await Service.findById(booking.service);
    if (!service) {
      throw new Error("No service found");
    }
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const pdfDoc = new PDFDocument({ size: "A6" });
    const fileName = `receipt-${booking._id}.pdf`;
    const filePath = path.join(__dirname, `../public/pdfs/${fileName}`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="' + fileName + '"'
    );
    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.pipe(res);

    pdfDoc
      .fontSize(10)
      .text(`Receipt No: ${booking.MpesaReceiptNumber}`, {
        align: "right",
      })
      .text(`Date : ${new Date().toLocaleDateString()}`, {
        align: "right",
      })
      .font("Times-Roman");
    pdfDoc.dash(5, { space: 5 });

    pdfDoc.moveDown();

    pdfDoc
      .text(`Name: ${booking.user.username}`)
      .text(`Email : ${booking.user.email}`)
      .text(`Phone Number : ${booking.PhoneNumber}`)
      .text(`Service Booked : ${booking.service.name}`)
      .text(`Amount : ${booking.price}`)
      .text(
        `Appointment Date : ${booking.appointment.toLocaleDateString("tr-Tr", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}`
      )
      .text(`Appointment Time : ${booking.appointment.toLocaleTimeString()}`)
      .font("Times-Roman")
      .fontSize(14);

    pdfDoc.dash(5, { space: 5 });

    pdfDoc.end();
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

module.exports = router;
