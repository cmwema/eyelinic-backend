const router = require("express").Router();

const serviceController = require("./../controllers/serviceController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./reviewRoutes");

router
  .route("/")
  .get(serviceController.getAllServices)
  .post(serviceController.createService);

router.use("/:serviceId/reviews", reviewRouter);

router.route("/:id").get(serviceController.getService);

router
  .route("/:id")
  .patch(
    serviceController.uploadServiceImages,
    serviceController.resizServiceCoverImage,
    serviceController.updateService
  )
  .delete(serviceController.deleteService);

module.exports = router;
