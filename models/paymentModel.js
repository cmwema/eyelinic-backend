const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionCode: String,
});

const Payment = new mongoose.model("Payment", paymentSchema);

module.exports = Payment;
