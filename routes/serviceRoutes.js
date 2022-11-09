const router = require("express").Router();

const serviceController = require("./../controller/serviceController");
const authController = require("./../controller/authController");
const reviewRouter = require("./reviewRoutes");

router
  .route("/")
  .get(serviceController.getAllServices)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    serviceController.createService
  );

router.use("/:serviceId/reviews", reviewRouter);

router.use(authController.protect);

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
