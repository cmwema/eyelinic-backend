const router = require("express").Router();

const serviceController = require("./../controller/serviceController");
const authController = require("./../controller/authController");

router
  .route("/")
  .get(authController.protect, serviceController.getAllServices)
  .post(serviceController.createService);

router.route("/service-stats").get(serviceController.getServiceStats);
router.route("/monthly-plan/:year").get(serviceController.getMonthlyPlan);

router
  .route("/:id")
  .get(serviceController.getService)
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

module.exports = router;
