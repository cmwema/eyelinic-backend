const mongoose = require("mongoose");
// const User = require("./userModel");
const slugify = require("slugify");

const serviceSchema = new mongoose.Schema(
  {
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
      set: (val) => Math.round(val * 10) / 10,
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

    description: {
      type: String,
      required: true,
      trim: true,
    },

    coverImage: {
      type: String,
    },
    opticians: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { versionKey: false }
);

serviceSchema.index({ price: 1, ratingAverage: -1 }); //price search ordered in ascending  and ratingAverage in descending
serviceSchema.index({ slug: 1 });
// MIDDLEWARES
serviceSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// populating referenced documents on find wuery
serviceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "opticians",
    select:
      "-createdAt -payments -consultations -dateOfBirth -phoneNumber -bookings",
  });
  next();
});

serviceSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "service",
  localField: "_id",
});

serviceSchema.set("toObject", { virtuals: true });
serviceSchema.set("toJSON", { virtuals: true });
const Service = new mongoose.model("Service", serviceSchema);
module.exports = Service;
