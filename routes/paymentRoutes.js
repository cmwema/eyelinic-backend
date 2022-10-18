const express = require("express");

const paymentController = require("./../controller/paymentController");
const router = express.Router();

router
  .route("/")
  .get(paymentController.getAllPayments)
  .post(paymentController.createPayment);
router.route("/:id").get(paymentController.getPayment);
// .patch(paymentController.updatePayment)
// .delete(paymentController.deletePayment);

module.exports = router;
