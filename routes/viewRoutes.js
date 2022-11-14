const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.get("/", viewsController.getHome);

router.get(
  "/service/:slug",
  authController.isLoggedIn,
  viewsController.getService
);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/me", viewsController.getAccount);

router.get(
  "/my-services",
  bookingController.createBookingCheckout,
  viewsController.getMyServices
);

router.post(
  "/submit-user-data",

  viewsController.updateUserData
);

module.exports = router;
