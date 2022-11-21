const express = require("express");
const Service = require("../models/serviceModel");
const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");
const {
  postStkController,
  tokenMiddleware,
} = require("./../controllers/payController");

const router = express.Router();

router.route("/").get(authController.isLoggedIn, async (req, res) => {
  const services = await Service.find({});
  // console.log(services);
  res.render("booking", { user: req.user, services });
});

router
  .route("/:id")
  .get(async (req, res) => {
    const service = await Service.find({ _id: req.params.id });
    res.render("booking-form", { user: req.user, service: service[0] });
  })
  .post(authController.isLoggedIn, tokenMiddleware, postStkController);

module.exports = router;
