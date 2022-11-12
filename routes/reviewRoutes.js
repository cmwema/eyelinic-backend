const router = require("express").Router({ mergeParams: true });
const reviewController = require("./../controller/reviewController");

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createServiceUserIds, reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
