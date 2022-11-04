const router = require("express").Router({ mergeParams: true });
const { authorization } = require("paypal-rest-sdk");
const authController = require("./../controller/authController");
const reviewController = require("./../controller/reviewController");

router
  .route("/")
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("client"),
    reviewController.createServiceUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(authController.protect, reviewController.getReview)
  .patch(authController.protect, reviewController.updateReview)
  .delete(
    authController.protect,
    authController.restrictTo("client", "admin"),
    reviewController.deleteReview
  );

module.exports = router;
