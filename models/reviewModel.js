const mongoose = require("mongoose");
const Service = require("./serviceModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
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

reviewSchema.index({ service: 1 }, { user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

// calculating average rating
reviewSchema.statics.calculateAverageRating = async function (serviceId) {
  const stats = await this.aggregate([
    {
      $match: { service: serviceId },
    },
    {
      $group: {
        _id: "$service",
        numberOfRatings: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats);

  if (stats.length > 0) {
    // persist to dataBase
    await Service.findByIdAndUpdate(serviceId, {
      ratingAverage: stats[0].averageRating,
      ratingQuantity: stats[0].numberOfRatings,
    });
  } else {
    // reset back to dafaults and persist to the database
    await Service.findByIdAndUpdate(serviceId, {
      ratingAverage: 0,
      ratingQuantity: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.service); //called on the Model not on the
});

//recaculating the average rating on update or delete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // get the current document to be passed to the next query middle ware
  this.r = await this.findOne(this.service);
  next();
});

reviewSchema.post(/^findOneAnd/, function () {
  // console.log(this.r);
  // call calculateAverageRating function
  this.r.constructor.calculateAverageRating(this.r.service);
});

const Review = new mongoose.model("Review", reviewSchema);
module.exports = Review;
