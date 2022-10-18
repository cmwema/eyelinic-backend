const express = require("express");

const serviceController = require("./../controller/serviceController");
const router = express.Router();

router
  .route("/")
  .get(serviceController.getAllServices)
  .post(serviceController.createService);

router.route("/service-stats").get(serviceController.getServiceStats);
router.route("/monthly-plan/:year").get(serviceController.getMonthlyPlan);

router
  .route("/:id")
  .get(serviceController.getService)
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

module.exports = router;
