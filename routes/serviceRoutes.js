const router = require("express").Router();

const serviceController = require("./../controllers/serviceController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./reviewRoutes");

router
  .route("/")
  .get(serviceController.getAllServices)
  .post(authController.restrictTo("admin"), serviceController.createService);

router.use("/:serviceId/reviews", reviewRouter);

router.route("/:id").get(serviceController.getService);

router
  .route("/:id")
  .patch(
    authController.restrictTo("admin"),
    serviceController.uploadServiceImages,
    serviceController.resizServiceCoverImage,
    serviceController.updateService
  )
  .delete(authController.restrictTo("admin"), serviceController.deleteService);

module.exports = router;
