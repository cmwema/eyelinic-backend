const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // unique: true,
  },
  slug: {
    type: String,
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

// MIDDLEWARES
serviceSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

const Service = new mongoose.model("Service", serviceSchema);
module.exports = Service;
