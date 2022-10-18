const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // unique: true,
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  summary: {
    type: String,
  },
  coverImage: {
    type: String,
  },
});

const Service = new mongoose.model("Service", serviceSchema);
module.exports = Service;
