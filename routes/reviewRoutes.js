const router = require("express").Router({ mergeParams: true });
const authController = require("./../controller/authController");
const reviewController = require("./../controller/reviewController");

router
  .route("/")
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("client"),
    reviewController.createReview
  );

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("client", "admin"),
    reviewController.deleteReview
  );

module.exports = router;