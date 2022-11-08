const router = require("express").Router({ mergeParams: true });
const { authorization } = require("paypal-rest-sdk");
const authController = require("./../controller/authController");
const reviewController = require("./../controller/reviewController");

router.use(authController.protect);

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
