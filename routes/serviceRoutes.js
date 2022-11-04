const router = require("express").Router();

const serviceController = require("./../controller/serviceController");
const authController = require("./../controller/authController");
const reviewRouter = require("./reviewRoutes");

/**
 * UNPROTECTED ROUTES
 */

router.use("/:serviceId/reviews", reviewRouter);
router.route("/").get(serviceController.getAllServices);

/**
 * PROTECTED ROUTES
 */

/**
 * USER ROUTES
 */

router.use(authController.protect);

router.route("/:id").get(serviceController.getService);

/**
 * ADMIN ROUTES
 */

router.use(authController.restrictTo("admin"));

router.route("/").post(serviceController.createService);

router.route("/service-stats").get(serviceController.getServiceStats);

router
  .route("/:id")
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

module.exports = router;
