const router = require("express").Router({ mergeParams: true });
const { authorization } = require("paypal-rest-sdk");
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("client"),
    reviewController.createServiceUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(authController.restrictTo("client"), reviewController.updateReview)
  .delete(authController.restrictTo("client"), reviewController.deleteReview);

module.exports = router;
