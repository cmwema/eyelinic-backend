const router = require("express").Router();

const serviceController = require("./../controller/serviceController");
const authController = require("./../controller/authController");

router
  .route("/")
  .get(authController.protect, serviceController.getAllServices)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    serviceController.createService
  );

router
  .route("/service-stats")
  .get(authController.protect, serviceController.getServiceStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    serviceController.getMonthlyPlan
  );

router
  .route("/:id")
  .get(authController.protect, serviceController.getService)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    serviceController.updateService
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    serviceController.deleteService
  );

module.exports = router;
