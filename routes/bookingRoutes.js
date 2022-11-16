const express = require("express");
const Service = require("../models/serviceModel");
const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get("/payment/:serviceId", async function (req, res) {
  const service = await Service.findById(req.params.serviceId);
  console.log(service);
  res.render("payment", {
    key: process.env.STRIPE_PUBLIC_KEY,
    amount: service.price,
    productName: service.name,
    description: service.description,
  });
});

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
