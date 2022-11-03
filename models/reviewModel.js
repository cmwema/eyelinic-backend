const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: true,
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
      required: [true, "a review must belong to a service"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must belong to a user"],
    },
  },
  { versionKey: false }
);

reviewSchema.set("toObject", { virtuals: true });
reviewSchema.set("toJSON", { virtuals: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  }).populate({
    path: "service",
    select: "name -opticians ",
  });
  next();
});

const Review = new mongoose.model("Review", reviewSchema);
module.exports = Review;
