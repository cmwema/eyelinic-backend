const router = require("express").Router();
const authController = require("./../controller/authController");
const reviewController = require("./../controller/reviewController");

router
  .route("/")
  .get(authController.protect, reviewController.getAllReviews)
  .post(authController.protect, reviewController.createReview);

module.exports = router;
