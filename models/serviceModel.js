const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  price: {
    type: Number,
    required: [true, "service must have a price"],
    min: 0,
  },
  priceDiscount: {
    type: Number,
    validate: function (val) {
      return val < this.price;
    },
    min: 0,
    default: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  coverImage: {
    type: String,
  },
});

// MIDDLEWARES
serviceSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

const Service = new mongoose.model("Service", serviceSchema);
module.exports = Service;
