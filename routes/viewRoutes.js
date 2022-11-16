const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.get("/", viewsController.getHome);

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;
