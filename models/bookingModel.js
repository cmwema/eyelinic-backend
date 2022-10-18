const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  practitionerId: {
    type: String,
    required: true,
  },
});

const Booking = new mongoose.model("Booking", bookingSchema);

module.exports = Booking;
