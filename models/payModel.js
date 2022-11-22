const mongoose = require("mongoose");

const paySchema = new mongoose.Schema({
  Amount: Number,
  MpesaReceiptNumber: String,
  TransactionDate: Number,
  PhoneNumber: Number,
});

paySchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "service",
    select: "name",
  });
  next();
});

const Pay = mongoose.model("Pay", paySchema);

module.exports = Pay;
